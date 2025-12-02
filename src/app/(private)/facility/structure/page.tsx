import LayoutWrapper from "@/components/layout/sidebar";
import FacilityStructure from "@/features/facility/structure";
import React from "react";

export const metadata = {
  title: "Facility Structure",
  description: "Facility Structure",
};

const Structure = () => {
  return (
    <LayoutWrapper>
      <FacilityStructure />
    </LayoutWrapper>
  );
};

export default Structure;
