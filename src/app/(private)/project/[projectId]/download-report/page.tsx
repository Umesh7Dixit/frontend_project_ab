import LayoutWrapper from "@/components/layout/sidebar";
import ReportCard from "@/features/ReportCard";
import React from "react";

export const metadata = {
  title: "Download Report",
  description: "Download Report",
};

const page = () => {
  return (
    <LayoutWrapper>
      <ReportCard />
    </LayoutWrapper>
  );
};

export default page;
