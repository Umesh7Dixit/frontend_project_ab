"use client";

export default function ScopeProgressBar({ progress }: { progress: number }) {
  let barColor = "bg-gray-400"; // default fallback
  if (progress >= 80) {
    barColor = "bg-emerald-500"; // green for high
  } else if (progress >= 50) {
    barColor = "bg-amber-500"; // yellow for mid
  } else {
    barColor = "bg-red-500"; // red for low
  }
  return (
    <div className="mt-4 w-full">
      <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-end">
        <span className="text-xs text-[#6b7280]">{progress}%</span>
      </div>
    </div>
  );
}
