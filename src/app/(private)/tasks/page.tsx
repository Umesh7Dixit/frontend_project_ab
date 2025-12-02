import LayoutWrapper from "@/components/layout/sidebar";
import TasksPage from "@/features/tasks";
import React from "react";

export const metadata = {
  title: "Tasks",
  description: "Tasks",
};

const Tasks = () => {
  return (
    <LayoutWrapper>
      <TasksPage />
    </LayoutWrapper>
  );
};

export default Tasks;
