"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { KPI_Icons, kpiData, KPIGridProps } from "./utils";
import { projectStats, ProjectStatsType, getProjectStats } from "../my-projects/utils";
import { getUserId } from "@/lib/jwt";

const getAllData = () => {
  const cbam = kpiData.CBAM;
  const ghg = kpiData.GHG;

  return cbam.map((item, index) => ({
    label: item.label.replace("CBAM", "ALL"),
    value: (Number(item.value) + Number(ghg[index].value)).toString(),
  }));
};

const KPIGrid: React.FC<KPIGridProps> = () => {
  // const currentData = mode === "ALL" ? getAllData();
  const [stats, setStats] = useState<ProjectStatsType>(projectStats);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    getProjectStats(userId).then(setStats);
  }, [])
  const kpiData = [
    { label: "Total Projects", value: stats.total },
    { label: "On Going Projects", value: stats.onGoing },
    { label: "Completed Projects", value: stats.completed },
    { label: "Owned Projects", value: stats.owned },
    { label: "Shared Projects", value: stats.shared },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="flex flex-col md:flex-row gap-2 w-full"
    >
      <div className="flex-1 md:flex-[2]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-xl bg-white/80 p-4 flex flex-col items-center justify-center shadow-sm relative h-full min-h-[200px]"
          key={0}
        >
          <div className="absolute top-2 right-2 opacity-70">
            {KPI_Icons[kpiData[0].label]}
          </div>
          <div className="font-montserrat font-bold text-4xl text-gray-700">
            {kpiData[0].value}
          </div>
          <div className="text-base font-semibold mt-2 text-gray-600 text-center">
            {kpiData[0].label}
          </div>
        </motion.div>
      </div>
      <div className="flex-1 md:flex-[2]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-full">
          {kpiData.slice(1).map((card, index) => {
            const actualIndex = index + 1;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: actualIndex * 0.1 }}
                className="bg-white/80 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm relative min-h-[90px]"
                key={actualIndex}
              >
                <div className="absolute top-2 right-2 opacity-70">
                  {KPI_Icons[card.label]}
                </div>
                <div className="font-montserrat font-bold text-xl text-gray-700">
                  {card.value}
                </div>
                <div className="text-xs mt-2 text-gray-600 text-center">
                  {card.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default KPIGrid;
