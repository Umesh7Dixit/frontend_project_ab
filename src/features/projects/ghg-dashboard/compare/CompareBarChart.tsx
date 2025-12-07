"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { COMPARE_DATA } from "./utils";

interface CompareBarChartProps {
  selectedFacilitiesForCompare: string[];
  data: any[];
  availableYears: number[];
}

const COLORS = ["#22c55e", "#15803d", "#0ea5e9", "#f59e0b", "#ef4444"];

const CompareBarChart = ({ selectedFacilitiesForCompare, data, availableYears }: CompareBarChartProps) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [year, setYear] = useState<string>(availableYears.length > 0 ? String(availableYears[0]) : "2025");

  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Filter by selected year
    const yearData = data.filter(d => d.reporting_month?.includes(year));

    // Group by month
    const monthMap = new Map<string, any>();

    // Initialize standard months order if needed, or just let them appear naturally. 
    // Ideally we want chronological order.
    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthsOrder.forEach(m => monthMap.set(m, { month: m }));

    yearData.forEach(row => {
      if (!row.reporting_month) return;
      const parts = row.reporting_month.split(" ");
      if (parts.length < 2) return;
      const m = parts[0].substring(0, 3); // "April" -> "Apr"

      const facility = row.facility_name;
      if (selectedFacilitiesForCompare.includes(facility)) {
        const existing = monthMap.get(m) || { month: m };
        existing[facility] = (existing[facility] || 0) + Number(row.total_carbon || 0);
        monthMap.set(m, existing);
      }
    });

    return Array.from(monthMap.values());
  }, [data, year, selectedFacilitiesForCompare]);

  return (
    <Card className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="w-[120px] text-xs">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(y => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 bg-gray-100 border border-gray-200 rounded-full px-1 py-0.5">
          <Button
            size="sm"
            className={`text-xs rounded-full ${chartType === "bar"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-black"
              }`}
            onClick={() => setChartType("bar")}
          >
            Bar
          </Button>
          <Button
            size="sm"
            className={`text-xs rounded-full ${chartType === "line"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-black"
              }`}
            onClick={() => setChartType("line")}
          >
            Line
          </Button>
        </div>
      </CardHeader>

      <CardContent className="h-[220px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={processedData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />

              {selectedFacilitiesForCompare.map((plant, i) => (
                <Bar
                  key={plant}
                  dataKey={plant}
                  fill={COLORS[i % COLORS.length]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={processedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />

              {selectedFacilitiesForCompare.map((plant, i) => (
                <Line
                  key={plant}
                  type="monotone"
                  dataKey={plant}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CompareBarChart;
