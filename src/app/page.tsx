import LayoutWrapper from "@/components/layout/sidebar";
import MainPage from "@/features/main-page";
import { COOKIE_USER_INFO } from "@/lib/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata : Metadata = {
  title: "CarbonScan.ai",
  description: "CarbonScan.ai",
};

export default async function RootRedirect() {
  const cookieStore = await cookies();
  const hasLoggedIn = cookieStore.get(COOKIE_USER_INFO);

  if (!hasLoggedIn) redirect("/login");
  return (
    <LayoutWrapper>
      <MainPage />
    </LayoutWrapper>
  );
}
