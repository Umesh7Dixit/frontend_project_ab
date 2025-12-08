"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import KPIGrid from "./KPIGrid";
import PieChart from "./PieChart";
import ProjectOverview from "./ProjectOverview";
import { getUserId } from "@/lib/jwt";
import { useUser } from "@/lib/context/EntriesContext";
import { UserApiResponse } from "@/lib/context/utils";
import axios from "@/lib/axios/axios";

const MainPage = () => {
  const [userId, setUserId] = useState<number | null>(getUserId());
  const { setUser } = useUser();
  async function fetchUser(user_id: number) {
    try {
      const res = await axios.post<UserApiResponse>(
        "/getUserInfoByUserID",
        { user_id }
      );
      const templates = res?.data?.data?.templates;
      if (templates?.length) {
        setUser(templates[0]);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  useEffect(() => {
    setUserId(getUserId());
    if (userId) fetchUser(userId);
  }, [userId]);

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
