import { Outlet } from "@remix-run/react";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

export default function AuthLayout() {
  return (
    <>
      <Header />
      <div className="max-w-screen-lg flex-1 mx-auto w-full">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
