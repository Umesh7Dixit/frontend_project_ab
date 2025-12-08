"use client";

import { motion } from "motion/react";
// import Image from "next/image";
import {
  CarbonTransactionScopes,
  Icon,
  iconMap,
} from "@/schema/carbon-accounting-data";
import ScopeProgressBar from "@/components/ScopeProgressBar";
import { useRouter } from "next/navigation";
type Props = {
  visibleScopes: number[];
  projectId?: number | null;
  progressObj: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
}
export default function ScopeCards({
  visibleScopes,
  // projectId,
  progressObj,
}: Props) {
  const router = useRouter();
  const scopes = CarbonTransactionScopes.filter((s) =>
    visibleScopes?.includes(s.id)
  );
  if (!visibleScopes || visibleScopes.length === 0) {
    return (
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">
        <p className="text-sm text-[#4b5563]">
          No scopes selected. Click{" "}
          <span className="font-medium text-[#0b1f1d]">Customize Scopes</span>{" "}
          to choose which ones to show.
        </p>
      </div>
    );
  }
  if (isNaN(progressObj.scope1) || isNaN(progressObj.scope2) || isNaN(progressObj.scope3)) {
    progressObj = { scope1: 0, scope2: 0, scope3: 0 };
  }
  return (
    <div className="grid gap-5 h-fit">
      {scopes.map(
        (
          // { id, title, desc, tone, Icon, file, isClickable },
          { id, title, desc, tone, Icon  },
          idx
        ) => {
          const progress =
            id === 1 ? progressObj.scope1 :
              id === 2 ? progressObj.scope2 :
                id === 3 ? progressObj.scope3 : 0;
          const t = iconMap[tone as Icon];
          return (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: idx * 0.06,
              }}
              whileHover={{ y: -2 }}
              className="rounded-2xl p-5 md:p-6 bg-white/5 backdrop-blur-xl hover:shadow-xl hover:ring-1 hover:ring-white/20 transition cursor-pointer shadow-lg"
              onClick={() =>
                router.push(`/project/${id}/data-entry?scope=${id}`)
              }
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-2xl ${t.iconBg} ${t.iconFg} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-[#0b1f1d] tracking-tight">
                    {title}
                  </h3>
                </div>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[#4b5563]">
                {desc}
              </p>

              {/* <div className="mt-3 flex items-center justify-between">
                <div className="mt-2 flex flex-wrap gap-2">
                  {file && (
                    <a
                      href="/file-template/BSI_ISO_14064_1_Verification_Opinion_Report_IJM_FY2024_signed.pdf"
                      download
                      onClick={(e) => e.stopPropagation()} // prevent card click
                    >
                      <Image
                        src={"/icons/pdf_ico.png"}
                        alt={"PDF Icon"}
                        width={40}
                        height={40}
                        className="cursor-pointer"
                      />
                    </a>
                  )}
                </div>
              </div> */}

              <ScopeProgressBar progress={progress} />
            </motion.article>
          );
        }
      )}
    </div>
  );
}
