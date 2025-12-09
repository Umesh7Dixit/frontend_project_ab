"use client";

import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadReport } from "./ReportCard.utils";
import { getProjectId } from "@/lib/jwt";

export default function ReportCard() {
  const projectName = "Carbon Accounting FY2024";
  const projectDetails = "Verified report as per BSI ISO 14064-1 standards.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md mx-auto rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl transition"
    >
      <h3 className="text-lg font-semibold text-[#0b1f1d]">{projectName}</h3>
      <p className="mt-2 text-sm text-[#4b5563]">{projectDetails}</p>

      <div className="mt-5 flex justify-end">
        <Button
          onClick={() => downloadReport(getProjectId())}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0b1f1d] text-white text-sm font-medium shadow hover:bg-[#123331] transition"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </motion.div>
  );
}
