"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock Data
const emissionsPathwayData = [
  { year: "2021", site: 320, efficiency: 0, thermal: 0, renewable: 0 },
  { year: "2022", site: 310, efficiency: 10, thermal: 0, renewable: 0 },
  { year: "2023", site: 300, efficiency: 20, thermal: 0, renewable: 0 },
  { year: "2024", site: 290, efficiency: 30, thermal: 0, renewable: 0 },
  { year: "2025", site: 280, efficiency: 40, thermal: 0, renewable: 0 },
  { year: "2026", site: 250, efficiency: 40, thermal: 20, renewable: 10 },
  { year: "2027", site: 240, efficiency: 40, thermal: 30, renewable: 20 },
  { year: "2028", site: 220, efficiency: 50, thermal: 40, renewable: 30 },
  { year: "2029", site: 210, efficiency: 50, thermal: 40, renewable: 40 },
  { year: "2030", site: 200, efficiency: 50, thermal: 50, renewable: 50 },
];

const targetAchieved = 70;

const financialAnalysisData = [
  { year: "2023", net: -50000, invest: -20000, savings: 10000 },
  { year: "2024", net: -100000, invest: -30000, savings: 20000 },
  { year: "2025", net: -200000, invest: -50000, savings: 40000 },
  { year: "2026", net: -600000, invest: -70000, savings: 80000 },
  { year: "2027", net: -200000, invest: 20000, savings: 120000 },
  { year: "2028", net: 50000, invest: 40000, savings: 200000 },
  { year: "2029", net: 100000, invest: 50000, savings: 220000 },
  { year: "2030", net: 150000, invest: 60000, savings: 250000 },
];

// Color palette
const COLORS = {
  site: "#22c55e",
  efficiency: "#3b82f6",
  thermal: "#f97316",
  renewable: "#eab308",
  invest: "#ef4444",
  savings: "#10b981",
  net: "#6366f1",
};

const DecarbonizationCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm">Emissions Pathway</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emissionsPathwayData} barSize={22}>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="site" stackId="a" fill={COLORS.site} />
              <Bar dataKey="efficiency" stackId="a" fill={COLORS.efficiency} />
              <Bar dataKey="thermal" stackId="a" fill={COLORS.thermal} />
              <Bar dataKey="renewable" stackId="a" fill={COLORS.renewable} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-md shadow-xl rounded-2xl flex flex-col">
        <CardHeader>
          <CardTitle className="text-sm text-center">Target Achieved</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Achieved", value: targetAchieved },
                  { name: "Remaining", value: 100 - targetAchieved },
                ]}
                innerRadius="70%"
                outerRadius="90%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                cornerRadius={6}
                dataKey="value"
                isAnimationActive={true} // animate sweep
              >
                <Cell fill="#22c55e" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-gray-800">
              {targetAchieved}%
            </p>
            <p className="text-xs text-gray-500">Target Achieved</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm">Financial Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financialAnalysisData}>
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Area
                dataKey="net"
                fill={COLORS.net}
                stroke={COLORS.net}
                opacity={0.2}
              />
              <Bar dataKey="invest" fill={COLORS.invest} barSize={20} />
              <Bar dataKey="savings" fill={COLORS.savings} barSize={20} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecarbonizationCharts;
