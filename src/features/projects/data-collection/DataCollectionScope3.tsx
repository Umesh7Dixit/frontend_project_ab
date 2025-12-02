"use client";

import EmissionFactorSelector from "./EmissionFactorSelector";

interface Props {
  currentScope: number;
  searchQuery: string;
  database?: "GHG Protocol" | "DEFRA";
}

export default function DataCollectionScope3({
  currentScope,
  searchQuery,
  database,
}: Props) {
  return (
    <div className="flex flex-col size-full">
      <EmissionFactorSelector
        scope={currentScope}
        database={database || "GHG Protocol"}
        searchQuery={searchQuery}
      // customRoots={activeNode.children}
      />

    </div>
  );
}
