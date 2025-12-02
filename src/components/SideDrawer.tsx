import React, { useEffect } from "react";
import { motion } from "motion/react";
import { SideDrawerProps } from "@/types";
import { X } from "lucide-react";

const SideDrawer = ({ open, onClose, children, title }: SideDrawerProps) => {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onClose(false)}
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
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={() => onClose(false)}
            aria-label="Close"
            className="rounded-full p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-600 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        {children}
      </motion.aside>
    </div>
  );
};

export default SideDrawer;
