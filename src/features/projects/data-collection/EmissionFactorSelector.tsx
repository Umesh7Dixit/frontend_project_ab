"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { templateApi } from "@/lib/api/templates";
import { toast } from "sonner";
import CategoryTabs from "../data-entry/CategoryTabs";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import axios from "@/lib/axios/axios";
import { Plus, ChevronRight, Calculator, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { token, getProjectId } from "@/lib/jwt";
import { useUser } from "@/lib/context/EntriesContext";

// --- Types ---
type MainCategory = { category_id: number; category_name: string };
export type SubCategoryType = { subcategory_name: string };
type Activity = { activity_name: string };
type Selection1 = { selection_1_name: string };
type Selection2 = { selection_2_name: string };
export type databaseType = "GHG Protocol" | "DEFRA";

interface Props {
    scope: number;
    searchQuery: string;
    database: databaseType;
    customRoots?: { subcategory_name: string }[];
}

export default function EmissionFactorSelector({
    scope,
    searchQuery,
    database,
    customRoots,
}: Props) {
    const scopeText = `Scope ${scope}`;
    const { addedEntries, setAddedEntries } = useUser();
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
    const [activeSubCategory, setActiveSubCategory] = useState("");

    // Data Lists
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selection1s, setSelection1s] = useState<Selection1[]>([]);
    const [selection2s, setSelection2s] = useState<Selection2[]>([]);

    // Selections
    const [selectedActivity, setSelectedActivity] = useState("");
    const [selectedSelection1, setSelectedSelection1] = useState("");
    const [selectedSelection2, setSelectedSelection2] = useState("");

    // Calculation & Results
    const [emissionFactor, setEmissionFactor] = useState("");
    const [subCategoryId, setSubCategoryId] = useState(0);
    const [unit, setUnit] = useState("Tonnes");
    const [frequency, setFrequency] = useState("Monthly");

    // Loading States
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingSel1, setLoadingSel1] = useState(false);
    const [loadingSel2, setLoadingSel2] = useState(false);
    const [calculating, setCalculating] = useState(false);

    const projectId = getProjectId();
    // --- Initial Data Load ---
    useEffect(() => {
        if (customRoots) {
            setSubCategories(customRoots);
            setActiveSubCategory(customRoots[0]?.subcategory_name ?? "");
            return;
        }

        (async () => {
            const catRes = await templateApi.getMainCategoriesForScopeAndSource(
                token,
                scopeText,
                database
            );

            if (catRes.issuccessful && catRes.data?.categories) {
                setMainCategories(catRes.data.categories);
                let subcatArr: SubCategoryType[] = [];
                await Promise.all(
                    catRes.data.categories.map(async (cat) => {
                        const subRes = await templateApi.getSubcategoriesForMainCategory(
                            token,
                            cat.category_id
                        );
                        if (subRes.issuccessful && subRes.data?.templates) {
                            subRes.data.templates.forEach((sub) => {
                                subcatArr.push({ subcategory_name: sub.subcategory_name });
                            });
                        }
                    })
                );

                const uniqueSubCats = Array.from(
                    new Map(subcatArr.map((sc) => [sc.subcategory_name, sc])).values()
                );
                setSubCategories(uniqueSubCats);
                if (uniqueSubCats.length > 0) {
                    setActiveSubCategory(uniqueSubCats[0].subcategory_name);
                }
            }
        })();
    }, [database, customRoots]);

    const filteredSubcategories = useMemo(() => {
        if (!searchQuery.trim()) return subCategories;
        const q = searchQuery.toLowerCase();
        return subCategories.filter((sc) =>
            sc.subcategory_name.toLowerCase().includes(q)
        );
    }, [subCategories, searchQuery]);

    useEffect(() => {
        if (
            activeSubCategory &&
            !filteredSubcategories.some((sc) => sc.subcategory_name === activeSubCategory)
        ) {
            setActiveSubCategory(filteredSubcategories[0]?.subcategory_name ?? "");
        }
    }, [filteredSubcategories]);

    // --- Fetch Activities ---
    useEffect(() => {
        if (!activeSubCategory) {
            setActivities([]);
            return;
        }
        setLoadingActivities(true);
        setSelectedActivity("");
        setSelection1s([]);
        setSelectedSelection1("");
        setSelection2s([]);
        setSelectedSelection2("");
        setEmissionFactor("");

        (async () => {
            let mainCatId = undefined;
            for (const cat of mainCategories) {
                const subRes = await templateApi.getSubcategoriesForMainCategory(
                    token,
                    cat.category_id
                );
                if (subRes.issuccessful && subRes.data?.templates.some((sc) => sc.subcategory_name === activeSubCategory)) {
                    mainCatId = cat.category_id;
                    break;
                }
            }

            if (!mainCatId) {
                setActivities([]);
                setLoadingActivities(false);
                return;
            }

            const actRes = await templateApi.getActivitiesForSubcategory(
                token,
                mainCatId,
                activeSubCategory
            );
            setActivities(actRes.issuccessful && actRes.data?.templates ? actRes.data.templates : []);
            setLoadingActivities(false);
        })();
    }, [activeSubCategory, mainCategories]);

    useEffect(() => {
        if (!activeSubCategory || !selectedActivity) {
            setSelection1s([]);
            return;
        }
        setLoadingSel1(true);
        setSelectedSelection1("");
        setSelection2s([]);
        setSelectedSelection2("");
        setEmissionFactor("");

        (async () => {
            const mainCatId = await getMainCatId();
            const sel1Res = await templateApi.getSelection1ForActivity(
                token,
                mainCatId!,
                activeSubCategory,
                selectedActivity
            );

            const templates = sel1Res.issuccessful && sel1Res.data?.templates ? sel1Res.data.templates : [];
            setSelection1s(templates);

            if (templates.length === 1 && templates[0].selection_1_name === "N/A") {
                setSelectedSelection1("N/A");
            }

            setLoadingSel1(false);
        })();
    }, [activeSubCategory, selectedActivity]);

    useEffect(() => {
        if (!activeSubCategory || !selectedActivity || !selectedSelection1) {
            setSelection2s([]);
            return;
        }
        setLoadingSel2(true);
        setSelectedSelection2("");
        setEmissionFactor("");

        (async () => {
            const mainCatId = await getMainCatId();
            const sel2Res = await templateApi.getSelection2ForSelection1(
                token,
                mainCatId!,
                activeSubCategory,
                selectedActivity,
                selectedSelection1
            );

            const templates = sel2Res.issuccessful && sel2Res.data?.templates ? sel2Res.data.templates : [];
            setSelection2s(templates);

            if (templates.length === 1 && templates[0].selection_2_name === "N/A") {
                setSelectedSelection2("N/A");
            }

            setLoadingSel2(false);
        })();
    }, [activeSubCategory, selectedActivity, selectedSelection1]);


    const getMainCatId = async () => {
        for (const cat of mainCategories) {
            const subRes = await templateApi.getSubcategoriesForMainCategory(token, cat.category_id);
            if (subRes.issuccessful && subRes.data?.templates.some((sc) => sc.subcategory_name === activeSubCategory)) {
                return cat.category_id;
            }
        }
        return undefined;
    };

    const handleCalculate = async () => {
        setCalculating(true);
        const mainCatId = await getMainCatId();

        const res = await templateApi.getEmissionFactor(
            token,
            database,
            scopeText,
            mainCatId!,
            activeSubCategory,
            selectedActivity,
            selectedSelection1,
            selectedSelection2 || null
        );

        const ef = res.issuccessful && res.data?.templates?.length > 0
            ? res.data.templates[0].emission_factor
            : "N/A";

        setEmissionFactor(ef ?? "N/A");
        setSubCategoryId(res.data?.templates?.[0]?.subcategory_id ?? 0);
        setCalculating(false);
    };

    const handleNewRow = async () => {
        const payload = {
            p_project_id: projectId,
            p_subcategory_id: subCategoryId,
            p_frequency: frequency,
        }
        try {
            const res = await axios.post("/append_staged_activity_by_id", payload);
            if (res.data?.issuccessful) {
                toast.success("Added!");
                const newEntry = {
                    activity: selectedActivity,
                    selection_1: selectedSelection1 || "N/A",
                    selection_2: selectedSelection2 || "N/A",
                    frequency,
                    unit,
                    database,
                    ef: emissionFactor,
                    sub_category: activeSubCategory,
                };
                setAddedEntries((prev) => [...prev, newEntry]);
                setEmissionFactor("");
            }
        } catch (e: any) {
            console.error(e?.response?.data?.message);
            toast.error(e?.response?.data?.message || "Error adding entry.");
        }
    };

    const showSel1 = (selection1s.length > 0 && selectedSelection1 !== "N/A") || loadingSel1;
    const showSel2 = (selection2s.length > 0 && selectedSelection2 !== "N/A") || loadingSel2;

    return (
        <div className="flex flex-col w-full h-full gap-6">
            <div className="w-full rounded-xl p-1 shadow-sm">
                <CategoryTabs
                    categories={filteredSubcategories.map((sc) => sc.subcategory_name)}
                    activeCategory={activeSubCategory}
                    onChange={(v) => setActiveSubCategory(v)}
                    currentScope={scope}
                    readOnly={true}
                />
            </div>
            <div className="grid p-2 grid-cols-1 md:grid-cols-3 gap-4">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectionColumn
                        title="Activity"
                        items={activities}
                        selectedId={selectedActivity}
                        onSelect={setSelectedActivity}
                        loading={loadingActivities}
                        labelKey="activity_name"
                    />

                    <AnimatePresence mode="popLayout">
                        {showSel1 && (
                            <SelectionColumn
                                title="Selection 1"
                                items={selection1s.filter(s => s.selection_1_name !== "N/A")}
                                selectedId={selectedSelection1}
                                onSelect={setSelectedSelection1}
                                loading={loadingSel1}
                                labelKey="selection_1_name"
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout">
                        {showSel2 && (
                            <SelectionColumn
                                title="Selection 2"
                                items={selection2s.filter(s => s.selection_2_name !== "N/A")}
                                selectedId={selectedSelection2}
                                onSelect={setSelectedSelection2}
                                loading={loadingSel2}
                                labelKey="selection_2_name"
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="col-span-1">
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-[#0b1f1d]/90 px-4 py-3">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Calculator size={20} />
                                Calculator
                            </h3>
                        </div>

                        <div className="px-4 py-3 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Unit</label>
                                    <Select value={unit} onValueChange={setUnit}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["kg", "Liters", "kwh", "Tonne.km", "Tonnes", "m3"].map(u => (
                                                <SelectItem key={u} value={u}>{u}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Frequency</label>
                                    <Select value={frequency} onValueChange={setFrequency}>
                                        <SelectTrigger className="bg-gray-50 border-gray-200">
                                            <SelectValue placeholder="Freq" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center border border-gray-100">
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">Emission Factor</span>
                                {emissionFactor ? (
                                    <span className="text-2xl font-bold text-emerald-600 block animate-in zoom-in duration-300">
                                        {emissionFactor}
                                    </span>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-300 block">--.--</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {!emissionFactor ? (
                                    <Button
                                        className="w-full bg-[#0b1f1d]/90 hover:bg-[#0b1f1d]/80 text-white shadow-lg "
                                        size="lg"
                                        onClick={handleCalculate}
                                        disabled={!selectedActivity || calculating || (loadingSel1 || loadingSel2)}
                                    >
                                        {calculating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Calculate Factor
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full bg-gray-900 hover:bg-black text-white"
                                        size="lg"
                                        onClick={handleNewRow}
                                        disabled={!subCategoryId}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Entry
                                    </Button>
                                )}

                                {emissionFactor && (
                                    <button
                                        onClick={() => setEmissionFactor("")}
                                        className="w-full text-xs text-gray-400 hover:text-gray-600 underline decoration-gray-300"
                                    >
                                        Reset calculation
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectionColumn({ title, items, selectedId, onSelect, loading, labelKey }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
            <div className="px-4 py-3 border-b border-gray-50 bg-muted/50">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading ? (
                    <div className="flex flex-col gap-2 p-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : (
                    items.map((item: any) => {
                        const label = item[labelKey];
                        const isActive = selectedId === label;
                        return (
                            <button
                                key={label}
                                onClick={() => onSelect(label)}
                                className={cn(
                                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 font-medium ring-1 ring-emerald-200"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <span className="truncate pr-2">{label}</span>
                                {isActive && <Check className="w-4 h-4 text-emerald-600" />}
                                {!isActive && <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                        );
                    })
                )}

                {!loading && items.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                        No options
                    </div>
                )}
            </div>
        </motion.div>
    );
}