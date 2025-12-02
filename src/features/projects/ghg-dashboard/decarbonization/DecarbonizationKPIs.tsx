"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

// mock data for charts
const chartData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 90 },
  { month: "Apr", value: 150 },
  { month: "May", value: 130 },
  { month: "Jun", value: 160 },
];

const DecarbonizationKPIs = () => {
  const cards = [
    {
      title: "Baseline Emissions",
      value: "4,827 tCO₂e",
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fill="url(#emissionGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "SBTi Target",
      value: "46%",
      sub: "2030",
      highlight: true,
    },
    {
      title: "Target Emissions",
      value: "2,607 tCO₂e",
      big: true,
    },
    {
      title: "Baseline Utility Costs",
      value: "£4,827,182",
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#facc15" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#facc15"
              fill="url(#costGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Capital Cost",
      value: "£2,123,879",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {cards.map((card, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl hover:shadow-xl transition-shadow h-full flex flex-col gap-2 relative">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-gray-600">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <p
                  className={`${
                    card.big ? "text-2xl" : "text-lg flex items-center"
                  } font-bold text-gray-800`}
                >
                  {card.value}
                  {i == 1 && (
                    <ArrowDown className="ml-1 text-red-500" size={16} />
                  )}
                </p>
                {card.sub && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-secondary/30 text-[11px] text-gray-700 font-medium">
                    {card.sub}
                  </span>
                )}
              </div>
              {card.chart && <div className="h-14 mt-2">{card.chart}</div>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DecarbonizationKPIs;
