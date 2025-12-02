import LayoutWrapper from "@/components/layout/sidebar";
import SettingsPage from "@/features/settings";
import React from "react";

export const metadata = {
  title: "Settings",
  description: "Settings",
};

const Settings = () => {
  return (
    <LayoutWrapper>
      <SettingsPage/>
    </LayoutWrapper>
  );
};

export default Settings;
