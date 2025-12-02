"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TaskHeader = ({ children, className }: PageHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center justify-between py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-[10px] shadow-lg",
        className
      )}
    >
      {children}
    </motion.header>
  );
};

export default TaskHeader;
