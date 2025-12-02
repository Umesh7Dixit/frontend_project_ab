"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#2b5f5d]" />
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  );
}
