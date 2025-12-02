"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DataCollectionScope12 from "./DataCollectionScope12";
import DataCollectionScope3 from "./DataCollectionScope3";
import { databaseType } from "./EmissionFactorSelector";

interface Props {
  currentScope: number;
  database?: databaseType;
}
export default function DataCollectionShell({
  currentScope,
  database,
}: Props) {
  const activeScope = String(`Scope ${currentScope}`);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex flex-col w-full  h-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4 border-b bg-gray-50/50">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-gray-300 "
          />
        </div>

        <Tabs value={activeScope} className="inline-flex">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="scope1" disabled={currentScope !== 1}>
              Scope 1
            </TabsTrigger>
            <TabsTrigger value="scope2" disabled={currentScope !== 2}>
              Scope 2
            </TabsTrigger>
            <TabsTrigger value="scope3" disabled={currentScope !== 3}>
              Scope 3
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 ">
        {currentScope === 3 ? (
          <DataCollectionScope3
            currentScope={currentScope}
            searchQuery={searchQuery}
            database={database}
          />
        ) : (
          <DataCollectionScope12
            currentScope={currentScope}
            searchQuery={searchQuery}
            database={database}
          />
        )}
      </div>
    </div>
  );
}
