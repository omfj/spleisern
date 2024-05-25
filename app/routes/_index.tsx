import { SignUp } from "@clerk/remix";
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

  if (userId) {
    throw redirect("/hjem");
  }

  return null;
};

export default function IndexPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
