"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "motion/react";

const bestCompanies = [
  { unit: "Unit 1", rating: "Negligible", weight: 20 },
  { unit: "Unit 2", rating: "Negligible", weight: 35 },
  { unit: "Unit 3", rating: "Negligible", weight: 27 },
  { unit: "Unit 4", rating: "Negligible", weight: 22 },
  { unit: "Unit 5", rating: "Negligible", weight: 25 },
];

const worstCompanies = [
  { unit: "Unit 1", rating: "High", weight: 20 },
  { unit: "Unit 2", rating: "High", weight: 35 },
  { unit: "Unit 3", rating: "High", weight: 27 },
  { unit: "Unit 4", rating: "High", weight: 22 },
  { unit: "Unit 5", rating: "High", weight: 25 },
];

const RiskIndicator = ({ rating }: { rating: string }) => {
  const colors: Record<string, string> = {
    Negligible: "bg-emerald-400",
    Low: "bg-lime-400",
    Medium: "bg-amber-400",
    High: "bg-orange-500",
    Severe: "bg-red-500",
  };

  const filled =
    rating === "Negligible"
      ? 1
      : rating === "Low"
        ? 2
        : rating === "Medium"
          ? 3
          : rating === "High"
            ? 4
            : 5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-sm ${
              i < filled ? colors[rating] : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-600">{rating}</span>
    </div>
  );
};

type CompanyTableProps = {
  title: string;
  data: { unit: string; rating: string; weight: number }[];
  delay?: number;
};

const CompanyTable = ({ title, data, delay = 0 }: CompanyTableProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="relative"
  >
    <Card className="bg-white/60 backdrop-blur-md shadow-lg rounded-xl gap-2">
      <CardHeader className="px-3">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-600 text-xs">Unit</TableHead>
              <TableHead className="text-gray-600 text-xs">
                ESG Risk Rating
              </TableHead>
              <TableHead className="text-gray-600 text-xs">
                PDMI Weight
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((c) => (
              <TableRow key={c.unit}>
                <TableCell className="text-xs">{c.unit}</TableCell>
                <TableCell className="text-xs">
                  <RiskIndicator rating={c.rating} />
                </TableCell>
                <TableCell className="text-xs">{c.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </motion.div>
);

const CompareTable = () => {
  const tables = [
    { title: "Best 5 Companies", data: bestCompanies },
    { title: "Worst 5 Companies", data: worstCompanies },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {tables.map((t, i) => (
        <CompanyTable key={t.title} {...t} delay={i * 0.15} />
      ))}
    </div>
  );
};

export default CompareTable;
