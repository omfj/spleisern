import { getAuth } from "@clerk/remix/ssr.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { nanoid } from "nanoid";
import { HoverCard } from "~/components/hover-card";
import { Settlement } from "~/components/settlement";
import { getDrizzle } from "~/db/client.server";
import { members, products, settlements } from "~/db/schemas";
import { membersToProducts } from "~/db/schemas/members-to-products";
import { SettlementState } from "~/stores/settlement";

export const meta: MetaFunction = () => {
  return [{ title: "Opprett | Spleiser'n" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/logg-inn");
  }

  return null;
};

export default function CreatePage() {
  return (
    <div>
      <div className="max-w-screen-sm mx-auto px-4">
        <HoverCard>
          <Settlement />
        </HoverCard>
      </div>
    </div>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/logg-inn");
  }

  const { request, context } = args;

  const formData = await request.formData();

  const settlement = JSON.parse(
    formData.get("settlement") as string
  ) as SettlementState;

  const errors = [];

  if (!settlement.name) {
    errors.push("Navn er påkrevd");
  }

  if (settlement.products.length < 2) {
    errors.push("Det må være minst to produkter");
  }

  if (settlement.members.length < 2) {
    errors.push("Det må være minst to medlemmer");
  }

  if (errors.length > 0) {
    return json({ success: false, errors } as const);
  }

  const settlementId = nanoid();

  const db = getDrizzle(context.cloudflare.env.DB);

  await db.insert(settlements).values({
    id: settlementId,
    name: settlement.name,
    isPublic: true,
    owner: userId,
  });

  await db.insert(products).values(
    settlement.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      settlementId,
    }))
  );

  await db.insert(members).values(
    settlement.members.map((member) => ({
      id: member.id,
      name: member.name,
      settlementId,
    }))
  );

  await db.insert(membersToProducts).values(
    settlement.memberToProducts.map((relation) => ({
      memberId: relation.memberId,
      productId: relation.productId,
      settlementId,
    }))
  );

  return json({ success: true, id: settlementId, errors: [] } as const);
};
