"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import GHGDashboardHeader from "./GHGDashboardHeader";
import {
  TabId,
  Year,
  Unit,
  YEAR_OPTIONS,
  UNIT_OPTIONS,
  SCOPE_COLORS,
} from "./insights/utils";
import GHGDashboardKPI from "./insights/GHGDashboardKPI";
import GHGEmissionsPie, { EmissionSlice } from "./insights/GHGEmissionsPie";
import GHGEmissionsBar from "./insights/GHGEmissionsBar";
import GHGBreakdownChart from "./insights/GHGBreakdownChart";
import CompareTable from "./compare/CompareTable";
import CompareBarChart from "./compare/CompareBarChart";
import GHGCompareBreakdown from "./compare/GHGCompareBreakdown";
import DecarbonizationKPIs from "./decarbonization/DecarbonizationKPIs";
import DecarbonizationCharts from "./decarbonization/DecarbonizationCharts";
import SelectProjectsTable from "./decarbonization/SelectProjectsTable";
import { projectId } from "@/lib/jwt";
import { useProject } from "@/lib/context/ProjectContext";

interface GHGDashboardProps {
  filters?: boolean;
}


const GHGDashboard = ({ filters = false }: GHGDashboardProps) => {
  const [tabId, setTabId] = useState<TabId>(0);
  const [year, setYear] = useState<Year>(YEAR_OPTIONS[0]);
  const [unit, setUnit] = useState<Unit>(UNIT_OPTIONS[0]);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const { summary } = useProject();

  const chartData: EmissionSlice[] = [
    {
      name: "Scope 1",
      value: summary?.scope_1_total ?? 0,
      color: SCOPE_COLORS.scope1,
    },
    {
      name: "Scope 2",
      value: summary?.scope_2_total ?? 0,
      color: SCOPE_COLORS.scope2,
    },
    {
      name: "Scope 3 (Upstream)",
      value: summary?.scope_3_total ?? 0,
      color: SCOPE_COLORS.scope3Upstream,
    },
    {
      name: "Scope 3 (Downstream)",
      value: 0,
      color: SCOPE_COLORS.scope3Downstream,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <GHGDashboardHeader
        tabId={tabId}
        filters={filters}
        year={year}
        projectName={summary?.project_name}
        setYear={setYear}
        unit={unit}
        setUnit={setUnit}
        showSearch
        selectedPlants={selectedPlants}
        setSelectedPlants={setSelectedPlants}
      />

      {tabId === 0 && (
        <>
          <GHGDashboardKPI projectId={projectId ?? 0} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0 }}
            key={`${year}-${unit}-piebar`}
            className="flex justify-center gap-4 w-full"
          >
            <GHGEmissionsPie chartData={chartData} total={summary?.total_carbon ?? 0} />
            <GHGEmissionsBar projectId={projectId ?? 0} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0 }}
            key={`${year}-${unit}-breakdown`}
            className="w-full"
          >
            <GHGBreakdownChart />
          </motion.div>
        </>
      )}

      {tabId === 1 && (
        <>
          <CompareTable />
          <CompareBarChart selectedPlants={selectedPlants} />
          <GHGCompareBreakdown selectedPlants={selectedPlants} />
        </>
      )}

      {tabId === 2 && (
        <>
          <DecarbonizationKPIs />
          <DecarbonizationCharts />
          <SelectProjectsTable />
        </>
      )}
    </div>
  );
};

export default GHGDashboard;
