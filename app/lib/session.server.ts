import { getAuth } from "@clerk/remix/ssr.server";
import { redirect } from "@remix-run/cloudflare";

import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

type RequireAuthOptions = {
  redirectUrl?: string;
};

export const requireAuth = async (
  args: LoaderFunctionArgs,
  opts?: RequireAuthOptions
) => {
  const auth = await getAuth(args);

  if (!auth.userId) {
    throw redirect(opts?.redirectUrl ?? "/logg-inn");
  }

  return auth;
};
