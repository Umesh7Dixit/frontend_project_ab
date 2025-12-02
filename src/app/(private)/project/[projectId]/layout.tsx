"use client";
import { ProjectProvider } from "@/lib/context/ProjectContext";
import { getProjectId } from "@/lib/jwt";

export default function ProjectPage({ children }: { children: React.ReactNode }) {
    return (
        <ProjectProvider projectId={Number(getProjectId())}>
            {children}
        </ProjectProvider>
    );
}
