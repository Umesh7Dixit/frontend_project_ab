"use client";

import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { MotionButton } from "@/components/MotionItems";

interface TaskHeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  sortAsc: boolean;
  onToggleSort: () => void;
}

const TaskHeader = ({
  search,
  setSearch,
  sortAsc,
  onToggleSort,
}: TaskHeaderProps) => {
  return (
    <PageHeader className="shadow-sm flex flex-col md:flex-row items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">
        Tasks - Action Required
      </h1>
      <div className="flex items-center gap-3 md:max-w-md w-full">
        <MotionButton
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="secondary"
          onClick={onToggleSort}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition"
        >
          <ArrowUpDown size={14} />
          {sortAsc ? "Oldest" : "Newest"}
        </MotionButton>

        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            type="text"
            placeholder="Search by project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg bg-white/80 border border-secondary text-sm shadow-inner w-full"
          />
        </div>
      </div>
    </PageHeader>
  );
};

export default TaskHeader;
