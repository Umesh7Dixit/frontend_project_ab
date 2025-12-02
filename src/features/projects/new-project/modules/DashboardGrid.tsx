"use client";

import Link from "next/link";
import { dashboardModules } from "@/schema/dashboard-data";
import { motion } from "motion/react";
import Image from "next/image";
import { Info } from "lucide-react";
import { useState } from "react";
import InfoDrawer from "./InfoDrawer";

export default function DashboardGrid() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);

  const handleInfoAction = (e: React.MouseEvent, item: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setInfoDrawerOpen(true);
  };

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border-2 backdrop-blur-lg shadow-md transition-all duration-200 ease-out"
      >
        <Image
          src="/images/header.png"
          alt="Dashboard"
          fill
          className="object-cover opacity-70"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent" />

        <div className="relative z-10 p-8">
          <h1 className="text-lg md:text-2xl font-semibold text-[#0b1f1d]">
            Create Project
          </h1>
          <p className="mt-1 text-xs md:text-sm text-[#4b5563]">
            Choose a module below to get started
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {dashboardModules.map(({ name, icon: Icon, desc, route }) => (
          <Link key={name} href={route}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="
                group flex flex-col items-center justify-center text-center rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.15)] backdrop-blur-lg p-8 shadow-md transition-all duration-200 ease-out cursor-pointer relative"
            >
              <Info
                size={15}
                className="absolute right-3 top-2 text-secondary cursor-pointer"
                onClick={(e) => handleInfoAction(e, name)}
              />
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#51b575]/20 text-[#51b575] group-hover:bg-[#2b5f5d]/20 group-hover:text-[#2b5f5d] transition-colors"
                animate={{
                  boxShadow: [
                    "0 0 0px #51b575",
                    "0 0 12px #51b57566",
                    "0 0 0px #51b575",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon className="h-7 w-7" />
              </motion.div>

              <h2 className="mt-4 text-lg font-semibold text-[#0b1f1d] group-hover:text-[#2b5f5d]">
                {name}
              </h2>

              {desc && (
                <p className="mt-1 text-sm text-[#4b5563] group-hover:text-[#0b1f1d]">
                  {desc}
                </p>
              )}
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {infoDrawerOpen && (
        <InfoDrawer
          open
          onClose={() => setInfoDrawerOpen(false)}
          selectedItem={selectedItem}
        />
      )}
    </section>
  );
}
