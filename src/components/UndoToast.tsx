"use client";

import { toast } from "sonner";
import { useEffect } from "react";

type UndoToastOptions = {
  message: string;
  duration?: number; // ms
  onUndo: () => void;
  onExpire?: () => void; // optional callback if not undone
};

export function showUndoToast({
  message,
  duration = 4000,
  onUndo,
  onExpire,
}: UndoToastOptions) {
  toast.custom(
    (
      t: any // 👈 cast to any so TS stops complaining
    ) => (
      <UndoToastContent
        id={t.id}
        message={message}
        duration={duration}
        onUndo={onUndo}
        onExpire={onExpire}
      />
    ),
    { duration }
  );
}

function UndoToastContent({
  id,
  message,
  duration,
  onUndo,
  onExpire,
}: {
  id: string | number;
  message: string;
  duration: number;
  onUndo: () => void;
  onExpire?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onExpire?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onExpire]);

  return (
    <div className="flex flex-col w-72 p-3 rounded-xl shadow-lg bg-secondary text-white">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            toast.dismiss(id);
            onUndo();
          }}
          className="ml-3 px-2 py-1 text-xs font-semibold rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Undo
        </button>
      </div>

      <div className="h-1 mt-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-1 bg-primary"
          style={{
            width: "100%",
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
