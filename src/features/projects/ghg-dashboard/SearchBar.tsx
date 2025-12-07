"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  options: string[];
  selected: string[];
  onAdd: (plant: string) => void;
  onRemove: (plant: string) => void;
}

const SearchBar = ({ options, selected, onAdd, onRemove }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSelections = 4;
  const isMaxReached = selected.length >= maxSelections;

  const filtered = options.filter(
    (p) =>
      p.toLowerCase().includes(query.trim().toLowerCase()) &&
      !selected.includes(p)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (plant: string) => {
    if (!isMaxReached) {
      onAdd(plant);
      setQuery("");
      inputRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto flex flex-col gap-4">
      <div className="relative group">
        <motion.div
          layout
          className={cn("relative flex items-center w-full pr-2 border rounded-lg bg-white")}
        >
          <Command shouldFilter={false} className="rounded-lg border-none overflow-visible">
            <CommandInput
              ref={inputRef}
              placeholder={isMaxReached ? "Limit reached" : "Search Facilities..."}
              value={query}
              onValueChange={(val) => {
                setQuery(val);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              disabled={isMaxReached}
              className="border-none focus:ring-0 px-0 text-sm placeholder:text-zinc-400 disabled:opacity-50"
            />

            <AnimatePresence>
              {isOpen && query.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 z-50 w-full"
                >
                  <div className="bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden ring-1 ring-black/5">
                    <CommandList className="max-h-[280px] z-50 p-1.5 overflow-y-auto custom-scrollbar">
                      {filtered.length === 0 ? (
                        <div className="py-8 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                          <AlertCircle className="w-8 h-8 text-zinc-300" />
                          <p>No plants found matching "{query}"</p>
                        </div>
                      ) : (
                        <CommandGroup>
                          {filtered.map((plant) => (
                            <CommandItem
                              key={plant}
                              value={plant}
                              onSelect={() => handleSelect(plant)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer  transition-colors"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 data-[active=true]:opacity-100 transition-opacity" />
                              {plant}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Command>

          <div className="flex items-center gap-2 ml-2">
            <span className={cn(
              "text-[10px] font-medium px-2 py-1 rounded-full transition-colors",
              isMaxReached ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-500"
            )}>
              {selected.length}/{maxSelections}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div layout className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {selected.map((plant) => (
            <motion.span
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              key={plant}
              className="group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-secondary text-white text-xs font-medium transition-colors"
            >
              {plant}
              <button
                onClick={() => onRemove(plant)}
                className="p-0.5 rounded-full bg-red-200 transition-colors"
              >
                <X className="size-3.5 text-red-500" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;