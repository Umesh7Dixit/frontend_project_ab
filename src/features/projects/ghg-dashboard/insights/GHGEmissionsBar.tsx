"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SCOPE_COLORS } from "./utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GHGEmissionsBar = ({ data }: { data: any[] }) => {
  // TODO : Fix text cutoff issue on XAxis labels
  const [period, setPeriod] = useState<"Monthly" | "Yearly">("Yearly");

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const map: Record<string, { name: string; scope1: number; scope2: number; scope3: number; sortDate: number }> = {};

    data.forEach((row) => {
      if (!row.reporting_month) return;

      const date = new Date(row.reporting_month);
      if (isNaN(date.getTime())) return;

      let key = "";
      let sortDate = 0;

      if (period === "Monthly") {
        key = row.reporting_month;
        sortDate = date.getTime();
      } else {
        // Yearly
        key = date.getFullYear().toString();
        sortDate = new Date(date.getFullYear(), 0, 1).getTime();
      }

      if (!map[key]) {
        map[key] = { name: key, scope1: 0, scope2: 0, scope3: 0, sortDate };
      }

      const val = parseFloat(row.total_carbon || row.monthly_carbon_emission || "0");
      const s = row.scope_name?.toLowerCase() || "";

      if (s.includes("scope 1")) map[key].scope1 += val;
      else if (s.includes("scope 2")) map[key].scope2 += val;
      else if (s.includes("scope 3")) map[key].scope3 += val;
    });

    return Object.values(map).sort((a, b) => a.sortDate - b.sortDate);
  }, [data, period]);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Emissions over Time (tCO₂e)</CardTitle>
        <Select value={period} onValueChange={(v: "Monthly" | "Yearly") => setPeriod(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value: number) => value.toFixed(2)}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
            <Legend iconType="circle" />
            <Bar dataKey="scope1" name="Scope 1" stackId="a" fill={SCOPE_COLORS.scope1} radius={[0, 0, 4, 4]} />
            <Bar dataKey="scope2" name="Scope 2" stackId="a" fill={SCOPE_COLORS.scope2} />
            <Bar dataKey="scope3" name="Scope 3" stackId="a" fill={SCOPE_COLORS.scope3} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GHGEmissionsBar;
