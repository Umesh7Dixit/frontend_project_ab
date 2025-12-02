export const AllRequestsTableCol = [
    { key: "title", label: "Title" },
    { key: "requestId", label: "Request ID" },
    { key: "dateCreated", label: "Date Created" },
    { key: "lastActivity", label: "Last Activity" },
    { key: "projectName", label: "Project Name" },
    { key: "projectId", label: "Project ID" },
    { key: "createdBy", label: "Created By" },
    { key: "agentName", label: "Agent Name" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
];

export const AllRequestsTableRowValues = [
    { title: "Fuel", requestId: "1234", dateCreated: "12/12/2022", lastActivity: "12/12/2022", projectName: "Project 1", projectId: "1234", createdBy: "John Doe", agentName: "John Doe", role: "Admin", status: "Pending" },
    { title: "Lorem", requestId: "6578", dateCreated: "12/12/2022", lastActivity: "12/12/2022", projectName: "Project 2", projectId: "1234", createdBy: "John Doe", agentName: "John Doe", role: "Admin", status: "Active" },
]

export const StatusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Active: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
}