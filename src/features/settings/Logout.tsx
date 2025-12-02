"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Logout = () => {
  const router = useRouter();
  const handleLogout = () => {
    // API call will go here
    Cookies.remove("user_info");
    Cookies.remove("org-info");
    Cookies.remove("user_data");
    if (typeof window !== "undefined") {
      localStorage.removeItem("projectId");
      localStorage.removeItem("facility_id");
    }
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="rounded-lg text-sm px-4 py-2 flex items-center gap-2 w-full"
    >
      <LogOut size={16} />
      Logout
    </Button>
  );
};

export default Logout;
