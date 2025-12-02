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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios/axios";
import { SCOPE_COLORS } from "./utils";

type MonthlyAPIRecord = {
  reporting_month: string;
  scope_name: string;
  main_category: string;
  monthly_carbon_emission: string;
};


const quarterlyData = [
  { quarter: "Q1", scope1: 85, scope2: 113, scope3Upstream: 840, scope3Downstream: 530 },
  { quarter: "Q2", scope1: 113, scope2: 140, scope3Upstream: 960, scope3Downstream: 620 },
  { quarter: "Q3", scope1: 95, scope2: 127, scope3Upstream: 900, scope3Downstream: 555 },
  { quarter: "Q4", scope1: 90, scope2: 120, scope3Upstream: 860, scope3Downstream: 490 },
];


function transformMonthly(apiData: MonthlyAPIRecord[]) {
  const map: Record<string, any> = {};

  apiData.forEach((row) => {
    const [month] = row.reporting_month.split(" ");

    if (!map[month]) {
      map[month] = {
        month,
        scope1: 0,
        scope2: 0,
        scope3Upstream: 0,
        scope3Downstream: 0,
      };
    }

    const value = Number(row.monthly_carbon_emission || 0);
    const cat = row.main_category.toLowerCase();

    if (row.scope_name === "Scope 1") map[month].scope1 += value;
    else if (row.scope_name === "Scope 2") map[month].scope2 += value;
    else if (row.scope_name === "Scope 3") {
      if (cat.includes("upstream")) map[month].scope3Upstream += value;
      else if (cat.includes("downstream")) map[month].scope3Downstream += value;
      else map[month].scope3Upstream += value;
    }
  });

  return Object.values(map);
}
function transformYearly(apiData: MonthlyAPIRecord[]) {
  const map: Record<string, any> = {};

  apiData.forEach((row) => {
    const [, year] = row.reporting_month.split(" ");

    if (!map[year]) {
      map[year] = {
        year,
        scope1: 0,
        scope2: 0,
        scope3Upstream: 0,
        scope3Downstream: 0,
      };
    }

    const value = Number(row.monthly_carbon_emission || 0);
    const cat = row.main_category.toLowerCase();

    if (row.scope_name === "Scope 1") map[year].scope1 += value;
    else if (row.scope_name === "Scope 2") map[year].scope2 += value;
    else if (row.scope_name === "Scope 3") {
      if (cat.includes("upstream")) map[year].scope3Upstream += value;
      else if (cat.includes("downstream")) map[year].scope3Downstream += value;
      else map[year].scope3Upstream += value;
    }
  });

  return Object.values(map);
}

const GHGEmissionsBar = ({ projectId }: { projectId: number }) => {
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">(
    "monthly"
  );

  const [monthly, setMonthly] = useState<any[]>([]);
  const [yearly, setYearly] = useState<any[]>([]);

  async function load() {
    try {
      const res = await axios.post("/get_project_monthly_summary", {
        p_project_id: projectId,
      });

      const rows: MonthlyAPIRecord[] = res.data?.data?.templates || [];

      setMonthly(transformMonthly(rows));
      setYearly(transformYearly(rows));
    } catch (e) {
      console.error("Error fetching summary:", e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const xKey =
    period === "monthly" ? "month" : period === "quarterly" ? "quarter" : "year";

  function fixLogZeros(data: any[]) {
    return data.map((d) => ({
      ...d,
      scope1: d.scope1 <= 0 ? 0.1 : d.scope1,
      scope2: d.scope2 <= 0 ? 0.1 : d.scope2,
      scope3Upstream: d.scope3Upstream <= 0 ? 0.1 : d.scope3Upstream,
      scope3Downstream: d.scope3Downstream <= 0 ? 0.1 : d.scope3Downstream,
    }));
  }
  const chartData = useMemo(() => {
    let data =
      period === "monthly"
        ? monthly
        : period === "quarterly"
          ? quarterlyData
          : yearly;

    return fixLogZeros(data);
  }, [period, monthly, yearly]);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Emissions over Time (tCO₂e)</CardTitle>

        <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey={xKey} fontSize={12} />
            <YAxis
              scale="log"
              domain={['auto', 'auto']}
              fontSize={12}
            />

            <Tooltip
              formatter={(value: any) =>
                Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              }
              contentStyle={{
                background: "rgba(255,255,255,0.85)",
                borderRadius: "10px",
                border: "none",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            <Bar dataKey="scope1" name="Scope 1" fill={SCOPE_COLORS.scope1} />
            <Bar dataKey="scope2" name="Scope 2" fill={SCOPE_COLORS.scope2} />
            <Bar
              dataKey="scope3Upstream"
              name="Scope 3 (Upstream)"
              fill={SCOPE_COLORS.scope3Upstream}
            />
            <Bar
              dataKey="scope3Downstream"
              name="Scope 3 (Downstream)"
              fill={SCOPE_COLORS.scope3Downstream}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GHGEmissionsBar;
