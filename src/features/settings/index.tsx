"use client";

import { containerVariants, EmployeeState, itemVariants, toEmployeeDetails } from "./Settings.utils";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/lib/context/EntriesContext";
import ChangePasswordModal from "./ChangePasswordModal";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Logout from "./Logout";

const SettingsPage = () => {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { user } = useUser();
  const employeeData: EmployeeState = {
    employeeId: "EMP-12345",
    position: "Auditor",
    department: "Development",
    fullName: user?.full_name ?? "",
    email: user?.email ?? "",
    contact: user?.phone_number ?? "",
    organization: user?.org_name ?? "",
    facility: user?.facility_name ?? "",
    facilityId: user?.facility_id ?? 0,
    location: "Mangalore, India",
  };
  const employeeDetails = toEmployeeDetails(employeeData);

  return (
    <motion.div
      className="flex flex-col gap-4 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {openChangePassword && (
        <ChangePasswordModal
          open={openChangePassword}
          onClose={() => setOpenChangePassword(false)}
        />
      )}
      
      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative h-20 w-20 rounded-full overflow-hidden border border-gray-200 shadow"
              >
                <Image
                  src="/icons/main.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user?.full_name ?? "John Doe"}
                </h2>
                <p className="text-sm text-gray-500">{user?.position ?? "Auditor"}</p>
                <p className="text-sm text-gray-500">{user?.email ?? "user@example.com"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                className="rounded-lg text-sm px-4 py-2 flex items-center gap-2"
                onClick={() => setOpenChangePassword(true)}
              >
                <Lock size={16} />
                Change Password
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} className="w-full">
                <Logout />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
            {employeeDetails.map((detail, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-md bg-gray-100 text-gray-600">
                  {detail.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{detail.label}</p>
                  <p className="text-sm font-medium text-gray-700">
                    {detail.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
