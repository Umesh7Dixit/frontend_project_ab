import LayoutWrapper from "@/components/layout/sidebar";
import FacilityForm from "@/features/facility/facility-login";
import React from "react";

export const metadata = {
  title: "Facility Login",
  description: "Facility Login",
};

const FacilityLogin = () => {
  return (
    <LayoutWrapper>
      <FacilityForm />
    </LayoutWrapper>
  );
};

export default FacilityLogin;
