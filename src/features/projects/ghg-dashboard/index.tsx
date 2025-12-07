"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import axios from "@/lib/axios/axios";
import GHGDashboardHeader from "./GHGDashboardHeader";
import { SCOPE_COLORS, TabId } from "./insights/utils";
import GHGDashboardKPI from "./insights/GHGDashboardKPI";
import GHGEmissionsPie, { EmissionSlice } from "./insights/GHGEmissionsPie";
import GHGEmissionsBar from "./insights/GHGEmissionsBar";
import GHGBreakdownChart from "./insights/GHGBreakdownChart";
import { getProjectId, getUserId } from "@/lib/jwt";
import { useProject } from "@/lib/context/ProjectContext";
import CompareTable from "./compare/CompareTable";
import CompareBarChart from "./compare/CompareBarChart";
import GHGCompareBreakdown from "./compare/GHGCompareBreakdown";
import DecarbonizationKPIs from "./decarbonization/DecarbonizationKPIs";
import DecarbonizationCharts from "./decarbonization/DecarbonizationCharts";
import SelectProjectsTable from "./decarbonization/SelectProjectsTable";

const GHGDashboard = ({ main }: { main: boolean }) => {
  const { summary } = useProject();
  const projectId = getProjectId();

  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    total: 0,
    scope1: 0,
    scope2: 0,
    scope3: 0,
  });
  const [tabId, setTabId] = useState<TabId>(0);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | number>("All");
  const [availableFacilities, setAvailableFacilities] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("All");
  const [selectedFacilitiesForCompare, setSelectedFacilitiesForCompare] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      let res;
      if (main) {
        res = await axios.post("/get_organization_monthly_carbon_verified_by_user", {
          p_user_id: getUserId(),
        });
      } else {
        if (!projectId) return;
        res = await axios.post("/get_project_category_monthly_carbon", {
          p_project_id: projectId,
        });
      }

      const rows = res.data?.data?.templates || [];
      setDashboardData(rows);

      const uniqueYears = Array.from(new Set(rows.map((r: any) => {
        if (!r.reporting_month) return null;
        const parts = r.reporting_month.split(" ");
        return parts.length === 2 ? parseInt(parts[1]) : null;
      }).filter((y: number | null) => y !== null && !isNaN(y)))) as number[];

      const sortedYears = uniqueYears.sort((a, b) => b - a);
      setAvailableYears(sortedYears);
      if (sortedYears.length > 0) {
        setSelectedYear("All");
      }

      const uniqueFacilities = Array.from(new Set(rows.map((r: any) => r.facility_name).filter((n: any) => n))) as string[];
      setAvailableFacilities(uniqueFacilities);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }

  };

  useEffect(() => {
    fetchData();
    if (availableFacilities.length > 0) {
      setSelectedFacilitiesForCompare([availableFacilities[0]]);
    }
  }, []);

  const filteredData = useMemo(() => {
    return dashboardData.filter((r) => {
      let matchesYear = true;
      if (selectedYear && selectedYear !== "All") {
        matchesYear = r.reporting_month?.includes(String(selectedYear));
      }

      let matchesUnit = true;
      if (selectedUnit && selectedUnit !== "All") {
        matchesUnit = r.facility_name === selectedUnit;
      }

      return matchesYear && matchesUnit;
    });
  }, [dashboardData, selectedYear, selectedUnit]);

  useEffect(() => {
    let t = 0;
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;

    filteredData.forEach((r: any) => {
      const val = Number(r.total_carbon || 0);
      t += val;
      const sName = r.scope_name?.toLowerCase() || "";
      if (sName.includes("scope 1")) s1 += val;
      else if (sName.includes("scope 2")) s2 += val;
      else if (sName.includes("scope 3")) s3 += val;
    });

    setTotals({
      total: t,
      scope1: s1,
      scope2: s2,
      scope3: s3,
    });
  }, [filteredData]);

  const chartData: EmissionSlice[] = [
    {
      name: "Scope 1",
      value: totals.scope1,
      color: SCOPE_COLORS.scope1,
    },
    {
      name: "Scope 2",
      value: totals.scope2,
      color: SCOPE_COLORS.scope2,
    },
    {
      name: "Scope 3",
      value: totals.scope3,
      color: SCOPE_COLORS.scope3,
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <GHGDashboardHeader
        selectedFacilitiesForCompare={selectedFacilitiesForCompare}
        setSelectedFacilitiesForCompare={setSelectedFacilitiesForCompare}
        main={main}
        tabId={tabId}
        availableYears={availableYears}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableFacilities={availableFacilities}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        setTabId={setTabId}
        projectName={summary?.project_name}
      />

      {tabId === 0 && (
        <>
          <GHGDashboardKPI
            total={totals.total}
            scope1={totals.scope1}
            scope2={totals.scope2}
            scope3={totals.scope3}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0 }}
            className="flex justify-center gap-4 w-full"
          >
            <GHGEmissionsPie chartData={chartData} total={totals.total} />
            <GHGEmissionsBar data={filteredData} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <GHGBreakdownChart data={filteredData} />
          </motion.div>
        </>
      )}

      {tabId === 1 && (
        <>
          <CompareTable data={dashboardData} />
          <CompareBarChart
            selectedFacilitiesForCompare={selectedFacilitiesForCompare}
            data={dashboardData}
            availableYears={availableYears}
          />
          <GHGCompareBreakdown
            selectedFacilitiesForCompare={selectedFacilitiesForCompare}
            data={dashboardData}
          />
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
