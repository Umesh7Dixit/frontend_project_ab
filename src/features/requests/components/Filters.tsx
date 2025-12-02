"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  count: number;
  onSortChange: (val: string) => void;
}


const Filters = ({ status, onStatusChange, sortBy, onSortChange, count }: FiltersProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-3 px-5 rounded-2xl bg-white/70 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex gap-4 w-full sm:w-auto">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-gray-600 min-w-fit">
        Showing {count} requests
      </div>
    </motion.header>

  );
};

export default Filters;
