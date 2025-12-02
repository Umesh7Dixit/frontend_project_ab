"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

type Scope = {
  id: number;
  title: string;
  desc: string;
  Icon: any;
};

export default function ScopeDrawer({
  open,
  onClose,
  scopes,
  selected,
  setSelected,
}: {
  open: boolean;
  onClose: () => void;
  scopes: Scope[];
  selected: number[]; // ids
  setSelected: (next: number[]) => void;
}) {
  const toggle = (id: number) => {
    const isSelected = selected.includes(id);
    if (isSelected) {
      if (selected.length === 1) return;
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

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
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative ml-auto w-full max-w-md h-full p-5 md:p-6
                   bg-white/50 backdrop-blur-xl border border-white/10 shadow-2xl md:rounded-l-3xl"
        role="dialog"
        aria-modal="true"
        aria-label="Customize Scopes"
      >
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-[#0b1f1d]">
              Customize Scopes
            </h3>
            <p className="text-xs text-[#4b5563] mt-1">
              Select which emission scope to display.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 bg-white/5 hover:bg-white/10 border border-white/6 text-gray-600 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="mt-5 space-y-4">
          {scopes.map((s) => {
            const checked = selected.includes(s.id);
            return (
              <div
                key={s.id}
                className="rounded-2xl p-3 bg-white/5 backdrop-blur-md border border-white/6 flex gap-3 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="h-11 w-11 rounded-2xl bg-white/7 flex items-center justify-center">
                    <s.Icon className="h-5 w-5 text-[#0b1f1d]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#0b1f1d] truncate">
                        {s.title}
                      </h4>
                      <p className="text-xs text-[#4b5563] mt-1">{s.desc}</p>
                    </div>

                    <label
                      className={`flex items-center gap-2 cursor-pointer select-none ml-3`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(s.id)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-0"
                        aria-checked={checked}
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.aside>
    </div>
  );
}
