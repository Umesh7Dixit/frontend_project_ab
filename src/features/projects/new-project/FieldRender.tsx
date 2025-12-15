"use client";

import React, { useEffect, useState } from "react";

import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Field } from "@/schema/new-project-fields";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, UserIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "@/lib/axios/axios";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Props = {
  field: Field;
  form: UseFormReturn<any>;
  className?: string;
};
type UserOption = { user_id: number; full_name: string; role_name: string };

export default function FieldRenderer({ field, form, className = "" }: Props) {
  const { register, control } = form;

  // layout: ensure default single column on mobile, 2-cols on md
  const baseColClass =
    field.type === "table"
      ? "col-span-1 md:col-span-2"
      : field.cols === 2
        ? "col-span-1 md:col-span-2"
        : "col-span-1 md:col-span-1";


  // Label
  const label = (
    <Label className="text-xs font-medium text-slate-700 mb-1 block">
      {field.label}
    </Label>
  );

  // Ensure inputs and triggers expand to available width
  const inputProps = { className: "w-full" };

  if (
    field.type === "input" ||
    field.type === "email" ||
    field.type === "phone"
  ) {
    return (
      <div className={`${baseColClass} ${className}`}>
        {label}
        <Input
          {...register(field.name)}
          placeholder={field.placeholder}
          type={field.type === "email" ? "email" : "text"}
          readOnly={field.readOnly}
          disabled={field.readOnly}
          {...inputProps}
        />
        {field.helper && (
          <p className="mt-1 text-xs text-slate-400">{field.helper}</p>
        )}
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className={`${baseColClass} ${className}`}>
        {label}
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!controllerField.value && "text-muted-foreground"
                    }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {controllerField.value
                    ? format(new Date(controllerField.value), "PPP")
                    : field.placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    controllerField.value
                      ? new Date(controllerField.value)
                      : undefined
                  }
                  onSelect={(date) =>
                    controllerField.onChange(date?.toISOString() ?? "")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {field.helper && (
          <p className="mt-1 text-xs text-slate-400">{field.helper}</p>
        )}
      </div>
    );
  }

  if (field.type === "table") {
    const rows = form.watch(field.name);

    // Initialize rows once on mount
    useEffect(() => {
      if (!rows || rows.length === 0) {
        const initial = (field.rows || []).map((label) =>
          typeof label === "string" ? { scope: label } : label
        );
        form.setValue(field.name, initial, { shouldDirty: false });
      }
    }, []);

    // Prevent first render from showing blank table
    if (!rows || rows.length === 0) return null;

    // return (
    //   <div className={`${baseColClass} ${className}`}>
    //     <p className="font-medium">{label}</p>

    //     <Table className="mt-2 border rounded-md w-full table-fixed">
    //       <TableHeader>
    //         <TableRow>
    //           {field.columns.map((col) => (
    //             <TableHead
    //               key={col.key}
    //               className={col.key === "scope" ? "w-36 whitespace-nowrap" : "w-52 text-sm text-center whitespace-nowrap"}
    //             >
    //               {col.label}
    //             </TableHead>
    //           ))}
    //         </TableRow>
    //       </TableHeader>

    //       <TableBody>
    //         {rows.map((row: any, rowIndex: number) => (
    //           <TableRow key={rowIndex} className="even:bg-muted/40">
    //             {field.columns.map((col) => (
    //               <TableCell key={col.key} className="p-1 text-center">
    //                 {col.inputType === "readonly" ? (
    //                   <span className="font-medium">{row[col.key]}</span>
    //                 ) : col.inputType === "number" ? (
    //                   <Input
    //                     type="number"
    //                     inputMode="decimal"
    //                     className="h-8 text-center w-full text-sm"
    //                     placeholder={col.label}
    //                     value={row[col.key] ?? ""}
    //                     onChange={(e) =>
    //                       form.setValue(`${field.name}[${rowIndex}].${col.key}`, e.target.value)
    //                     }
    //                   />
    //                 ) : (
    //                   <Input
    //                     type="text"
    //                     className="h-8 text-center w-full text-sm"
    //                     placeholder={col.label}
    //                     value={row[col.key] ?? ""}
    //                     onChange={(e) =>
    //                       form.setValue(`${field.name}[${rowIndex}].${col.key}`, e.target.value)
    //                     }
    //                   />
    //                 )}
    //               </TableCell>
    //             ))}
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>
    // );

    
  return (
      <div className={`${baseColClass} ${className}`}>
        <p className="font-medium">{label}</p>

        <Table className="mt-2 border rounded-md w-full table-fixed">
          <TableHeader>
            <TableRow>
              {field.columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.key === "scope" ? "w-36 whitespace-nowrap" : "w-52 text-sm text-center whitespace-nowrap"}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row: any, rowIndex: number) => (
              <TableRow key={rowIndex} className="even:bg-muted/40">
                {field.columns.map((col) => (
                  <TableCell key={col.key} className="p-1 text-center">
                    {col.inputType === "readonly" ? (
                      <span className="font-medium">{row[col.key]}</span>
                    ) : col.inputType === "select" ? (
                      // NEW: Handle select dropdowns
                      <Select
                        value={row[col.key] ?? ""}
                        onValueChange={(value) =>
                          form.setValue(`${field.name}[${rowIndex}].${col.key}`, value)
                        }
                      >
                        <SelectTrigger className="h-8 w-full text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {col.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : col.inputType === "number" ? (
                      <Input
                        type="number"
                        inputMode="decimal"
                        className="h-8 text-center w-full text-sm"
                        placeholder={col.label}
                        value={row[col.key] ?? ""}
                        onChange={(e) =>
                          form.setValue(`${field.name}[${rowIndex}].${col.key}`, e.target.value)
                        }
                      />
                    ) : (
                      <Input
                        type="text"
                        className="h-8 text-center w-full text-sm"
                        placeholder={col.label}
                        value={row[col.key] ?? ""}
                        onChange={(e) =>
                          form.setValue(`${field.name}[${rowIndex}].${col.key}`, e.target.value)
                        }
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }


  if (field.type === "userSearch") {
    return (
      <div className="">
        {label}
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => {
            const [search, setSearch] = useState("");
            const [users, setUsers] = useState<UserOption[]>([]);
            const [filtered, setFiltered] = useState<UserOption[]>([]);
            const [selected, setSelected] = useState<UserOption[]>(
              controllerField.value ? JSON.parse(controllerField.value) : []
            );
            const [isFocused, setIsFocused] = useState(false);

            useEffect(() => {
              const fetchUsers = async () => {
                try {
                  const { data } = await axios.post("/get_assignable_users_for_org", { org_id: 11 });
                  if (data.issuccessful && data.data?.facility) {
                    setUsers(data.data.facility);
                  }
                } catch (err) {
                  console.error(err);
                }
              };
              fetchUsers();
            }, []);

            useEffect(() => {
              if (!search.trim()) {
                setFiltered([]);
                return;
              }
              const query = search.toLowerCase();
              setFiltered(
                users.filter(
                  (u) =>
                    u.full_name.toLowerCase().includes(query) &&
                    !selected.some((s) => s.user_id === u.user_id)
                )
              );
            }, [search, users, selected]);

            const addUser = (user: UserOption) => {
              const updated = [...selected, user];
              setSelected(updated);
              controllerField.onChange(JSON.stringify(updated));
              setSearch("");
              setFiltered([]);
            };

            const removeUser = (id: number) => {
              const updated = selected.filter((u) => u.user_id !== id);
              setSelected(updated);
              controllerField.onChange(JSON.stringify(updated));
            };

            return (
              <div className="space-y-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    // onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={field.placeholder || "Search users..."}
                    className="pl-9 bg-background"
                  />

                  {isFocused && search && (
                    <div className="absolute top-full mt-1 z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
                      <div className="max-h-[200px] overflow-y-auto p-1">
                        {filtered.length > 0 ? (
                          filtered.map((user) => (
                            <div
                              key={user.user_id}
                              onClick={() => addUser(user)}
                              className="flex items-center justify-between px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                                  <UserIcon className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <span className="font-medium">{user.full_name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                                {user.role_name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            No users found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selected.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.map((user) => (
                      <Badge
                        key={user.user_id}
                        variant="secondary"
                        className="pl-2 rounded-full pr-1 py-1 h-8 text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                      >
                        <span className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                            <UserIcon className="h-2.5 w-2.5 text-white" />
                          </div>
                          {user.full_name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeUser(user.user_id)}
                          className="ml-1 rounded-full hover:bg-destructive/10 hover:text-destructive p-0.5 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {field.helper && (
                  <p className="text-[0.8rem] text-muted-foreground">{field.helper}</p>
                )}
              </div>
            );
          }}
        />
      </div>
    );
  }

  if (field.type === "diagram") {
    const [mode, setMode] = useState<"upload" | "text">("text");

    return (
      <div className={`${baseColClass} ${className}`}>
        {label}

        <div className="flex gap-3 mb-2">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-1 rounded text-xs border ${mode === "upload" ? "bg-secondary" : "bg-muted"
              }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`px-3 py-1 rounded text-xs border ${mode === "text" ? "bg-secondary" : "bg-muted"
              }`}
          >
            Describe in text
          </button>
        </div>

        {mode === "upload" && (
          <Input
            type="file"
            accept="image/*,application/pdf"
            className="w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) form.setValue(field.name, file); // or file URL later
            }}
          />
        )}

        {mode === "text" && (
          <Textarea
            {...form.register(field.name)}
            placeholder={field.placeholder}
            rows={4}
          />
        )}

        {field.helper && (
          <p className="mt-1 text-xs text-muted-foreground">{field.helper}</p>
        )}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={`${baseColClass} ${className}`}>
        {label}
        <Textarea
          {...register(field.name)}
          placeholder={field.placeholder}
          rows={4}
          {...inputProps}
        />
        {field.helper && (
          <p className="mt-1 text-xs text-slate-400">{field.helper}</p>
        )}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={`${baseColClass} ${className}`}>
        {label}
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => (
            <Select
              onValueChange={(selectedValue) => {
                if (field.name === "industry") {
                  const selectedOption = field.options?.find(
                    (opt) => opt.value === selectedValue
                  );
                  controllerField.onChange(
                    selectedOption ? selectedOption.label : selectedValue
                  );
                } else {
                  controllerField.onChange(selectedValue);
                }
              }}
              value={
                field.name === "industry"
                  ? field.options?.find(
                    (opt) => opt.label === controllerField.value
                  )?.value ?? ""
                  : controllerField.value ?? ""
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={field.placeholder ?? field.label} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {field.helper && (
          <p className="mt-1 text-xs text-slate-400">{field.helper}</p>
        )}
      </div>
    );
  }

  if (field.type === "reportingPeriodFrom" || field.type === "reportingPeriodTo") {
    return (
      <div className={`${baseColClass} ${className}`}>
        {label}
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => {
            const [open, setOpen] = useState(false);
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const [month, setMonth] = useState<number>(currentMonth);
            const [year, setYear] = useState<number>(currentYear);

            useEffect(() => {
              if (open) {
                const dateToUse = controllerField.value
                  ? new Date(controllerField.value)
                  : new Date();
                setMonth(dateToUse.getMonth());
                setYear(dateToUse.getFullYear());
              }
            }, [open, controllerField.value]);

            const months = Array.from({ length: 12 }, (_, i) => ({
              value: i,
              label: new Date(0, i).toLocaleString("default", { month: "long" }),
            }));

            const handleChange = (newMonth: number, newYear: number) => {
              const newDate = new Date(newYear, newMonth, 1, 12, 0, 0, 0);
              controllerField.onChange(newDate.toISOString());
            };

            return (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !controllerField.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {controllerField.value
                      ? `${new Date(controllerField.value).toLocaleString("default", {
                        month: "long",
                      })} ${new Date(controllerField.value).getFullYear()}`
                      : field.placeholder || "Select date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-4" align="start">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={String(month)}
                        onValueChange={(val) => {
                          const newMonth = Number(val);
                          setMonth(newMonth);
                          handleChange(newMonth, year);
                        }}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => {
                            const isFuture = year === currentYear && m.value > currentMonth;
                            return (
                              <SelectItem
                                key={m.value}
                                value={String(m.value)}
                                disabled={isFuture}
                              >
                                {m.label}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        value={year}
                        max={currentYear}
                        onChange={(e) => {
                          let newYear = Number(e.target.value);
                          if (newYear > currentYear) newYear = currentYear;
                          setYear(newYear);
                          if (newYear > 1900) {
                            let newMonth = month;
                            if (newYear === currentYear && month > currentMonth) {
                              newMonth = currentMonth;
                              setMonth(newMonth);
                            }
                            handleChange(newMonth, newYear);
                          }
                        }}
                        className="w-[100px]"
                        placeholder="Year"
                      />
                    </div>

                    {!controllerField.value && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs"
                        onClick={() => {
                          handleChange(month, year);
                          setOpen(false);
                        }}
                      >
                        Confirm {months[month].label} {year}
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }}
        />
        {field.helper && (
          <p className="mt-1 text-xs text-slate-400">{field.helper}</p>
        )}
      </div>
    );
  }


  // fallback
  return (
    <div className={`${baseColClass} ${className}`}>
      {label}
      <Input
        {...register(field.name)}
        placeholder={field.placeholder}
        className="w-full"
      />
    </div>
  );
}
