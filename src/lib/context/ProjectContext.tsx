"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios/axios";

export interface EmissionSummary {
    project_name: string;
    total_carbon: number;
    scope_1_total: number;
    scope_2_total: number;
    scope_3_total: number;
}

interface ProjectContextValue {
    summary: EmissionSummary | null;
}

const ProjectContext = createContext<ProjectContextValue>({
    summary: null
});

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({
    projectId,
    children,
}: {
    projectId: number;
    children: React.ReactNode;
}) => {
    const [summary, setSummary] = useState<EmissionSummary | null>(null);

    const fetchSummary = async () => {
        try {
            const response = await axios.post("/get_project_total_emissions_summary", {
                p_project_id: projectId,
            });

            const raw = response?.data?.data?.templates?.[0];
            if (!raw) return;

            setSummary({
                project_name: raw.project_name,
                total_carbon: Number(raw.total_carbon),
                scope_1_total: Number(raw.scope_1_total),
                scope_2_total: Number(raw.scope_2_total),
                scope_3_total: Number(raw.scope_3_total),
            });
        } catch (err) {
            console.error("Error fetching emissions summary:", err);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [projectId]);

    return (
        <ProjectContext.Provider value={{ summary }}>
            {children}
        </ProjectContext.Provider>
    );
};
