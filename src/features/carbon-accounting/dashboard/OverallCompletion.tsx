"use client";

import { motion } from "motion/react";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/CircularProgress";
import {
  CircleDashed,
  Loader2,
  Database,
  Clock,
  MessageSquareWarning,
  ShieldCheck,
  HelpCircle,
  type LucideIcon,
  CircleCheck
} from "lucide-react";

type StatusConfig = {
  color: string;
  icon: LucideIcon;
  animate?: boolean;
};

const statusConfig: Record<string, StatusConfig> = {
  "Not Started": {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: CircleDashed,
  },
  "In Progress": {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Loader2,
    animate: true,
  },
  "Data collection completed": {
    color: "bg-indigo-100 text-indigo-700 border-indigo-300",
    icon: Database,
  },
  "Completed": {
    color: "bg-green-100 text-green-700 border-green-300",
    icon: CircleCheck,
  },
  "Approval pending": {
    color: "bg-amber-100 text-amber-700 border-amber-300",
    icon: Clock,
  },
  "Comments shared by auditor": {
    color: "bg-rose-100 text-rose-700 border-rose-300",
    icon: MessageSquareWarning,
  },
  "Verified": {
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: ShieldCheck,
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config =
    statusConfig[status] || {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: HelpCircle,
    };

  const Icon = config.icon;

  return (
    <span className={`inline-flex mt-1 items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.animate ? <Icon className="size-3 animate-spin" /> : <Icon className="size-3" />}
      {status}
    </span>
  );
};

export default function OverallCompletion({
  completion,
  status,
}: {
  completion: number;
  status?: string;
}) {
  const safeCompletion = isNaN(completion) ? 0 : completion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 rounded-2xl p-5 md:p-6 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-xl hover:ring-1 hover:ring-white/20 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-[#0b1f1d]">
            Overall Completion
          </h2>
          <p className="text-xs text-[#4b5563]">Combined progress across all scopes</p>
          {status && <StatusBadge status={status} />}
        </div>
        <CircularProgress value={safeCompletion} size={70} strokeWidth={6} />
      </div>

      <Progress value={safeCompletion} className="h-2 rounded-full" />
    </motion.div>
  );
}
