import { AuthenticateWithRedirectCallback } from "@clerk/remix";

export default function SSOCallBack() {
  return <AuthenticateWithRedirectCallback />;
}
