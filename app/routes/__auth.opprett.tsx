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
import { getDB } from "~/db/client.server";
import { SettlementService } from "~/db/queries.server";
import { requireAuth } from "~/lib/session.server";
import { SettlementState } from "~/stores/settlement";

export const meta: MetaFunction = () => {
  return [{ title: "Opprett | Spleiser'n" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);

  return null;
};

export default function CreatePage() {
  return (
    <div className="max-w-screen-sm mx-auto px-4">
      <HoverCard>
        <Settlement />
      </HoverCard>
    </div>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await requireAuth(args);

  const formData = await args.request.formData();

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

  const id = nanoid();
  const db = getDB(args);
  const ss = new SettlementService(db);
  await ss.add(id, userId, settlement);

  return redirect(`/oppgjor/${id}`);
};
