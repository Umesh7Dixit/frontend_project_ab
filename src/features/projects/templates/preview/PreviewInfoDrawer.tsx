"use client";

import { useEffect } from "react";
import { easeOut, motion } from "motion/react";
import { X } from "lucide-react";
import { PreviewInfoDrawerProps } from "./utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: easeOut },
  },
};

export default function PreviewInfoDrawer({
  open,
  onClose,
  data,
}: PreviewInfoDrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative ml-auto w-full max-w-md h-full p-6
                   bg-white/60 backdrop-blur-xl border border-white/10 shadow-2xl md:rounded-l-3xl overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Preview Info"
      >
        <header className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Row Information
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-600 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <motion.div
          className="mt-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={sectionVariants}
            className="rounded-2xl bg-white/70 backdrop-blur-md p-5 shadow-sm border border-white/10"
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Activity Details
            </h4>
            <motion.dl
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <InfoRow label="Activity" value={data.activity} />
              <InfoRow label="Section" value={data.section} />
              <InfoRow label="Unit" value={data.unit} />
            </motion.dl>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="rounded-2xl bg-white/70 backdrop-blur-md p-5 shadow-sm border border-white/10"
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Categorization
            </h4>
            <motion.dl
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <InfoRow label="Category" value={data.main_category} />
              <InfoRow label="Sub Category" value={data.sub_category} />
            </motion.dl>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="rounded-2xl bg-white/70 backdrop-blur-md p-5 shadow-sm border border-white/10"
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Emission Factor
            </h4>
            <motion.dl
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <InfoRow label="EF" value={data.ef} />
              <InfoRow label="Source" value={data.efSource} />
            </motion.dl>
          </motion.div>
        </motion.div>
      </motion.aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      variants={rowVariants}
      className="flex justify-between items-center"
    >
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </motion.div>
  );
}
