// export const dynamic = "force-dynamic";
import React from "react";
import LayoutWrapper from "@/components/layout/sidebar";
import NewFacilityForm from "@/features/facility/new-facility";

export const metadata = {
  title: "Register Facility",
  description: "Register a new facility",
};

export default function RegisterFacility() {
  return (
    <LayoutWrapper>
      <NewFacilityForm />
    </LayoutWrapper>
  );
}
