"use client";

import React, { useState } from "react";
import Header from "./Header";
import KPIGrid from "./KPIGrid";
import PieChart from "./PieChart";
import ProjectOverview from "./ProjectOverview";

const MainPage = () => {

  return (
    <div className="w-full flex flex-col space-y-2">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <KPIGrid />
        <PieChart />
      </div>
      <ProjectOverview />
    </div>
  );
};

export default MainPage;
