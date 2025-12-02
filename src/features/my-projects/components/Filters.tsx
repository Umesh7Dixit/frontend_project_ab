"use client";

import React from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const Filters = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-3 px-5 rounded-2xl bg-white/70 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div className="relative flex flex-col w-full sm:w-1/3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <Input
          type="text"
          placeholder="Search by project ID or Owner"
          className="pl-9 pr-3 py-2 rounded-lg border border-secondary text-sm shadow-inner w-full placeholder:text-xs"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex flex-col">
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="efficiency">Efficiency</SelectItem>
              <SelectItem value="renewable">Renewable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Date Created" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unit1">Unit 1</SelectItem>
              <SelectItem value="unit2">Unit 2</SelectItem>
              <SelectItem value="unit3">Unit 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.header>
  );
};

export default Filters;
