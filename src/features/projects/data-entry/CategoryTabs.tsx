"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { SUBCATEGORIES } from "./utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  onChange: (cat: string) => void;
  currentScope: number;
  readOnly?: boolean;
  className?: string;
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onChange,
  currentScope,
  readOnly,
  className,
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (currentScope === 3 && selectedMain) return;

    const activeElement = document.getElementById(`tab-${activeCategory}`);
    if (activeElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { offsetLeft, offsetWidth } = activeElement;
      const { clientWidth } = container;
      const scrollTo = offsetLeft - clientWidth / 2 + offsetWidth / 2;

      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [activeCategory, currentScope, selectedMain]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);


  const handleMainCategoryClick = (cat: string) => {
    if (currentScope === 3) {
      setSelectedMain(cat);
    } else {
      onChange(cat);
    }
  };

  const handleSubCategoryClick = (sub: string) => {
    onChange(sub);
  };

  const handleBack = () => {
    setSelectedMain(null);
  };
  if (currentScope === 3 && selectedMain) {
    const subs = SUBCATEGORIES[selectedMain] || [];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn("w-full mt-4 px-4 py-3 rounded-xl  backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-3 overflow-hidden", className)}
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-1 pr-3 py-1.5 border-r border-gray-300 text-gray-500 hover:text-gray-800 transition-colors text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="px-3 py-1.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold whitespace-nowrap">
          {selectedMain}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full items-center pb-1 pt-1">
          {subs.map((sub) => (
            <button
              key={sub}
              onClick={() => handleSubCategoryClick(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeCategory === sub
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white/50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
            >
              {sub}
            </button>
          ))}
          {subs.length === 0 && (
            <span className="text-xs text-gray-400 italic">No subcategories found</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={cn("relative w-full group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50", className)}
    >
      <div className={`absolute left-0 top-0 bottom-0 flex items-center pl-1 z-20 transition-opacity duration-300 ${showLeftGradient ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-12" />
        <button
          onClick={() => scrollBy(-200)}
          className="relative p-1.5 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-600 transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-3 px-2 sm:px-4 w-full scroll-smooth"
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              id={`tab-${cat}`}
              onClick={() => handleMainCategoryClick(cat)}
              className={cn("relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0", isActive
                ? "text-white bg-[#0b1f1d]/90"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-600 rounded-lg shadow-md z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      <div className={`absolute right-0 top-0 bottom-0 flex items-center pr-1 z-20 transition-opacity duration-300 ${showRightGradient ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-white via-white/80 to-transparent w-12" />
        <button
          onClick={() => scrollBy(200)}
          className="relative p-1.5 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-600 transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}