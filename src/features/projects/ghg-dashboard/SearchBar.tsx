"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";

interface SearchBarProps {
  options: string[];
  selected: string[];
  onAdd: (plant: string) => void;
  onRemove: (plant: string) => void;
}

const SearchBar = ({ options, selected, onAdd, onRemove }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const filtered = options.filter(
    (p) =>
      p.toLowerCase().includes(query.trim().toLowerCase()) &&
      !selected.includes(p)
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative">
        <Command>
          <CommandInput
            placeholder="Type to search plants..."
            value={query}
            onValueChange={(val) => setQuery(val)}
            className="text-xs border rounded-md px-2 py-1 w-full"
          />
          {query.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute mt-1 z-[100] min-w-full"
            >
              <div className="bg-white rounded-md shadow-lg border border-gray-100">
                <CommandList>
                  <CommandEmpty>No plants found.</CommandEmpty>
                  <CommandGroup>
                    {filtered.map((plant) => (
                      <CommandItem
                        key={plant}
                        value={plant}
                        onSelect={() => {
                          if (selected.length < 4) {
                            onAdd(plant);
                            setQuery("");
                          }
                        }}
                        className="text-sm"
                      >
                        {plant}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </div>
            </motion.div>
          )}
        </Command>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((plant) => (
            <span
              key={plant}
              className="flex items-center gap-1 rounded-full bg-green-50 text-green-800 text-[11px] px-2 py-0.5"
            >
              {plant}
              <button
                aria-label={`Remove ${plant}`}
                onClick={() => onRemove(plant)}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
