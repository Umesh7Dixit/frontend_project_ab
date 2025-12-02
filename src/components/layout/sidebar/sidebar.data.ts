import {
    LayoutDashboard,
    FolderPlus,
    FolderKanban,
    Building2,
    FileBarChart,
    Inbox,
    Bell,
    Settings,
    ArrowLeft,
    Users,
    FileText,
    // DownloadCloud,
    ListChecks,
    HomeIcon,
} from "lucide-react";

export type SidebarItem = {
    id: string;
    label: string;
    href?: string; // only for navigation
    icon?: React.ComponentType<{ className?: string }>;
    action?: "notifications"; // for special cases
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
    // main
    { id: "home", label: "Home", href: "/", icon: HomeIcon },
    { id: "dashboard", label: "Dashboard", href: "/dashboard/ghg", icon: LayoutDashboard },
    { id: "create-project", label: "Create Project", href: "/create-project/modules", icon: FolderPlus },
    { id: "add-facility", label: "Add Facility", href: "/facility/register", icon: Building2 },
    { id: "raise-request", label: "Raise a Request", href: "/requests/raise-request", icon: Inbox },
    { id: "my-projects", label: "My Projects", href: "/my-projects/all-projects", icon: FolderKanban },
    { id: "requests", label: "Requests", href: "/requests", icon: Inbox },
    { id: "tasks", label: "Tasks", href: "/tasks", icon: ListChecks },

    // special (not navigation)
    { id: "notifications", label: "Notifications", action: "notifications", icon: Bell },

    // explicit facility ids
    { id: "facility/register", label: "Register Facility", href: "/facility/register", icon: Building2 },
    { id: "facility/structure", label: "Facility Structure", href: "/facility/structure", icon: Users },

    // dashboard-specific mains
    { id: "ghg", label: "GHG", href: "/dashboard/ghg", icon: FileBarChart },
    { id: "cbam", label: "CBAM", href: "/dashboard/cbam", icon: FileBarChart },

    // create-project mains
    { id: "project", label: "Project", href: "/project/2/data-control", icon: FolderPlus },
    { id: "project-dashboard", label: "Project Dashboard", href: "/project/1/ghg-dashboard", icon: LayoutDashboard },
    { id: "manage-team", label: "Manage Team", href: "/create-project/team", icon: Users },

    // download-report variants
    { id: "download-report", label: "Download Report", href: "/project/12/download-report", icon: FileBarChart },

    // my-projects
    { id: "all-projects", label: "All Projects", href: "/my-projects/all-projects", icon: FolderKanban },
    { id: "live-projects", label: "Live Projects", href: "/my-projects/live-projects", icon: FolderKanban },
    { id: "completed-projects", label: "Completed Projects", href: "/my-projects/completed-projects", icon: FolderKanban },

    // raise-request sub-pages
    { id: "data-request", label: "Data Request", href: "/data-request", icon: FileText },
    { id: "verification-request", label: "Verification Request", href: "/verification-request", icon: ListChecks },
    { id: "support-request", label: "Support Request", href: "/support-request", icon: Inbox },
    { id: "custom-request", label: "Custom Request", href: "/custom-request", icon: ListChecks },

    // settings
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },

    // special
    { id: "back", label: "Back", icon: ArrowLeft },
];

export const ROUTE_MAP: Record<string, string[]> = {
    "/": ["dashboard", "create-project", "add-facility", "my-projects", "requests", "tasks", "settings"],
    "/tasks": ["back"],

    "/dashboard/*": ["ghg", "cbam", "back"],
    "/requests/*": ["back"],

    "/create-project": ["project", "project-dashboard", "download-report", "raise-request", "back"],
    "/create-project/modules": ["dashboard", "create-project", "add-facility", "my-projects", "requests", "settings", "back"],
    "/create-project/*": ["project", "project-dashboard", "download-report", "raise-request", "back"],

    "/project/*": ["project", "project-dashboard", "download-report", "raise-request", "back"],

    "/my-projects": ["all-projects", "live-projects", "completed-projects", "back"],
    "/my-projects/*": ["all-projects", "live-projects", "completed-projects", "back"],

    "/facility/*": ["facility/register", "facility/structure", "back"],
    "/facility": ["facility/register", "facility/structure", "back"],

    "/raise-request": ["data-request", "verification-request", "support-request", "custom-request"],
    "/raise-request/*": ["data-request", "verification-request", "support-request", "custom-request"],

    // fallback
    fallback: ["dashboard", "create-project", "add-facility", "my-projects", "requests", "settings"],
};
