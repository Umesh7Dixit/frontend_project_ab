import LayoutWrapper from "@/components/layout/sidebar";
import RequestAccess from "@/features/requests/RequestAccess";
import React from "react";
import { PageProps } from "@/types";

export const metadata = {
  title: "Request Access",
  description: "Request Access",
};

export default async function RequestAccessPage({ params }: PageProps) {
  const requestId = (await params).requestId ?? "0";
  return (
    <LayoutWrapper>
      <RequestAccess requestId={requestId} />
    </LayoutWrapper>
  );
}
