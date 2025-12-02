"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "@/lib/axios/axios";

type ProjectSummary = {
  project_name: string;
  total_carbon: number;
  scope_1_total: number;
  scope_2_total: number;
  scope_3_total: number;
};

type KPIProps = {
  title: string;
  subtitle: string;
  value: string;
  unit: string;
};

const GHGDashboardKPI = ({ projectId }: { projectId: number }) => {
  const [data, setData] = useState<ProjectSummary | null>(null);

  const fetchKPI = async () => {
    try {
      const res = await axios.post("/get_project_total_emissions_summary", {
        p_project_id: projectId,
      });
      setData(res.data.data.templates[0]);
    } catch (e) {
      console.error("Failed to fetch KPI:", e);
    }
  };

  useEffect(() => {
    fetchKPI();
  }, []);

  const kpis: KPIProps[] = [
    {
      title: "Total",
      subtitle: "Scope 1, 2 & 3",
      value: Number(data?.total_carbon).toFixed(0),
      unit: "tCO₂e",
    },
    {
      title: "Scope 1",
      subtitle: "",
      value: Number(data?.scope_1_total).toFixed(0),
      unit: "tCO₂e",
    },
    {
      title: "Scope 2",
      subtitle: "",
      value: Number(data?.scope_2_total).toFixed(0),
      unit: "tCO₂e",
    },
    {
      title: "Scope 3 (Upstream)",
      subtitle: "",
      value: Number(data?.scope_3_total).toFixed(0),
      unit: "tCO₂e",
    },
    {
      title: "Scope 3 (Downstream)",
      subtitle: "",
      value: Number(data?.scope_3_total).toFixed(0),
      unit: "tCO₂e",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="flex flex-col justify-between p-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-lg border border-white/20"
        >
          <h3 className="text-sm font-medium text-gray-700">{kpi.title}</h3>
          {kpi.subtitle && (
            <p className="text-xs text-gray-500">{kpi.subtitle}</p>
          )}
          <div className="flex flex-col justify-center">
            <p className="mt-2 text-2xl font-bold text-emerald-600 font-montserrat">
              {kpi.value}
            </p>
            <span className="text-sm font-medium text-gray-600">
              {kpi.unit}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GHGDashboardKPI;
