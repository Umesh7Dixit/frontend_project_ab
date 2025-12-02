"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { sections, Section, Field, formSchema } from "@/schema/new-project-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Check, Info } from "lucide-react";
import FieldRenderer from "./FieldRender";
import { useRouter } from "next/navigation";
import InfoDrawer from "./InfoDrawer";
import Cookies from "js-cookie";
import { COOKIE_USER_INFO, ORGANIZATION_INFO } from "@/lib/constants";
import { projectApi } from '@/lib/api/project';

type FormValues = z.infer<typeof formSchema>;


export default function NewProject() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facility: "",
      facilityId: "",
      orgName: "",
      industry: undefined,
      responsible: "",
      user: "",
      use: "",
      boundary: undefined,
      protocol: undefined,
      reportingDateFrom: "",
      reportingDateTo: "",
      baseYear: "",
      accessGivenUsers: ""
    },
    mode: "onChange",
  });

  //errors to the destructured methods
  const { formState: { errors, isSubmitting } } = methods;

  // In your NewProject component's useEffect
  useEffect(() => {
    const facilityData = Cookies.get(ORGANIZATION_INFO);
    if (facilityData) {
      try {
        const parsedData = JSON.parse(facilityData);
        methods.reset({
          ...methods.getValues(), // Keep existing values
          facility: parsedData.facility_name || "",
          facilityId: parsedData.facility_id?.toString() || "", // Ensure it's a string
          orgName: parsedData.organization_name || parsedData.org_name || "" // Try both possible property names
        });
      } catch (error) {
        console.error("Error parsing facility data:", error);
      }
    }
  }, [methods]);

  const { handleSubmit, reset, getValues } = methods;
  const [activeSectionId, setActiveSectionId] = useState<string>(
    sections[0].id
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const router = useRouter();

  const sectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === activeSectionId),
    [activeSectionId]
  );

  const progress = useMemo(() => {
    const values = getValues();
    const totalFields = sections.flatMap(s => s.fields).length;

    const filledFields = sections
      .flatMap(s => s.fields)
      .filter(f => {
        const v = values[f.name];
        return v !== undefined && v !== "";
      }).length;

    return Math.round((filledFields / totalFields) * 100);
  }, [methods.watch()]);

  const onSubmit = async (data: FormValues) => {
    try {
      const token = Cookies.get(COOKIE_USER_INFO);
      if (!token) {
        toast.error("Authentication required", { description: "Please login first." });
        router.replace("/login");
        return;
      }

      const teamAssignments = (() => {
        try {
          const parsed = JSON.parse(data.accessGivenUsers);
          if (Array.isArray(parsed)) {
            return parsed.map(u => Number(u.user_id));
          }
          return [];
        } catch {
          return [];
        }
      })();
      
      const projectData = {
        facility_id: data.facilityId,
        project_name: data.projectName,
        project_description: data.projectDescription,
        reporting_period_start: data.reportingDateFrom,
        reporting_period_end: data.reportingDateTo,
        responsible_party: data.responsible,
        intended_user: data.user,
        intended_use_of_inventory: data.use,
        organisational_boundary_type: data.boundary,
        reporting_protocol: data.protocol,
        base_year: Number(data.baseYear),
        team_assignments: teamAssignments,

        base_year_emissions: (data.baseYearEmissions ?? []).map(e => ({
          scope: e.scope,
          total_mtco2e: e.total || "",
          co2_mt: e.co2 || "",
          ch4_mt: e.ch4 || "",
          n2o_mt: e.n2o || "",
          hfcs_mt: e.hfcs || "",
          pfcs_mt: e.pfcs || "",
          sf6_mt: e.sf6 || "",
        })),

        org_boundaries: (data.organizationalBoundaries ?? []).map(r => ({
          entity_name: r.entity || "",
          equity_share: r.equityShare || "",
          financial_control:
            r.financialControl?.trim()
              ? r.financialControl.toLowerCase() === "yes"
              : "",
          operational_control:
            r.operationalControl?.trim()
              ? r.operationalControl.toLowerCase() === "yes"
              : "",
        })),

        // remaining fields
        base_year_recalculation_policy: data.baseYearRecalculationPolicy,
        context_for_significant_changes: data.recalculationContext,
        non_ghg_methodologies: data.methodologiesUsed,
        methodologies_references: data.methodologyReferences,
        excluded_facilities: data.facilitiesExcluded,
        contractual_provisions: data.contractualProvisionInfo,
        external_assurance: data.externalAssurance,
        inventory_uncertainty: data.inventoryQuality,
        ghg_sequestration: data.ghgSequestration,
        organisational_diagram: data.organizationalDiagram,
      }


      console.log("Data = ", projectData)
      const response = await projectApi.createProject(projectData, token);
      if (response.issuccessful) {
        toast.success("Project created successfully!");
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "projectId",
            response.data.project_id.toString()
          );
        }
        router.push(
          `/create-project/templates/${response.data.project_id}?industry=${encodeURIComponent(response.data.industry)}`
        );
      } else {
        toast.error(response.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An error occurred while creating the project");
    }
  };

  const onClear = () => {
    reset({
      industry: undefined,
      responsible: "",
      user: "",
      projectName: "",
      projectDescription: "",
      use: "",
      boundary: undefined,
      protocol: undefined,
      reportingDateFrom: "",
      reportingDateTo: "",
      baseYear: "",
      accessGivenUsers: ""
    });
  };

  const activeSection: Section | undefined = sections.find(
    (s) => s.id === activeSectionId
  );

  const allFieldsFilled = Object.values(getValues()).every(v => v !== undefined && v !== "");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="max-w-7xl mx-auto md:p-6 w-full">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-lg md:text-2xl font-semibold text-slate-800">
                Create Project
              </h1>
            </div>

            <div className="w-full md:w-80">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-600">Project completion</div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium">{progress}%</span>
                  {
                    progress === 100 && <Check className="h-4 w-4 text-emerald-500" />
                  }
                </div>
              </div>
              <Progress
                value={progress}
                className="h-2 rounded-full bg-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
            <aside className="self-start">
              <Card className="p-3 bg-white/5 backdrop-blur-xl border border-white/8">
                <nav aria-label="Sections" className="space-y-2">
                  {sections.map((sec) => {
                    const active = sec.id === activeSectionId;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveSectionId(sec.id)}
                        className={`relative w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-3 transition ${active
                          ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                          : "hover:bg-white/3"
                          }`}
                      >
                        <Info
                          size={15}
                          className="absolute right-3 top-2 text-secondary cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(sec.id);
                            setInfoDrawerOpen(true);
                          }}
                        />
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

            <section className="flex flex-col">
              <Card className="p-6 bg-white/6 backdrop-blur-xl border border-white/10 flex flex-col min-h-[66vh]">
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

                <div className="flex-1">
                  <AnimatePresence>
                    {activeSection && (
                      <motion.div
                        key={activeSection.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18 }}
                        className="h-full"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min h-full">
                          {activeSection.fields.map((field: Field) => (
                            <div
                              key={field.name}
                              className={`space-y-1 ${field.cols === 2 ? "col-span-2" : ""}`}
                            >

                              <FieldRenderer
                                field={field}
                                form={methods}
                              />
                              {errors[field.name as keyof FormValues] && (
                                <p className="text-sm text-red-500 mt-1">
                                  {String(errors[field.name as keyof FormValues]?.message)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 pt-4 border-t border-white/6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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
                        const currentSection = sections[sectionIndex];
                        const values = getValues();

                        const fields = currentSection.fields.map(f => f.name);
                        const incomplete = fields.some(field => {
                          const value = values[field];
                          return value === undefined || value === "";
                        });

                        if (incomplete) {
                          toast.error("Please complete this section before moving ahead");
                          return;
                        }

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
                      type="submit"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Project'}
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </form>
      {infoDrawerOpen && (
        <InfoDrawer
          open={infoDrawerOpen}
          onClose={setInfoDrawerOpen}
          selectedItem={selectedItem}
        />
      )}
    </FormProvider>
  );
}
