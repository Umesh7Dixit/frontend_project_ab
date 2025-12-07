"use client";
import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { Info, Pencil, Trash2, Save, X, Loader2} from "lucide-react";
import { cn } from "@/lib/utils";
import { templateApi, MainCategory } from "@/lib/api/templates";
import Cookies from "js-cookie";
import { COOKIE_USER_INFO } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios/axios";
import { toast } from "sonner";
import { DropdownOption, EditableRowProps, frequencyOptions, RowData } from "./utils";
import { Button } from "@/components/ui/button";

const DropdownField: React.FC<{
  value: string | number | undefined;
  options: DropdownOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, options, onChange, placeholder = "Select...", disabled = false }) => (
  <Select
    value={value?.toString() ?? ""}
    onValueChange={onChange}
    disabled={disabled}
  >
    <SelectTrigger className="w-full bg-white/80 border px-2 py-1 rounded text-xs h-8">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.length > 0 ? (
        options.map((o, i) => (
          <SelectItem key={String(o?.value) + "-" + i} value={o.value.toString()}>
            {o.label}
          </SelectItem>
        ))
      ) : (
        <div className="p-2 text-xs text-gray-400">No options</div>
      )}
    </SelectContent>
  </Select>
);

const EditableRow: React.FC<EditableRowProps> = ({
  row,
  setInfoDrawerOpen,
  setSelectedRow,
  setDeleteModalOpen,
  onUpdateRow,
  selectedRowIds,
  setSelectedRowIds,
  mode,
}) => {
  const token: string | undefined = Cookies.get(COOKIE_USER_INFO);
  let projectId = 0;
  if (typeof window !== "undefined") {
    let raw = window.localStorage.getItem("projectId");
    projectId = raw ? Number(raw) : 0;
  }
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [draft, setDraft] = useState<RowData>({ ...row });
  const [newSubCategoryId, setNewSubCategoryId] = useState(0);

  // Dropdown States
  const [unitOptions, setUnitOptions] = useState<DropdownOption[]>([]);
  const [mainCategories, setMainCategories] = useState<DropdownOption[]>([]);
  const [subCategories, setSubCategories] = useState<DropdownOption[]>([]);
  const [activities, setActivities] = useState<DropdownOption[]>([]);
  const [selection1Options, setSelection1Options] = useState<DropdownOption[]>([]);
  const [selection2Options, setSelection2Options] = useState<DropdownOption[]>([]);

  const scope = draft.scope || "Scope 1";
  const resetBelow = (level: keyof RowData) => {
    let clone: RowData = { ...draft };
    switch (level) {
      case "source":
        clone.main_category = "";
        clone.main_category_id = null;
        clone.sub_category = "";
        clone.activity = "";
        clone.selection_1 = "";
        clone.selection_2 = "";
        clone.ef = "";
        setSubCategories([]);
        setActivities([]);
        setSelection1Options([]);
        setSelection2Options([]);
        break;
      case "main_category":
        clone.sub_category = "";
        clone.activity = "";
        clone.selection_1 = "";
        clone.selection_2 = "";
        clone.ef = "";
        setActivities([]);
        setSelection1Options([]);
        setSelection2Options([]);
        break;
      case "sub_category":
        clone.activity = "";
        clone.selection_1 = "";
        clone.selection_2 = "";
        clone.ef = "";
        setSelection1Options([]);
        setSelection2Options([]);
        break;
      case "activity":
        clone.selection_1 = "";
        clone.selection_2 = "";
        clone.ef = "";
        setSelection2Options([]);
        break;
      case "selection_1":
        clone.selection_2 = "";
        clone.ef = "";
        break;
      case "selection_2":
        clone.ef = "";
        break;
    }
    setDraft(clone);
  };

  const loadMainCategories = async (source: string) => {
    if (!source) return [];
    const res = await templateApi.getMainCategoriesForScopeAndSource(token as string, scope, source);
    if (res.issuccessful && res.data && res.data.categories) {
      const opts = res.data.categories.map((c: MainCategory) => ({
        label: c.category_name,
        value: c.category_id
      }));
      setMainCategories(opts);
      return opts;
    }
    setMainCategories([]);
    return [];
  };

  const loadSubCategories = async (mainId: number | null | undefined) => {
    if (!mainId) return [];
    const res = await templateApi.getSubcategoriesForMainCategory(token as string, mainId);
    if (res.issuccessful && res.data && res.data.templates) {
      const opts = res.data.templates.map((s: any) => ({
        label: s.subcategory_name,
        value: s.subcategory_name
      }));
      setSubCategories(opts);
      return opts;
    }
    setSubCategories([]);
    return [];
  };

  const loadActivities = async (mainId: number | null | undefined, sub: string) => {
    if (!mainId || !sub) return [];
    const res = await templateApi.getActivitiesForSubcategory(token as string, mainId, sub);
    if (res.issuccessful && res.data && res.data.templates) {
      const opts = res.data.templates.map((a: any) => ({
        label: a.activity_name,
        value: a.activity_name
      }));
      setActivities(opts);
      return opts;
    }
    setActivities([]);
    return [];
  };

  const loadSelection1 = async (mainId: number | null | undefined, sub: string, act: string) => {
    if (!mainId || !sub || !act) return [];
    const res = await templateApi.getSelection1ForActivity(token as string, mainId, sub, act);
    if (res.issuccessful && res.data && res.data.templates) {
      const opts = res.data.templates.map((s: any) => ({
        label: s.selection_1_name,
        value: s.selection_1_name
      }));
      setSelection1Options(opts);
      if (opts.some((o: DropdownOption) => o.value === "N/A" && (!draft.selection_1 || draft.selection_1 === "N/A"))) {
        setDraft(prev => ({ ...prev, selection_1: "N/A" }));
        await loadSelection2(mainId, sub, act, "N/A");
      }
      return opts;
    }
    setSelection1Options([]);
    return [];
  };

  const loadSelection2 = async (mainId: number | null | undefined, sub: string, act: string, sel1: string) => {
    if (!mainId || !sub || !act || !sel1) return [];
    const res = await templateApi.getSelection2ForSelection1(token as string, mainId, sub, act, sel1);
    if (res.issuccessful && res.data && res.data.templates) {
      const opts = res.data.templates.map((s: any) => ({
        label: s.selection_2_name,
        value: s.selection_2_name
      }));
      setSelection2Options(opts);
      if (opts.some((o: DropdownOption) => o.value === "N/A" && (!draft.selection_2 || draft.selection_2 === "N/A"))) {
        setDraft(prev => ({ ...prev, selection_2: "N/A" }));
        await loadEF(draft.source, scope, mainId, sub, act, sel1, "N/A");
      }
      return opts;
    }
    setSelection2Options([]);
    return [];
  };

  const loadEF = async (source: string, scope: string, mainId: any, sub: string, act: string, sel1: string, sel2: string) => {
    if (!source || !scope || !mainId || !sub || !act || !sel1) {
      setDraft(prev => ({ ...prev, ef: "" }));
      return;
    }
    const res = await templateApi.getEmissionFactor(token as string, source, scope, mainId, sub, act, sel1, sel2);
    if (res.issuccessful) {
      const efVal = res.data.templates?.[0]?.emission_factor ?? "-";
      setNewSubCategoryId(res.data.templates?.[0]?.subcategory_id ?? 0);
      setDraft(prev => ({ ...prev, ef: efVal }));
    } else {
      setDraft(prev => ({ ...prev, ef: "-" }));
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await axios.get("/getUnits");
      const apiUnits = res.data.data.templates as { unit_name?: string; unit_id?: number }[];
      const mapped: DropdownOption[] = apiUnits
        .filter(u => u.unit_name !== undefined && u.unit_id !== undefined)
        .map(u => ({
          label: u.unit_name!,
          value: u.unit_id!,
        }));

      setUnitOptions(mapped);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  }

  const handleInitializeEdit = async () => {
    await fetchUnits();
    setIsLoading(true);
    try {
      const loadedMainCats = await loadMainCategories(draft.source || "GHG Protocol");
      let currentMainId = draft.main_category_id;
      if (!currentMainId && draft.main_category) {
        const found = loadedMainCats.find((c: any) => c.label === draft.main_category);
        if (found) currentMainId = Number(found.value);
      }

      if (currentMainId) {
        setDraft(prev => ({ ...prev, main_category_id: currentMainId }));
        await loadSubCategories(currentMainId);
        if (draft.sub_category) await loadActivities(currentMainId, draft.sub_category);
        if (draft.sub_category && draft.activity) await loadSelection1(currentMainId, draft.sub_category, draft.activity);
        if (draft.sub_category && draft.activity && draft.selection_1) await loadSelection2(currentMainId, draft.sub_category, draft.activity, draft.selection_1);
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Error initializing edit mode:", error);
      toast.error("Failed to load options.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const data = {
      "id": row.id,
      "unit": draft.unit,
      "scope": draft.scope,
      "activity": draft.activity,
      "selection_1": draft.selection_1,
      "selection_2": draft.selection_2,
      "sub_category": draft.sub_category,
      "subcategory_id": newSubCategoryId,
      "main_category": draft.main_category_label || draft.main_category,
      "source": draft.source,
      "ef": draft.ef,
      "frequency": draft.frequency,
    }
    if (onUpdateRow) onUpdateRow(row.id, data);
    const payload = {
      p_project_id: projectId,
      p_old_subcategory_id: draft.subcategory_id,
      p_new_subcategory_id: newSubCategoryId,
      p_new_frequency: draft.frequency,
    }
    try {
      const res = await axios.post("/update_staged_activity", payload);
      if (res.data?.issuccessful) {
        setIsEditing(false);
        toast.success("Changes saved successfully.");
      } else {
        toast.error(res.data?.message || "Error saving changes.");
      }
    } catch (error) {
      toast.error("Error saving changes.");
    }
  };

  const handleCancel = () => {
    setDraft(row);
    setIsEditing(false);
  };

  return (
    <tr
      className={cn(
        "group transition-colors duration-200 hover:bg-gray-50/80 border-b border-gray-100 last:border-0",
        isEditing
          ? "bg-emerald-50/40 shadow-sm relative z-10"
          : "bg-white/40"
      )}
    >
      {mode === "edit" && (
        <TableCell className="px-2 text-center w-[50px]">
          <div className="flex justify-center items-center">
            <Checkbox
              checked={selectedRowIds.includes(row.id)}
              onCheckedChange={checked => {
                if (checked) setSelectedRowIds(prev => [...prev, row.id]);
                else setSelectedRowIds(prev => prev.filter(id => id !== row.id));
              }}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
          </div>
        </TableCell>
      )}

      <TableCell className="px-2 text-center w-[50px]">
        <div className="flex justify-center items-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setSelectedRow(row);
              setInfoDrawerOpen(true);
            }}
            className="rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors duration-200"
          >
            <Info size={18} strokeWidth={2} />
          </Button>
        </div>
      </TableCell>

      {/* Activity */}
      <TableCell className="px-2 text-gray-700 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[120px]">
            <DropdownField
              value={draft.activity}
              options={activities}
              onChange={async val => {
                resetBelow("activity");
                setDraft(prev => ({ ...prev, activity: val }));
                await loadSelection1(draft.main_category_id, draft.sub_category, val);
              }}
            />
          </div>
        ) : (
          <span className="font-medium">{row.activity || "-"}</span>
        )}
      </TableCell>

      {/* Selection 1 */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[120px]">
            <DropdownField
              value={draft.selection_1}
              options={selection1Options}
              onChange={async val => {
                resetBelow("selection_1");
                setDraft(prev => ({ ...prev, selection_1: val }));
                await loadSelection2(draft.main_category_id, draft.sub_category, draft.activity, val);
              }}
            />
          </div>
        ) : (
          row.selection_1 || <span className="text-gray-300 italic">-</span>
        )}
      </TableCell>

      {/* Selection 2 */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[120px]">
            <DropdownField
              value={draft.selection_2}
              options={selection2Options}
              onChange={async val => {
                resetBelow("selection_2");
                setDraft(prev => ({ ...prev, selection_2: val }));
                await loadEF(draft.source, scope, draft.main_category_id, draft.sub_category, draft.activity, draft.selection_1, val);
              }}
            />
          </div>
        ) : (
          row.selection_2 || <span className="text-gray-300 italic">-</span>
        )}
      </TableCell>

      {/* Frequency */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[100px]">
            <DropdownField
              value={draft.frequency}
              options={frequencyOptions}
              onChange={val => setDraft(prev => ({ ...prev, frequency: val }))}
            />
          </div>
        ) : (
          row.frequency || "-"
        )}
      </TableCell>

      {/* Unit */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[80px]">
            <DropdownField
              value={draft.unit}
              options={unitOptions}
              onChange={val => setDraft(prev => ({ ...prev, unit: val }))}
            />
          </div>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {row.unit || "-"}
          </span>
        )}
      </TableCell>

      {/* Main Category */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[140px]">
            <DropdownField
              value={draft.main_category_id ?? ""}
              options={mainCategories}
              onChange={async val => {
                resetBelow("main_category");
                const mainId = val ? Number(val) : null;
                const selectedOption = mainCategories.find((opt) => opt.value.toString() === val);
                setDraft(prev => ({
                  ...prev,
                  main_category_id: mainId,
                  main_category_label: selectedOption?.label || "",
                  main_category: selectedOption?.label || "",
                }));
                await loadSubCategories(mainId);
              }}
            />
          </div>
        ) : (
          row.main_category || "-"
        )}
      </TableCell>

      {/* Sub Category */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[140px]">
            <DropdownField
              value={draft.sub_category}
              options={subCategories}
              onChange={async val => {
                resetBelow("sub_category");
                setDraft(prev => ({ ...prev, sub_category: val }));
                await loadActivities(draft.main_category_id, val);
              }}
            />
          </div>
        ) : (
          row.sub_category || "-"
        )}
      </TableCell>

      {/* Emission Factor */}
      <TableCell className="py-3 px-2 text-right align-middle">
        <span className="text-emerald-600 font-bold font-mono bg-emerald-50 px-2 py-1 rounded-md">
          {draft.ef || "-"}
        </span>
      </TableCell>

      {/* EF Source */}
      <TableCell className="py-3 px-2 text-gray-600 text-sm align-middle">
        {isEditing ? (
          <div className="min-w-[120px]">
            <DropdownField
              value={draft.source}
              options={[
                { label: "GHG Protocol", value: "GHG Protocol" },
                { label: "DEFRA", value: "DEFRA" },
              ]}
              onChange={async val => {
                resetBelow("source");
                setDraft(prev => ({ ...prev, source: val }));
                await loadMainCategories(val);
              }}
            />
          </div>
        ) : (
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {row.source || "-"}
          </span>
        )}
      </TableCell>

      {/* Actions */}
      {mode === "edit" && (
        <>
          <TableCell className="py-3 px-2 align-middle">
            <div className="flex items-center justify-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="icon"
                    onClick={handleSave}
                    disabled={isLoading || !newSubCategoryId}
                    className="flex size-7 items-center justify-center"
                  >
                    <Save className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex size-7 items-center justify-center"
                  >
                    <X className="size-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleInitializeEdit}
                    size="icon"
                    variant="outline"
                    disabled={isLoading}
                    className="flex size-7 border border-accent text-xs items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Pencil className="size-3.5" />}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedRow(row);
                      setDeleteModalOpen(true);
                    }}
                    size="icon"
                    variant="destructive"
                    className="flex size-7 items-center justify-center"
                  >
                    <Trash2 className="" />
                  </Button>
                </>
              )}
            </div>
          </TableCell>
          <TableCell className="py-3 px-2 align-middle" />
        </>
      )}
    </tr>
  );
};

export default EditableRow;