import { getAuth } from "@clerk/remix/ssr.server";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { HoverCard } from "~/components/hover-card";
import { ButtonLink } from "~/components/ui/buttons";
import { getDB } from "~/db/client.server";

export const meta: MetaFunction = () => {
  return [{ title: "Hjem | Spleisern" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/logg-inn");
  }

  const db = getDB(args);

  const settlements = await db.query.settlements.findMany({
    where: (settlement, { eq }) => eq(settlement.owner, userId),
  });

  return json({
    settlements,
  });
};

export default function HomePage() {
  const { settlements } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="py-8 flex flex-col gap-4 text-center">
        <h1 className="text-5xl font-bold">{"Spleiser'n"}</h1>
        <p className="text-gray-700 text-lg font-medium">
          Opprett en spleis og inviter venner til å bidra.
        </p>

        <ButtonLink className="mx-auto" to="/opprett">
          {"Opprett spleis"}
        </ButtonLink>
      </div>

      <div className="max-w-screen-sm mx-auto px-4">
        <HoverCard>
          {settlements.length > 0 ? (
            <div className="divide-y">
              {settlements.map((settlement) => (
                <div key={settlement.id} className="py-2 flex items-center">
                  <p className="text-gray-600 font-medium flex-1">
                    {settlement.name}
                  </p>
                  <ButtonLink to={`/oppgjor/${settlement.id}`}>
                    {"Se oppgjør"}
                  </ButtonLink>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center text-xl font-medium">
              {"Ingen spleiser opprettet"}
            </p>
          )}
        </HoverCard>
      </div>
    </div>
  );
}
