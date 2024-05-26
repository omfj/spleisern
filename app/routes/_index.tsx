import { getAuth } from "@clerk/remix/ssr.server";
import {
  type MetaFunction,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "Spleiser'n" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (userId) {
    throw redirect("/hjem");
  }

  throw redirect("/logg-inn");
};
