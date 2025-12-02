"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Controller, UseFormReturn } from "react-hook-form";
import { Field } from "@/schema/facility-fields";
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
import { UploadCloud, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  field: Field;
  form: UseFormReturn<any>;
  className?: string;
};

export default function FieldRenderer({ field, form, className = "" }: Props) {
  const { register, control, setValue, watch } = form;
  const watched = watch(field.name);
  // const fileName = watched && watched instanceof File ? watched.name : "";

  const baseColClass = field.cols === 2 ? "md:col-span-2" : "md:col-span-1";

  // Move hooks to top level to comply with Rules of Hooks
  const file =
    field.type === "file" && watched && watched instanceof File
      ? watched
      : undefined;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (field.type !== "file" || !file) {
      setPreviewUrl(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [field.type, file]);

  const label = (
    <Label className="text-xs font-medium text-slate-700 mb-1">
      {field.label}
    </Label>
  );

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
        />
        {field.helper && (
          <p className="mt-1 text-xs text-slate-400">{field.helper}</p>
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
              onValueChange={(v) => controllerField.onChange(v)}
              value={controllerField.value ?? ""}
            >
              <SelectTrigger>
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

  if (field.type === "file") {
    const fileSize = file ? `${(file.size / 1024).toFixed(1)} KB` : "";

    return (
      <div className={`${baseColClass} ${className}`}>
        {label}

        <div className="mt-1.5 flex flex-col bg-emerald-50 sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl border border-slate-200">
          <div className="relative shrink-0 size-12 rounded-lg overflow-hidden border border-emerald-200  flex items-center justify-center shadow-sm">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <FileText className="h-6 w-6 text-slate-500" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {file ? (
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900 truncate pr-2">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 font-medium">{fileSize}</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-700">
                  {field.placeholder ?? "Upload a file"}
                </p>
                {field.helper && (
                  <p className="text-xs text-slate-400">{field.helper}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <label
              htmlFor={field.name}
              className="flex-1 sm:flex-none cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium "
            >
              <UploadCloud className="size-4" />
              <span>{file ? "Replace" : "Select"}</span>
              <Input
                id={field.name}
                type="file"
                accept={field.accept}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setValue(field.name, f);
                  e.target.value = "";
                }}
              />
            </label>

            {file && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => setValue(field.name, undefined)}
                aria-label="Remove file"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // fallback
  return (
    <div className={`${baseColClass} ${className}`}>
      {label}
      <Input {...register(field.name)} placeholder={field.placeholder} />
    </div>
  );
}
