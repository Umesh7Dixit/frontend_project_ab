"use client";

import DynamicTable from "./components/DynamicTable";
import { Column, ProjectRow } from "./utils";
type Props = {
    data: ProjectRow[];
    compact: boolean;
    title: string;
    columns: Column[];
}
export const ProjectTable = ({ data, compact, title, columns }: Props) => {
    return (
        <DynamicTable
            title={title}
            columns={columns}
            data={data}
            compact={compact}
            sortKey="last_activity"
            onRowClick={(row) => {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("projectId", row.id.toString());
                }
                return `/project/${row.id}/data-control`;
            }}
        />
    );
};
