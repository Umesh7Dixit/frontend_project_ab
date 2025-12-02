"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const projects = [
  {
    id: "P1",
    year: 2024,
    code: "P1",
    name: "Loft insulation",
    site: "Site 1",
    type: "Energy Efficiency",
    capitalCost: "£30,000",
    electricitySaving: "0",
    gasSaving: "35,599",
    annualCostSaving: "£1,022",
    annualCO2Saving: "6.5",
    lifetimeCO2Saving: "175.5",
    carbonAbatement: "171.0",
    payback: "29.4",
  },
  {
    id: "P2",
    year: 2026,
    code: "P2",
    name: "Wall insulation",
    site: "Site 2",
    type: "Energy Efficiency",
    capitalCost: "£5,280",
    electricitySaving: "0",
    gasSaving: "26,861",
    annualCostSaving: "£800",
    annualCO2Saving: "5.3",
    lifetimeCO2Saving: "144.0",
    carbonAbatement: "36.7",
    payback: "6.8",
  },
];

const SelectProjectsTable = () => {
  return (
    <Card className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Select Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader className="bg-gray-50/80 sticky top-0 z-10">
            <TableRow>
              <TableHead
                colSpan={5}
                className="text-xs text-gray-500 text-left"
              >
                Project Info
              </TableHead>
              <TableHead
                colSpan={3}
                className="text-xs text-gray-500 text-right"
              >
                Savings
              </TableHead>
              <TableHead
                colSpan={3}
                className="text-xs text-gray-500 text-right"
              >
                CO₂ Impact
              </TableHead>
              <TableHead
                colSpan={2}
                className="text-xs text-gray-500 text-right"
              >
                Financials
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-xs">Year</TableHead>
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">Code</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Site</TableHead>
              <TableHead className="text-xs text-right">
                Electricity (kWh)
              </TableHead>
              <TableHead className="text-xs text-right">Gas (kWh)</TableHead>
              <TableHead className="text-xs text-right">Annual £</TableHead>
              <TableHead className="text-xs text-right">
                Annual (tCO₂e)
              </TableHead>
              <TableHead className="text-xs text-right">
                Lifetime (tCO₂e)
              </TableHead>
              <TableHead className="text-xs text-right">
                Abatement (£/tCO₂e)
              </TableHead>
              <TableHead className="text-xs text-right">Capital Cost</TableHead>
              <TableHead className="text-xs text-right">
                Payback (yrs)
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {projects.map((p, i) => (
              <TableRow
                key={p.id}
                className={`h-10 ${i % 2 === 0 ? "bg-gray-50/40" : "bg-white"}`}
              >
                <TableCell className="text-xs">{p.year}</TableCell>
                <TableCell className="text-xs">{p.id}</TableCell>
                <TableCell className="text-xs">{p.code}</TableCell>
                <TableCell className="text-xs font-medium">{p.name}</TableCell>
                <TableCell className="text-xs">{p.site}</TableCell>

                <TableCell className="text-xs text-right">
                  {p.electricitySaving}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {p.gasSaving}
                </TableCell>
                <TableCell className="text-xs text-right font-semibold text-emerald-600">
                  {p.annualCostSaving}
                </TableCell>

                <TableCell className="text-xs text-right">
                  {p.annualCO2Saving}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {p.lifetimeCO2Saving}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {p.carbonAbatement}
                </TableCell>

                <TableCell className="text-xs text-right font-semibold text-gray-800">
                  {p.capitalCost}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {p.payback}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SelectProjectsTable;
