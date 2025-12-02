// User level variables
export const COOKIE_USER_INFO = "user_info";
export const ORGANIZATION_INFO = "org-info";

// Project level variables
export const SCOPE_1_KEY = "scope1";
export const SCOPE_2_KEY = "scope2";
export const SCOPE_3_KEY = "scope3";
export const SCOPE_1_LABEL = "Scope 1";
export const SCOPE_2_LABEL = "Scope 2";
export const SCOPE_3_LABEL = "Scope 3";
export const SCOPE_3_UPSTREAM_LABEL = "Scope 3 (Upstream)";
export const SCOPE_3_DOWNSTREAM_LABEL = "Scope 3 (Downstream)";
export const SCOPE_3_UPSTREAM_KEY = "scope3Upstream";
export const SCOPE_3_DOWNSTREAM_KEY = "scope3Downstream";

export const ALL_SCOPES = [
    { label: SCOPE_1_LABEL, key: SCOPE_1_KEY },
    { label: SCOPE_2_LABEL, key: SCOPE_2_KEY },
    { label: SCOPE_3_UPSTREAM_LABEL, key: SCOPE_3_UPSTREAM_KEY },
    { label: SCOPE_3_DOWNSTREAM_LABEL, key: SCOPE_3_DOWNSTREAM_KEY },
]

export const SCOPES = {
    SCOPE_1_LABEL: SCOPE_1_LABEL,
    SCOPE_2_LABEL: SCOPE_2_LABEL,
    SCOPE_3_UPSTREAM_LABEL: SCOPE_3_UPSTREAM_LABEL,
    SCOPE_3_DOWNSTREAM_LABEL: SCOPE_3_DOWNSTREAM_LABEL,
    SCOPE_1_KEY: SCOPE_1_KEY,
    SCOPE_2_KEY: SCOPE_2_KEY,
    SCOPE_3_KEY: SCOPE_3_KEY,
    SCOPE_3_UPSTREAM_KEY: SCOPE_3_UPSTREAM_KEY,
    SCOPE_3_DOWNSTREAM_KEY: SCOPE_3_DOWNSTREAM_KEY,
}

export const CBAM = "CBAM";
export const GHG = "GHG";

export const MY_PROJECTS = {
    ALL_PROJECTS_KEY: "all-projects",
    LIVE_PROJECTS_KEY: "live-projects",
    COMPLETED_PROJECTS_KEY: "completed-projects",
    ALL_PROJECTS: "All Projects",
    LIVE_PROJECTS: "Live Projects",
    COMPLETED_PROJECTS: "Completed Projects",
}

export const MY_PROJECTS_ITEMS = {
    [MY_PROJECTS.ALL_PROJECTS_KEY]: MY_PROJECTS.ALL_PROJECTS,
    [MY_PROJECTS.LIVE_PROJECTS_KEY]: MY_PROJECTS.LIVE_PROJECTS,
    [MY_PROJECTS.COMPLETED_PROJECTS_KEY]: MY_PROJECTS.COMPLETED_PROJECTS,
};

// ui level variables
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;
export type BreakpointKey = keyof typeof BREAKPOINTS;

export const ScopeMembersRole = (role: string) => role.toLowerCase() === "internal" ? "Internal" : "External";
