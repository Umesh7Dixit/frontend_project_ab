"use client";
import LayoutWrapper from "@/components/layout/sidebar";
import PreviewPage from "@/features/projects/templates/preview";
import { use } from "react";
import { getProjectId } from "@/lib/jwt";

const TemplatePreview: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const { id } = use(params);
  const templateId = Number(id);
  const projectId = getProjectId();
  return (
    <LayoutWrapper>
      <PreviewPage templateID={templateId} projectId={projectId} />
    </LayoutWrapper>
  );
};

export default TemplatePreview;