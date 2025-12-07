"use client";

import { motion } from "motion/react";

type KPIProps = {
  title: string;
  subtitle: string;
  value: string;
  unit: string;
};

type Props = {
  total: number;
  scope1: number;
  scope2: number;
  scope3: number;
};

const GHGDashboardKPI = ({ total, scope1, scope2, scope3 }: Props) => {
  const kpis: KPIProps[] = [
    {
      title: "Total",
      subtitle: "Scope 1, 2 & 3",
      value: total.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      unit: "tCO₂e",
    },
    {
      title: "Scope 1",
      subtitle: "",
      value: scope1.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      unit: "tCO₂e",
    },
    {
      title: "Scope 2",
      subtitle: "",
      value: scope2.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      unit: "tCO₂e",
    },
    {
      title: "Scope 3",
      subtitle: "",
      value: scope3.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      unit: "tCO₂e",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
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
