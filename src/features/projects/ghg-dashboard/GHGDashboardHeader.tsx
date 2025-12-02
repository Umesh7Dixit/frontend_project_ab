"use client";

import React from "react";
import { motion } from "motion/react";
import {
  TabId,
  TAB_ITEMS,
  YEAR_OPTIONS,
  Year,
  UNIT_OPTIONS,
  Unit,
} from "./insights/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "./SearchBar";
import { plantNameOptions } from "./compare/utils";
import { usePathname } from "next/navigation";

type HeaderProps = {
  tabId: TabId;
  filters: boolean;
  year: Year;
  setYear: (year: Year) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  showSearch: boolean;
  selectedPlants: string[];
  projectName?: string;
  setSelectedPlants: React.Dispatch<React.SetStateAction<string[]>>;
};

const GHGDashboardHeader = ({
  tabId,
  year,
  setYear,
  unit,
  setUnit,
  filters,
  showSearch,
  selectedPlants,
  setSelectedPlants,
  projectName,
}: HeaderProps) => {
  const pathname = usePathname();
  const isGhgDashboard = pathname?.includes("/ghg-dashboard");
  const visibleTabs = isGhgDashboard
    ? TAB_ITEMS.filter((t) => t.label === "Insights")
    : TAB_ITEMS;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg"
    >
      <h1 className="text-lg font-bold mb-2">
        {projectName ?? "GHG Emissions Dashboard"}
      </h1>

      <div className="flex items-center justify-between gap-4">
        {/* <Tabs
          value={String(tabId)}
          onValueChange={(val) => setTabId(Number(val) as TabId)}
        >
          <TabsList>
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={String(tab.id)}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs> */}

        <div className="flex gap-3">
          {showSearch && tabId === 1 && (
            <SearchBar
              options={plantNameOptions}
              selected={selectedPlants}
              onAdd={(plant) => setSelectedPlants((s) => [...s, plant])}
              onRemove={(plant) =>
                setSelectedPlants((s) => s.filter((p) => p !== plant))
              }
            />
          )}
          {filters && tabId !== 1 && (
            <>
              <div>
                <label htmlFor="year" className="text-xs">
                  Filter Year
                </label>
                <Select
                  value={year}
                  onValueChange={(val) => setYear(val as Year)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="unit" className="text-xs">
                  Filter Units
                </label>
                <Select
                  value={unit}
                  onValueChange={(val) => setUnit(val as Unit)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Units" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GHGDashboardHeader;
