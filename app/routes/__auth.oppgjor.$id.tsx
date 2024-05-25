import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { HoverCard } from "~/components/hover-card";
import { getDB } from "~/db/client.server";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  const settlementId = args.params.id;

  if (!settlementId) {
    throw new Response("Not found", { status: 404 });
  }

  const db = getDB(args);

  const settlement = await db.query.settlements.findFirst({
    where: (settlement, { eq }) => eq(settlement.id, settlementId),
    with: {
      products: {
        with: {
          members: {
            with: {
              member: true,
            },
          },
        },
      },
      members: true,
    },
  });

  if (!settlement) {
    throw new Response("Not found", { status: 404 });
  }

  if (!userId && !settlement.isPublic) {
    throw redirect("/logg-inn");
  }

  return json({
    settlement,
  });
};

export default function SettlementPage() {
  const { settlement } = useLoaderData<typeof loader>();

  return (
    <div className="px-4">
      <h1 className="text-3xl font-medium">{settlement.name}</h1>

      <HoverCard className="gap-8">
        <div>
          <h2 className="text-xl font-medium mb-2">Produkter</h2>
          <div className="divide-y">
            {settlement.products.map((product) => (
              <div key={product.id} className="py-2 flex items-center">
                <div className="flex items-center gap-2 flex-1">
                  <p className="text-gray-600 font-medium">{product.name}</p>
                  <span className="text-sm text-gray-500">
                    (
                    {product.members
                      .map((member) => member.member.name)
                      .join(", ")}
                    )
                  </span>
                </div>

                <p className="text-gray-600 font-medium">{product.price} kr</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-2">Totalt per pers</h2>
          <div className="divide-y">
            {settlement.members.map((member) => {
              const total = settlement.products.reduce((acc, product) => {
                const memberProduct = product.members.find(
                  (m) => m.member.id === member.id
                );

                if (!memberProduct) {
                  return acc;
                }

                return acc + product.price / product.members.length;
              }, 0);

              return (
                <div key={member.id} className="py-2 flex items-center">
                  <p className="text-gray-600 font-medium flex-1">
                    {member.name}
                  </p>
                  <p className="text-gray-600 font-medium">{total} kr</p>
                </div>
              );
            })}
          </div>
        </div>
      </HoverCard>
    </div>
  );
}
