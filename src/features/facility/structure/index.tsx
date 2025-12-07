"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { motion } from "motion/react";
import axios from "@/lib/axios/axios";
import { BuildingIcon, MapPinIcon, User } from "lucide-react";
import { getUserId } from "@/lib/jwt";

// --- Types ---

type APITemplateRow = {
  parent_org_name: string;
  org_id: number;
  org_name: string;
  facility_id: number;
  facility_name: string;
  facility_address: string;
};

type APIResponse = {
  issuccessful: boolean;
  message: string;
  data: {
    templates: APITemplateRow[];
    count: number;
  };
};

type OrgData = {
  parent_org_name: string;
  orgs: {
    org_id: number;
    org_name: string;
    facilities: {
      facility_id: number;
      facility_name: string;
      facility_address: string;
    }[];
  }[];
};


const CardNode = ({
  title,
  type = "default",
  icon,
}: {
  title: string;
  type?: "root" | "org" | "facility" | "address" | "default";
  icon?: React.ReactNode;
}) => {
  const styles = {
    root: "bg-primary text-primary-foreground border-primary shadow-lg ring-4 ring-primary/10",
    org: "bg-white text-gray-800 border-primary border-t-4 shadow-md",
    facility: "bg-white text-gray-700 border-gray-200 border shadow-sm hover:border-primary hover:shadow-md transition-all",
    address: "bg-gray-50 text-gray-500 border-gray-200 border border-dashed text-xs shadow-sm max-w-[180px]",
    default: "bg-white border-gray-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative z-10 flex flex-col items-center justify-center px-5 py-3 rounded-lg min-w-[160px] max-w-[220px] ${styles[type]}`}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <span className={`text-center font-medium break-words w-full ${type === "address" ? "text-xs" : "text-sm"}`}>
        {title}
      </span>
    </motion.div>
  );
};

const ConnectorLine = ({ vertical = false, height = "h-8" }: { vertical?: boolean; height?: string }) => (
  <div className={`bg-gray-300 ${vertical ? `w-px ${height}` : "h-px w-8"}`} />
);

const TreeBranch = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row justify-center items-start gap-6 pt-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-300" />
      {children}
    </div>
  );
};

const TreeNodeWrapper = ({
  children,
  isFirst,
  isLast,
  isOnly,
}: {
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  isOnly?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center relative">
      {!isOnly && (
        <div className="absolute top-[-2rem] w-full h-8">
          <div
            className={`h-px bg-gray-300 absolute top-0 
              ${isFirst ? "left-1/2 w-1/2 rounded-tl-lg" : ""} 
              ${isLast ? "right-1/2 w-1/2 rounded-tr-lg" : ""} 
              ${!isFirst && !isLast ? "w-full left-0" : ""}`}
          />
          <div className="h-full w-px bg-gray-300 absolute left-1/2 -translate-x-1/2" />
        </div>
      )}
      {isOnly && (
        <div className="absolute top-[-2rem] w-px h-8 bg-gray-300" />
      )}
      {children}
    </div>
  );
};

const FacilityStructure = () => {
  const [data, setData] = useState<OrgData | null>(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await axios.post<APIResponse>(
        "/get_all_facilities_for_parent_org_of_user",
        { p_user_id: getUserId() }
      );

      const templates = response.data.data.templates;
      if (!templates || templates.length === 0) return;

      const parent_org_name = templates[0].parent_org_name;

      const groupedOrgs = templates.reduce<OrgData["orgs"]>((acc, row) => {
        const existing = acc.find((o) => o.org_id === row.org_id);
        if (existing) {
          existing.facilities.push({
            facility_id: row.facility_id,
            facility_name: row.facility_name,
            facility_address: row.facility_address,
          });
        } else {
          acc.push({
            org_id: row.org_id,
            org_name: row.org_name,
            facilities: [
              {
                facility_id: row.facility_id,
                facility_name: row.facility_name,
                facility_address: row.facility_address,
              },
            ],
          });
        }
        return acc;
      }, []);

      setData({ parent_org_name, orgs: groupedOrgs });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  if (!data) return null;

  return (
    <div className="flex flex-col h-full gap-6">
      <PageHeader className="shadow-sm border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Facility Structure
        </h1>
      </PageHeader>

      <div className="flex-1 w-full overflow-auto bg-gray-50/30 p-10 rounded-xl">
        <div className="min-w-fit flex flex-col items-center pb-12">

          <CardNode
            title={data.parent_org_name}
            type="root"
            icon={<BuildingIcon />}
          />

          {data.orgs.length > 0 && (
            <TreeBranch>
              {data.orgs.map((org, orgIndex) => (
                <TreeNodeWrapper
                  key={org.org_id}
                  isFirst={orgIndex === 0}
                  isLast={orgIndex === data.orgs.length - 1}
                  isOnly={data.orgs.length === 1}
                >
                  <CardNode
                    title={org.org_name}
                    type="org"
                  />

                  {org.facilities.length > 0 && (
                    <TreeBranch>
                      {org.facilities.map((facility, facIndex) => (
                        <TreeNodeWrapper
                          key={facility.facility_id}
                          isFirst={facIndex === 0}
                          isLast={facIndex === org.facilities.length - 1}
                          isOnly={org.facilities.length === 1}
                        >
                          <div className="flex flex-col items-center">
                            <CardNode
                              title={facility.facility_name}
                              type="facility"
                              icon={<User />}
                            />

                            <ConnectorLine vertical height="h-4" />

                            <motion.div
                              className="flex items-start bg-gray-50 border border-gray-200 rounded-md p-2 max-w-[180px] shadow-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="mt-0.5 shrink-0">
                                <MapPinIcon />
                              </div>
                              <span className="text-xs text-gray-500 leading-tight">
                                {facility.facility_address}
                              </span>
                            </motion.div>
                          </div>
                        </TreeNodeWrapper>
                      ))}
                    </TreeBranch>
                  )}
                </TreeNodeWrapper>
              ))}
            </TreeBranch>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityStructure;