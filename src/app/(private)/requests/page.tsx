import LayoutWrapper from "@/components/layout/sidebar";
import RequestsPage from "@/features/requests/Requests";
import React from "react";

export const metadata = {
  title: "Requests",
  description: "Requests",
};

const Requests = () => {
  return (
    <LayoutWrapper>
      <RequestsPage />
    </LayoutWrapper>
  );
};

export default Requests;
