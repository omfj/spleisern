import { SignUp } from "@clerk/remix";

export default function LogInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
