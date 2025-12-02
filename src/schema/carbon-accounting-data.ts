import { Factory, Recycle, Zap } from "lucide-react";

export type Icon = string;
export const CarbonTransactionScopes = [
    {
        id: 1,
        title: "Scope 1 – Direct Emissions",
        desc: "Fuel combustion, industrial processes, and other direct emissions from owned sources.",
        status: "Comments shared by internal team",
        tone: "emerald" as Icon,
        Icon: Factory,
        isClickable: true,
    },
    {
        id: 2,
        title: "Scope 2 – Indirect Energy Emissions",
        desc: "Purchased electricity, steam, heating and cooling consumed by your organization.",
        status: "Under-Review with external team",
        tone: "amber" as Icon,
        Icon: Zap,
    },
    {
        id: 3,
        title: "Scope 3 – Value Chain Emissions",
        desc: "Business travel, procurement, waste disposal and product life cycle emissions.",
        status: "Completed - Verified",
        tone: "sky" as Icon,
        Icon: Recycle,
        file: "sample.pdf",
    },
]

export const drawerScopes = [
    {
        id: 1,
        title: "Scope 1 – Direct Emissions",
        desc: "Fuel combustion, industrial processes, and other direct emissions from owned sources.",
        Icon: Factory,
    },
    {
        id: 2,
        title: "Scope 2 – Indirect Energy Emissions",
        desc: "Purchased electricity, steam, heating and cooling consumed by your organization.",
        Icon: Zap,
    },
    {
        id: 3,
        title: "Scope 3 – Value Chain Emissions",
        desc: "Business travel, procurement, waste disposal and product life cycle emissions.",
        Icon: Recycle,
    },
];

export const iconMap: Record<
    Icon,
    { iconBg: string; iconFg: string; bar: string; badge: string; text: string }
> = {
    emerald: {
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-700",
        bar: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700",
        text: "text-emerald-700",
    },
    amber: {
        iconBg: "bg-amber-100",
        iconFg: "text-amber-700",
        bar: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700",
        text: "text-amber-800",
    },
    sky: {
        iconBg: "bg-sky-100",
        iconFg: "text-sky-700",
        bar: "bg-sky-500",
        badge: "bg-sky-100 text-sky-700",
        text: "text-sky-700",
    },
};

export const feedData = [
    {
        id: 1,
        name: "Jeremy Jacob",
        time: "2 days ago",
        product: "Tata Wire",
        date: "20/Dec/2024",
        location: "MexicoCity#11",
        file: "AX12_TataWire.xlsx",
        role: "Internal"
    },
    {
        id: 2,
        name: "Anjali Rao",
        time: "5 days ago",
        product: "Steel Pipes",
        date: "15/Dec/2024",
        location: "Mumbai#04",
        file: "STP15_Steel.xlsx",
        role: "Internal"
    },
    {
        id: 3,
        name: "Michael Chen",
        time: "15 days ago",
        product: "Copper Sheets",
        date: "10/Dec/2024",
        location: "Delhi#04",
        file: "STP15_Copper.xlsx",
        role: "External"
    },
    {
        id: 4,
        name: "Anjali Rao",
        time: "5 days ago",
        product: "Steel Pipes",
        date: "15/Dec/2024",
        location: "Mumbai#04",
        file: "STP15_Steel.xlsx",
        role: "Internal"
    },
    {
        id: 5,
        name: "Michael Chen",
        time: "15 days ago",
        product: "Copper Sheets",
        date: "10/Dec/2024",
        location: "Delhi#04",
        file: "STP15_Copper.xlsx",
        role: "External"
    },
];
