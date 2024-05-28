import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { HoverCard } from "~/components/hover-card";
import { ProductsList } from "~/components/products-list";
import { getDB } from "~/db/client.server";
import { SettlementService } from "~/db/queries.server";
import { formatDate } from "~/utils/date";
import { round } from "~/utils/number";

export const meta: MetaFunction = () => {
  return [{ title: "Oppgjør | Spleiser'n" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const ss = new SettlementService(getDB(args));
  const settlement = await ss.find(args.params.id ?? "");

  if (!settlement) {
    throw new Response("Not found", { status: 404 });
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
      <p>Laget: {formatDate(new Date(settlement.createdAt))}</p>

      <HoverCard className="gap-8">
        <ProductsList products={settlement.products} />
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
                  <p className="text-gray-600 font-medium">{round(total)} kr</p>
                </div>
              );
            })}
          </div>
        </div>
      </HoverCard>
    </div>
  );
}
