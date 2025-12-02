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
  selectedPlants: string[];
}

const COLORS = ["#22c55e", "#15803d", "#0ea5e9", "#f59e0b", "#ef4444"];

const CompareBarChart = ({ selectedPlants }: CompareBarChartProps) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [year, setYear] = useState<string>("2025");

  // Base data from utils
  const baseData = COMPARE_DATA[year] || [];

  // 🔑 Generate per-plant values dynamically
  const data = baseData.map((row) => {
    const obj: Record<string, any> = { ...row };
    selectedPlants.forEach((plant, i) => {
      // Fake numbers for demo (replace with API values later)
      obj[plant] = (row.value1 || 0) + i * 50;
    });
    return obj;
  });

  return (
    <Card className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="w-[120px] text-xs">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 bg-gray-100 border border-gray-200 rounded-full px-1 py-0.5">
          <Button
            size="sm"
            className={`text-xs rounded-full ${
              chartType === "bar"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => setChartType("bar")}
          >
            Bar
          </Button>
          <Button
            size="sm"
            className={`text-xs rounded-full ${
              chartType === "line"
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
            <BarChart data={data} barSize={28}>
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

              {selectedPlants.map((plant, i) => (
                <Bar
                  key={plant}
                  dataKey={plant}
                  fill={COLORS[i % COLORS.length]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
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

              {selectedPlants.map((plant, i) => (
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
