import {
    Landmark,
    Globe,
    Recycle,
    Ship,
    Building2,
    TreePalm,
} from "lucide-react";

export const dashboardModules = [
    { name: "BURSA", icon: Landmark, desc: "Carbon trading & reports", route: "/facility/login" },
    { name: "GHG Carbon Accounting", icon: Globe, desc: "Track emissions by scope", route: "/facility/login" },
    { name: "LCA", icon: Recycle, desc: "Lifecycle impact analysis", route: "/facility/login" },
    { name: "CBAM", icon: Ship, desc: "Carbon Border Adjustment", route: "/facility/login" },
    { name: "SGX", icon: Building2, desc: "Sustainability Exchange", route: "/facility/login" },
    { name: "MSPO", icon: TreePalm, desc: "Palm Oil Certification", route: "/facility/login" }
];
