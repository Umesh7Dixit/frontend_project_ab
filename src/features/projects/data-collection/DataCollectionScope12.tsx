"use client";
import EmissionFactorSelector, { databaseType } from "./EmissionFactorSelector";

interface Props {
  currentScope: number;
  searchQuery: string;
  database?: databaseType;
}
export default function DataCollectionScope12({
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
      />
    </div>
  );
}
