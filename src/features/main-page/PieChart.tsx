"use client";
import { motion } from "motion/react";

export default function PieChart() {
  const secondaryColor = "#51b575";

  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let ghgPct = 100;
  let shownColor = secondaryColor;
  
  const dashArray = "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pie-wrapper h-full flex flex-col items-center justify-center p-4 bg-white/80 rounded-2xl shadow-sm"
    >
      <div className="w-full flex items-center justify-between mb-2 px-2">
        <div className="font-montserrat font-semibold text-gray-700 text-sm">
          GHG
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[160px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto block">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#EEF2F4"
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={shownColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={dashArray}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: dashArray }}
            transition={{ duration: 1 }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="font-montserrat font-bold text-lg text-gray-700"
          >
          </motion.div>
          <div className="font-poppins text-xs text-gray-600 mt-0.5">
            GHG 100%
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-start gap-3 mt-3 px-2 text-sm text-gray-600 font-poppins">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: secondaryColor }}
          />
          GHG {ghgPct}%
        </div>
      </div>
    </motion.div>
  );
}
