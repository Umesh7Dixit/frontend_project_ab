"use client";

import React from "react";
import { motion } from "motion/react";
import {
  FileDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Save,
  Eye,
} from "lucide-react";
import { useExcel } from "@/lib/hooks/useExcel";
import { MotionButton } from "@/components/MotionItems";
import { EmissionDataType } from "./utils";
import axios from "@/lib/axios/axios";
import { toast } from "sonner";
import { getProjectId, getUserId } from "@/lib/jwt";
import { buildBatchPayload, transformTemplatesToRows, upsertBatch } from "@/features/main-page/utils";


type DEFooterProps = {
  onClear?: () => void;
  setSaved?: (v: boolean) => void;
  emissionData: EmissionDataType[];
  handlePreview?: () => void;
};

export default function DEFooter({
  onClear,
  emissionData,
  handlePreview,
  setSaved,
}: DEFooterProps) {
  const { exportToExcel } = useExcel();
  const projectId = getProjectId();
  const handleExport = async () => {
    try {
      const params = {
        p_project_id: projectId,
        p_scope_name: "Scope 1",
        p_page_size: 10,
        p_page_number: 1,
      };

      const res = await axios.post("/get_data_collection_sheet_for_scope", params);
      const templates = res.data?.data?.templates;

      if (!templates || templates.length === 0) {
        toast.error("No data found!");
        return;
      }

      const finalRows = transformTemplatesToRows(templates);
      exportToExcel(finalRows, "scope-data.csv");
      toast.success("Downloading started!");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaved?.(true);
    const userId = getUserId();
    const batch = buildBatchPayload(emissionData);
    if (!batch.length) {
      toast.error("No data to save!");
      return;
    }
    const res = await upsertBatch(userId, batch);
    res.data?.issuccessful ? toast.success("Saved successfully!") : toast.error("Save failed.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full py-4 px-5 rounded-2xl bg-white/60 backdrop-blur-[10px] shadow-md"
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <MotionButton
            className="rounded-full px-4 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
          >
            <FileDown size={16} />
            Export CSV
          </MotionButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <MotionButton
            variant="outline"
            className="rounded-full px-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
          >
            <ArrowLeft size={16} />
            Prev
          </MotionButton>

          <MotionButton
            variant="outline"
            className="rounded-full px-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
          >
            Next
            <ArrowRight size={16} />
          </MotionButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3"
        >
          <MotionButton
            onClick={onClear}
            className="rounded-full px-4 flex items-center gap-2 border border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} />
            Clear
          </MotionButton>

          <MotionButton
            className="rounded-full px-4 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSave()}
          >
            <Save size={16} />
            Save
          </MotionButton>

          <MotionButton
            className="rounded-full px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreview}
          >
            <Eye size={16} />
            Preview
          </MotionButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
