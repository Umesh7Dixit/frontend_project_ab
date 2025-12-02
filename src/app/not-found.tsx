"use client";

import LayoutWrapper from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <LayoutWrapper>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <h1 className="text-4xl font-bold text-[#2b5f5d]">404</h1>
        <p className="text-lg text-gray-600">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <Link href="/dashboard">
          <Button className="bg-[#51b575] hover:bg-[#2b5f5d] text-white">
            Go Back Home
          </Button>
        </Link>
      </div>
    </LayoutWrapper>
  );
}
