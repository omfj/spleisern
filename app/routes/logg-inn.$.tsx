import { SignUp } from "@clerk/remix";

import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "Logg inn | Spleiser'n" }];
};

export default function LogInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
