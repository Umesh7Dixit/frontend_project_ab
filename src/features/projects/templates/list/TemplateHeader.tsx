"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface TemplateHeaderProps {
  onCreate?: () => void;
  searchQuery: string;
  onSearch: (value: string) => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  onCreate,
  searchQuery,
  onSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-md shadow-md"
    >
      <h1 className="text-2xl font-bold">Select Template</h1>

      <div className="relative w-full md:max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 pr-3 py-2 rounded-lg bg-white/80 border border-gray-200 text-sm shadow-inner w-full"
        />
      </div>

      <Button
        onClick={onCreate}
        className="rounded-full px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white font-medium flex items-center gap-2 shadow md:flex-1 md:max-w-fit"
      >
        <Plus size={16} /> Create New
      </Button>
    </motion.div>
  );
};

export default TemplateHeader;
