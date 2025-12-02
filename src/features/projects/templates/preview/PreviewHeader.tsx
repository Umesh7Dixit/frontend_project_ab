"use client";

import React from "react";
import { motion } from "motion/react";
import { PreviewPageProps } from "./utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExtendedHeaderProps extends PreviewPageProps {
  editMode?: boolean;
  onSaveTemplate?: () => void;
  onCustomizeScopes?: () => void;
  currentScope: number;
  searchQuery: string;
  templateName?: string;
  onSearch: (value: string) => void;
}

const PreviewHeader: React.FC<ExtendedHeaderProps> = ({
  templateID,
  editMode,
  onSaveTemplate,
  onCustomizeScopes,
  currentScope,
  searchQuery,
  onSearch,
  templateName,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-md shadow-md"
    >
      <h1 className="text-lg font-bold">
        {editMode
          ? `Journey begins with Scope ${currentScope}`
          : templateName
            ? `${templateName}`
            : `Fuel Emissions Tracker - ${templateID}`}
      </h1>

      {editMode ? (
        <div className="flex items-center gap-3">
          {
            currentScope === 3 && (
              <Button
                onClick={onSaveTemplate}
                className="rounded-full bg-secondary text-white text-sm font-medium hover:bg-secondary/90 transition"
              >
                Save Template
              </Button>
            )
          }
          <button
            onClick={onCustomizeScopes}
            className="rounded-full px-4 py-2 border-2 border-secondary text-secondary text-sm font-medium hover:bg-gray-100 transition"
          >
            Customize Scopes
          </button>
        </div>
      ) : (
        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg bg-white/80 border border-gray-200 text-sm shadow-inner w-full"
          />
        </div>
      )}
    </motion.div>
  );
};

export default PreviewHeader;
