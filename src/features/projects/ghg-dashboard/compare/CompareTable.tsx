"use client";

import React, { useMemo } from "react";
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

/* 
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
            className={`h-2 w-2 rounded-sm ${i < filled ? colors[rating] : "bg-gray-300"
              }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-600">{rating}</span>
    </div>
  );
}; 
*/

type CompanyTableProps = {
  title: string;
  data: { facility: string; carbon: number }[];
  delay?: number;
};

const CompanyTable = ({ title, data, delay = 0 }: CompanyTableProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="relative"
  >
    <Card className="relative h-full shadow-lg rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none" />

      <CardHeader className="px-3 relative z-10">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 relative z-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-600 text-xs">Facility Name</TableHead>
              {/* <TableHead className="text-gray-600 text-xs">ESG Risk Rating</TableHead> */}
              <TableHead className="text-gray-600 text-xs">Total Carbon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 5).map((c, i) => (
              <TableRow key={i}>
                <TableCell className="text-xs font-medium text-gray-700">{c.facility}</TableCell>
                {/* <TableCell className="text-xs">
                  <RiskIndicator rating={c.rating} />
                </TableCell> */}
                <TableCell className="text-xs">{c.carbon.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </motion.div>
);

const CompareTable = ({ data }: { data: any[] }) => {
  const processed = useMemo(() => {
    if (!data || data.length === 0) return { best: [], worst: [] };

    const map = new Map<string, number>();
    data.forEach((r) => {
      const f = r.facility_name;
      if (!f) return;
      const c = parseFloat(r.total_carbon || "0");
      map.set(f, (map.get(f) || 0) + c);
    });

    const arr = Array.from(map.entries()).map(([facility, carbon]) => ({
      facility,
      carbon,
    }));

    const sortedDesc = [...arr].sort((a, b) => b.carbon - a.carbon);
    const worst = sortedDesc.filter((x) => x.carbon > 0).slice(0, 5);

    const worstNames = new Set(worst.map((x) => x.facility));

    const best = arr
      .filter((x) => !worstNames.has(x.facility))
      .sort((a, b) => a.carbon - b.carbon)
      .slice(0, 5);

    return { best, worst };
  }, [data]);



  const tables = [
    { title: "Best 5 Facilities", data: processed.best },
    { title: "Worst 5 Facilities", data: processed.worst },
  ];

  return (
    <div className="grid grid-cols-1 z-10 lg:grid-cols-2 gap-4">
      {tables.map((t, i) => (
        <CompanyTable key={t.title} {...t} delay={i * 0.15} />
      ))}
    </div>
  );
};

export default CompareTable;
