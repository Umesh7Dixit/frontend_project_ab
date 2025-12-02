"use client";

import React from "react";
import { motion } from "motion/react";
import { Layers} from "lucide-react";
import { MY_PROJECTS_ITEMS } from "@/lib/constants";

const MyProjectsHeader = ({ currentPage }: { currentPage: string }) => {
  const title = MY_PROJECTS_ITEMS[currentPage] || currentPage;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex items-center justify-between p-4 bg-gray-100 border rounded-xl shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-12 rounded-xl bg-gray-200 border border-gray-100 text-gray-600">
          <Layers className="size-6" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col space-y-0.5">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </motion.header>
  );
};

export default MyProjectsHeader;