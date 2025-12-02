import LayoutWrapper from "@/components/layout/sidebar";
import RaiseRequests from "@/features/requests/RaiseRequests";
import React from "react";

export const metadata = {
  title: "RaiseRequest",
  description: "RaiseRequest",
};

const RaiseRequest = () => {
  return (
    <LayoutWrapper>
      <RaiseRequests />
    </LayoutWrapper>
  );
};

export default RaiseRequest;
