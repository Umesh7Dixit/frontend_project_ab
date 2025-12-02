"use client";
import { motion } from "motion/react";
import { useUser } from "@/lib/context/EntriesContext";


const Header: React.FC = () => {
  const { user } = useUser();
  const fullName = user?.full_name ?? "John Doe";
  const firstName = fullName.split(" ")[0];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center py-3 px-4 rounded-xl bg-white/60 shadow-sm"
    >
      <h1 className="text-2xl font-bold font-['Montserrat'] m-0">
        Welcome back <span className="text-secondary">{firstName}</span>
      </h1>
    </motion.div>
  );
};

export default Header;
