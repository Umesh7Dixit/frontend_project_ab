"use client";

import React from "react";
import { motion } from "motion/react";
import {
  FolderKanban,
  PlayCircle,
  UserCircle,
  Share2,
  CheckCircle2,
} from "lucide-react";

const KPI_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    gradient: string;
  }
> = {
  "Total Projects": {
    icon: FolderKanban,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "group-hover:border-blue-200",
    gradient: "from-blue-500/20 to-transparent",
  },
  "On Going Projects": {
    icon: PlayCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "group-hover:border-amber-200",
    gradient: "from-amber-500/20 to-transparent",
  },
  "Completed Projects": {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "group-hover:border-emerald-200",
    gradient: "from-emerald-500/20 to-transparent",
  },
  "Owned Projects": {
    icon: UserCircle,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "group-hover:border-indigo-200",
    gradient: "from-indigo-500/20 to-transparent",
  },
  "Shared Projects": {
    icon: Share2,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "group-hover:border-purple-200",
    gradient: "from-purple-500/20 to-transparent",
  },
};

type KPIData = {
  label: string;
  value: number;
};

const KPICards = ({ kpiData }: { kpiData: KPIData[] }) => {
  return (
    <div className="w-full p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-5 gap-4"
      >
        {kpiData.map((data) => {
          const style = KPI_CONFIG[data.label] || KPI_CONFIG["Total Projects"];
          const Icon = style.icon;

          return (
            <motion.div
              key={data.label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`relative group bg-white rounded-xl p-4 border shadow-sm transition-all duration-300 hover:shadow-xl ${style.border} overflow-hidden`}
            >
              <div
                className={`absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br ${style.gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex flex-col items-start justify-between h-full space-y-4">
                <div
                  className={`p-2 rounded-md ${style.bg} ${style.color} ring-1 ring-inset ring-black/5`}
                >
                  <Icon className="size-6" strokeWidth={2} />
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900 tracking-tight font-sans">
                    {data.value}
                  </div>
                  <div className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    {data.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default KPICards;