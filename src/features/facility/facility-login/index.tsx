"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import FacilityLoginForm from "./LoginForm";

const FacilityForm = () => {
  return (
    <main className="flex h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl"
      >
        <div className="relative hidden md:block w-1/2">
          <Image
            src="/images/globe.png"
            alt="Organization Globe"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-10 min-h-[500px]">
          <FacilityLoginForm />
        </div>
      </motion.div>
    </main>
  );
};

export default FacilityForm;
