import LayoutWrapper from "@/components/layout/sidebar";
import DataEntryPage from "@/features/projects/data-entry";
import {
  getMockProjectData,
  ProjectMock,
} from "@/features/projects/data-entry/utils";
import { projectId } from "@/lib/jwt";

type Props = {
  params: Promise<{ projectId: string }>;
};

export const metadata = {
  title: "Data Collection",
  description: "Data Collection",
};

export default async function Page({ params }: Props) {
  const resolvedProjectId = projectId ?? "proj-demo";
  
  // server-side: fetch mock (replace with real fetch later)
  const data: ProjectMock = getMockProjectData(resolvedProjectId);
  
  return (
    <LayoutWrapper>
      <DataEntryPage initialData={data} />
    </LayoutWrapper>
  );
}