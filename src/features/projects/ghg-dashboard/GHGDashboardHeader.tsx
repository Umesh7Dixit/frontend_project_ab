"use client";

import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAB_ITEMS, TabId } from "./insights/utils";
import SearchBar from "./SearchBar";
type Props = {
  projectName?: string;
  tabId?: TabId;
  main: boolean;
  setTabId?: (id: TabId) => void;
  availableYears?: number[];
  selectedYear?: string | number;
  setSelectedYear?: (year: string | number) => void;
  availableFacilities?: string[];
  selectedUnit?: string;
  setSelectedUnit?: (unit: string) => void;
  selectedFacilitiesForCompare: string[];
  setSelectedFacilitiesForCompare: React.Dispatch<React.SetStateAction<string[]>>;
}

const GHGDashboardHeader = ({
  projectName,
  selectedFacilitiesForCompare,
  setSelectedFacilitiesForCompare,
  tabId,
  setTabId,
  availableYears = [],
  selectedYear,
  setSelectedYear,
  availableFacilities = [],
  selectedUnit,
  setSelectedUnit,
  main
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col z-50 py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg"
    >
      <h1 className="text-lg font-bold mb-2">
        {projectName ?? "GHG Emissions Dashboard"}
      </h1>
      {
        main && (
          <div className="flex items-center justify-between gap-4">
            <Tabs
              value={String(tabId)}
              onValueChange={(val) => setTabId?.(Number(val) as TabId)}
            >
              <TabsList>
                {TAB_ITEMS.map((tab) => (
                  <TabsTrigger key={tab.id} value={String(tab.id)}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              {tabId === 1 && (
                <SearchBar
                  options={availableFacilities}
                  selected={selectedFacilitiesForCompare}
                  onAdd={(plant) => setSelectedFacilitiesForCompare((s) => [...s, plant])}
                  onRemove={(plant) =>
                    setSelectedFacilitiesForCompare((s) => s.filter((p) => p !== plant))
                  }
                />
              )}
              {
                tabId !== 1 && (<>
                  <div>
                    <label htmlFor="year" className="text-xs">
                      Filter Year
                    </label>
                    <Select
                      value={selectedYear ? String(selectedYear) : undefined}
                      onValueChange={(val) => {
                        if (val === "All") setSelectedYear?.("All");
                        else setSelectedYear?.(Number(val));
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {availableYears.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="unit" className="text-xs">
                      Filter Facility
                    </label>
                    <Select
                      value={selectedUnit}
                      onValueChange={(val) => setSelectedUnit?.(val)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Facility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {availableFacilities.length > 0 ? (
                          availableFacilities.map((u, i) => (
                            <SelectItem key={i} value={u}>
                              {u}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No Facilities Available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </>)
              }
            </div>
          </div>
        )
      }
    </motion.div>
  );
};

export default GHGDashboardHeader;
