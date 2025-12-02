"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
// import Navbar from "../navbar/Navbar";
import { toast } from "sonner";
import { isLoggedInClient } from "@/lib/auth/client";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Notification from "@/components/notifications/Notification";

export default function LayoutWrapper({
  children,
  auth = true,
}: {
  children: React.ReactNode;
  auth?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openNotifications, setOpenNotifications] = useState(false);

  useEffect(() => {
    if (!isLoggedInClient() && auth) {
      toast.error("You must be logged in to access this page.");
      // Save intended path before redirect
      if (pathname) {
        sessionStorage.setItem("returnTo", pathname);
      }
      router.replace("/login");
    }
  }, [router, auth, pathname]);

  return (
    <div className="flex min-h-screen relative bg-gradient-to-br from-[#f9fafb] via-[#e5f2ef] to-[#ccfff1]">
      <Sidebar setOpenNotifications={setOpenNotifications} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-auto">
          <Suspense fallback={<LoadingSpinner />}>
            {openNotifications && (
              <Notification
                open={openNotifications}
                onClose={() => setOpenNotifications(false)}
              />
            )}
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
