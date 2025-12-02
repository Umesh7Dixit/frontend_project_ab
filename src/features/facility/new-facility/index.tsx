"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { sections, Section, Field, formSchema, FormSchema } from "@/schema/facility-fields";
import FieldRenderer from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Check } from "lucide-react";
import axios from "@/lib//axios/axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getOrgs } from "@/lib/api/facility";

import { COOKIE_USER_INFO } from "@/lib/constants";
import { useRouter } from "next/navigation";


type FormValues = FormSchema;

export default function NewFacilityForm() {
  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: "onSubmit",
  });
  const [organization, setOrganization] = useState<{ label: string; value: string }[]>([]);
  const { handleSubmit, reset, getValues } = methods;

  const [activeSectionId, setActiveSectionId] = useState<string>(
    sections[0].id
  );

  const sectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === activeSectionId),
    [activeSectionId]
  );

  // simple progress: percent of fields with a non-empty value (UI placeholder)
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    const token = Cookies.get(COOKIE_USER_INFO);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        value &&
        typeof (value as any).name === "string" &&
        typeof (value as any).size === "number"
      ) {
        formData.append(key, value as File);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
      const res = await axios.post("/createNewFacility", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.issuccessful) {
        router.push("/facility/login");
        toast.success("Facility created successfully!");
      }
    } catch (error) {
      console.error("Create Facility Error:", error);
    }
  };

  const onClear = () => {
    reset();
  };

  const activeSection: Section | undefined = sections.find(
    (s) => s.id === activeSectionId
  );


  useEffect(() => {
    const rawInfo = Cookies.get("user_data");
    const parsedInfo = JSON.parse(rawInfo || "{}");
    const parentOrgId = Number(parsedInfo.parent_org_id);
    (async () => {
      try {
        await getOrgs({ parent_org_id: parentOrgId, setOrganization });
      } catch (err) {
        console.error("Failed to fetch orgs:", err);
      }
    })();
  }, []);


  const updatedSections = sections.map(section => {
    if (section.id === "basic") {
      return {
        ...section,
        fields: section.fields.map(f =>
          f.name === "p_org_id"
            ? { ...f, options: organization }
            : f
        ),
      };
    }
    return section;
  });
  const progress = useMemo(() => {
    const values = getValues();
    const allFields = updatedSections.flatMap((s) => s.fields.map((f) => f.name));
    const total = allFields.length || 1;
    let filled = 0;
    allFields.forEach((k) => {
      const v = (values as any)[k];
      if (v !== undefined && v !== null && v !== "") filled += 1;
    });
    return Math.round((filled / total) * 100);
  }, [getValues]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto md:p-4 "
      >
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-slate-800">
              Create New Facility
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500">
              Add a new facility to your account
            </p>
          </div>
          <div className="w-full md:w-80">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-600">Profile completion</div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-medium">{progress}%</span>
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <Progress
              value={progress}
              className="h-2 rounded-full bg-white/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <aside className="sticky top-6 self-start">
            <Card className="p-3  bg-white/5 backdrop-blur-xl border border-white/8">
              <nav aria-label="Sections" className="space-y-2 ">
                {sections.map((sec) => {
                  const active = sec.id === activeSectionId;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-3 transition ${active
                        ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                        : "hover:bg-white/3"
                        }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {sec.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {sec.subtitle}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          <section>
            <Card className="p-6 bg-white/6 backdrop-blur-xl border border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {activeSection?.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeSection?.subtitle}
                  </p>
                </div>

                <div className="text-xs text-slate-500">
                  Section {sectionIndex + 1} / {sections.length}
                </div>
              </div>

              <div className="mt-4">
                <AnimatePresence>
                  {activeSection && (
                    <motion.div
                      key={activeSection.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {updatedSections
                          .find((section) => section.id === activeSection.id)
                          ?.fields.map((field: Field) => (
                            <div key={field.name} className={`space-y-1 ${field.cols === 2 ? "col-span-2" : ""}`}>
                              <FieldRenderer field={field} form={methods} />
                              {methods.formState.errors[field.name as keyof FormValues] && (
                                <p className="text-sm text-red-500 mt-1">
                                  {String(methods.formState.errors[field.name as keyof FormValues]?.message)}
                                </p>
                              )}
                            </div>
                          ))}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            <div className="pt-4 border-t border-white/6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const prev = sections[sectionIndex - 1];
                    if (prev) setActiveSectionId(prev.id);
                  }}
                  disabled={sectionIndex <= 0}
                  className="w-full md:w-auto"
                >
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    const next = sections[sectionIndex + 1];
                    if (next) setActiveSectionId(next.id);
                  }}
                  disabled={sectionIndex >= sections.length - 1}
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600"
                >
                  Next
                </Button>
              </div>

              <div className="flex w-full md:w-auto gap-2 flex-col sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onClear}
                  className="w-full md:w-auto"
                >
                  Clear
                </Button>

                <Button
                  // disabled={progress !== 100}
                  type="submit" className="w-full md:w-auto">
                  Create Facility
                </Button>
              </div>
            </div>
          </section>
        </div>
      </form>
    </FormProvider>
  );
}
