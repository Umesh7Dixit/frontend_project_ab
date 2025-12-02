import LayoutWrapper from "@/components/layout/sidebar";
import DataCollectionPage from "@/features/projects/data-collection";
import {
  CategoryNode,
  dataCollectionNodes as nodes,
} from "@/features/projects/data-collection/utils";
import { projectId } from "@/lib/jwt";

export const metadata = {
  title: "Data Collection",
  description: "Data Collection",
};

export default async function Page() {

  const data = await fetchCategories();

  return (
    <LayoutWrapper>
      <DataCollectionPage projectId={projectId} data={data} />
    </LayoutWrapper>
  );
}

async function fetchCategories(): Promise<{
  nodes: CategoryNode[];
  initialSelected: number[];
}> {
  const initialSelected: number[] = [1, 2, 22];
  return { nodes, initialSelected };
}