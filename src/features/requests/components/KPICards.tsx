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

const KPI_Icons: Record<string, React.ReactNode> = {
  "Total Requests Raised": <FolderKanban className="w-6 h-6 text-blue-600" />,
  "Pending Requests": <PlayCircle className="w-6 h-6 text-amber-500" />,
  "Resolved Requests": <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
  "Requests Raised by you": <UserCircle className="w-6 h-6 text-indigo-600" />,
  "Requests Raised by team": <Share2 className="w-6 h-6 text-purple-600" />,
};


type KPIData = {
  label: string;
  value: number;
};
const KPICards = ({ kpiData }: { kpiData: KPIData[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="flex flex-row gap-4 w-full"
    >
      {kpiData.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex-1 bg-white/70 backdrop-blur-lg rounded-xl px-6 py-4 
                     flex flex-col items-center justify-center shadow-xl 
                     hover:-translate-y-1 transition-all"
        >
          <div className="mb-2">{KPI_Icons[card.label]}</div>
          <div className="font-bold font-montserrat text-2xl text-gray-700">
            {card.value}
          </div>
          <div className="text-xs mt-1 text-gray-600 text-center">
            {card.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default KPICards;
