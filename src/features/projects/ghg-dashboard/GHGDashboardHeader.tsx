"use client";

import { motion } from "motion/react";
const GHGDashboardHeader = ({ projectName }: { projectName?: string }) => {
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
    </motion.div>
  );
};

export default GHGDashboardHeader;
