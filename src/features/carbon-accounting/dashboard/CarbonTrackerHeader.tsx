"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useProject } from "@/lib/context/ProjectContext";

export default function CarbonTrackerHeader({
  onOpen,
}: {
  onOpen: () => void;
  }) {
  const { summary } = useProject();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 
                 p-4 rounded-2xl border border-white/20 
                 bg-[rgba(255,255,255,0.15)] backdrop-blur-lg shadow-lg"
    >
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-[#0b1f1d]">
          {summary?.project_name || "Project name"}
        </h1>
      </div>

      <Button
        variant="outline"
        onClick={onOpen}
        className="flex items-center gap-2 rounded-xl border-secondary bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
      >
        <Settings className="h-4 w-4" />
        Customize Scopes
      </Button>
    </motion.div>
  );
}
