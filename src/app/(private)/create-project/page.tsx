import LayoutWrapper from "@/components/layout/sidebar";
import NewProject from "@/features/projects/new-project";
import React from "react";

export const metadata = {
  title: "Create Project",
  description: "Create a new project",
};

const CreateProject = () => {
  return (
    <LayoutWrapper>
      <NewProject />
    </LayoutWrapper>
  );
};

export default CreateProject;
