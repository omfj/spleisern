import { getAuth } from "@clerk/remix/ssr.server";
import {
  type MetaFunction,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "Spleisern" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/logg-inn");
  }

  throw redirect("/hjem");
};
