"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import axios from "@/lib/axios/axios";
import GHGDashboardHeader from "./GHGDashboardHeader";
import { SCOPE_COLORS } from "./insights/utils";
import GHGDashboardKPI from "./insights/GHGDashboardKPI";
import GHGEmissionsPie, { EmissionSlice } from "./insights/GHGEmissionsPie";
import GHGEmissionsBar from "./insights/GHGEmissionsBar";
import GHGBreakdownChart from "./insights/GHGBreakdownChart";
import { getProjectId } from "@/lib/jwt";
import { useProject } from "@/lib/context/ProjectContext";

const GHGDashboard = () => {
  const { summary } = useProject();
  const projectId = getProjectId();

  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    total: 0,
    scope1: 0,
    scope2: 0,
    scope3: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        const res = await axios.post("/get_project_category_monthly_carbon", {
          p_project_id: projectId,
        });

        const rows = res.data?.data?.templates || [];
        setDashboardData(rows);

        let t = 0;
        let s1 = 0;
        let s2 = 0;
        let s3 = 0;

        rows.forEach((r: any) => {
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

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

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
        projectName={summary?.project_name}
      />

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
        <GHGEmissionsBar data={dashboardData} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        exit={{ opacity: 0 }}
        className="w-full"
      >
        <GHGBreakdownChart data={dashboardData} />
      </motion.div>

    </div>
  );
};

export default GHGDashboard;
