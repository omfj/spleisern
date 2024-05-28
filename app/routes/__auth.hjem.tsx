import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { Hero } from "~/components/hero";
import { HoverCard } from "~/components/hover-card";
import { ButtonLink } from "~/components/ui/buttons";
import { getDB } from "~/db/client.server";
import { SettlementService } from "~/db/queries.server";
import { requireAuth } from "~/lib/session.server";
import { formatDate } from "~/utils/date";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "Hjem | Spleiser'n" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await requireAuth(args);
  const ss = new SettlementService(getDB(args));

  const settlements = await ss.findAllByUserId(userId);

  return json({
    settlements,
  });
};

export default function HomePage() {
  const { settlements } = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />

      <HoverCard className="container">
        {settlements.length > 0 ? (
          <div className="divide-y">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="flex items-center">
                <div className="py-2 flex flex-col flex-1">
                  <p className="text-gray-600 font-medium">{settlement.name}</p>
                  <p className="text-gray-500 text-sm">
                    Laget: {formatDate(new Date(settlement.createdAt))}
                  </p>
                </div>
                <ButtonLink to={`/oppgjor/${settlement.id}`}>
                  Se oppgjør
                </ButtonLink>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-xl font-medium">
            Ingen spleiser opprettet
          </p>
        )}
      </HoverCard>
    </div>
  );
}
