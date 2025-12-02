"use client";

import React from "react";
import PageHeader from "@/components/PageHeader";
import { motion } from "motion/react";

const Node = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="px-6 py-3 rounded-2xl shadow-lg 
               bg-white/20 backdrop-blur-md border border-primary/20
               text-gray-800 font-semibold text-sm text-center
               hover:shadow-xl hover:scale-105 transition relative z-10"
  >
    {title}
  </motion.div>
);

const FacilityStructure = () => {
  return (
    <div className="flex flex-col h-full gap-6">
      <PageHeader className="shadow-xl">
        <h1 className="text-xl font-bold text-gray-800">Facility Structure</h1>
      </PageHeader>

      <div className="flex flex-col items-center w-full overflow-x-auto pb-10">
        <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl relative">
          <Node title="Organization Name" />

          <div className="flex justify-center items-start gap-24 mt-12 relative">
            <div className="flex flex-col items-center gap-4 relative">
              <span className="absolute top-[-50px] left-1/2 w-px h-12 bg-gray-300/70"></span>
              <Node title="Facility 1" />
              <span className="w-px h-6 bg-gray-300/70"></span>
              <Node title="Address" />
            </div>

            <div className="flex flex-col items-center gap-4 relative">
              <span className="absolute top-[-50px] left-1/2 w-px h-12 bg-gray-300/70"></span>
              <Node title="Facility 2" />
              <span className="w-px h-6 bg-gray-300/70"></span>
              <Node title="Address" />

              <div className="flex gap-16 mt-8 relative">
                <span className="absolute top-[-40px] left-0 right-0 h-px bg-gray-300/70"></span>
                <div className="flex flex-col items-center gap-4 relative">
                  <span className="absolute top-[-40px] left-1/2 w-px h-10 bg-gray-300/70"></span>
                  <Node title="Unit 1" />
                  <span className="w-px h-6 bg-gray-300/70"></span>
                  <Node title="Address" />
                </div>
                <div className="flex flex-col items-center gap-4 relative">
                  <span className="absolute top-[-40px] left-1/2 w-px h-10 bg-gray-300/70"></span>
                  <Node title="Unit 2" />
                  <span className="w-px h-6 bg-gray-300/70"></span>
                  <Node title="Address" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 relative">
              <span className="absolute top-[-50px] left-1/2 w-px h-12 bg-gray-300/70"></span>
              <Node title="Facility 3" />
              <span className="w-px h-6 bg-gray-300/70"></span>
              <Node title="Address" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityStructure;
