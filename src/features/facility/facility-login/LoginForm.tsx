"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, Search, Building2, Hash } from "lucide-react"; // Icons for better UI

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginOrgClient } from "@/lib/auth/client";
import { FacilityFormValues } from "@/schema/formSchema";
import { facilityApi, FacilityItem } from "@/lib/api/facility";
import { COOKIE_USER_INFO } from "@/lib/constants";

export default function FacilityLoginForm() {
  const router = useRouter();

  const [suggestions, setSuggestions] = useState<FacilityItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FacilityFormValues>({
    mode: "onSubmit",
  });

  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (!value || value.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      const token = Cookies.get(COOKIE_USER_INFO);
      if (!token) return;

      try {
        const response = await facilityApi.getAccessibleFacilities(value, token);
        if (response.issuccessful) {
          setSuggestions(response.data.facilities || []);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsLoading(false);
      }
    }, 400),
    []
  );

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("id", "");
    if (value.length > 1) setIsLoading(true);
    fetchSuggestions(value);
  };

  const handleSelectFacility = (item: FacilityItem) => {
    setValue("name", item.facility_name);
    setValue("id", String(item.facility_id));
    setSuggestions([]);
    setShowSuggestions(false);
    fetchSuggestions.cancel();
    setIsLoading(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const onSubmit = async (values: FacilityFormValues) => {
    try {
      const token = Cookies.get(COOKIE_USER_INFO);
      if (!token) {
        toast.error("Authentication required", { description: "Please login first." });
        router.replace("/login");
        return;
      }
      const searchValue = values.id || values.name;
      if (!searchValue) {
        toast.error("Please enter a Facility Name or ID");
        return;
      }
      const response = await facilityApi.getAccessibleFacilities(searchValue, token);
      if (response.issuccessful) {
        const facilities: FacilityItem[] = response.data.facilities;
        const targetFacility = facilities.find(f =>
          String(f.facility_id) === values.id ||
          f.facility_name.toLowerCase() === values.name.toLowerCase()
        ) || facilities[0];

        if (!targetFacility) {
          toast.error("No facility found with the provided credentials");
          return;
        }
        localStorage.setItem("facility_id", targetFacility.facility_id.toString());
        loginOrgClient({
          facility_name: targetFacility.facility_name,
          facility_id: targetFacility.facility_id,
          organization_name: targetFacility.org_name
        });
        toast.success("Login successful", {
          description: `Welcome to ${targetFacility.facility_name}`,
        });
        router.replace("/create-project");
      } else {
        const errorMsg = (response.data as any)?.error || response.message || "Login failed";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Facility login error:", err);
      toast.error("Network error", { description: "Please check your connection." });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="mb-1 text-center font-montserrat text-lg md:text-xl font-semibold text-[#0b1f1d]">
        Carbon Accounting
      </h2>
      <p className="mb-10 text-center text-xs md:text-sm text-[#4b5563]">
        Enter your facility credentials to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        <div className="space-y-2 relative" ref={wrapperRef}>
          <Label htmlFor="name" className="text-[#0b1f1d] flex items-center gap-2">
            Facility Name
          </Label>

          <div className="relative">
            <Input
              id="name"
              type="text"
              autoComplete="off"
              placeholder="Enter facility name"
              {...register("name", {
                onChange: onNameChange
              })}
              onBlur={handleBlur}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="border-[#e5e7eb] pl-10 bg-white/50 text-[#0b1f1d] placeholder-[#6b7280] focus-visible:border-[#51b575] focus-visible:ring-[#2b5f5d] text-sm md:text-medium"
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#51b575]" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
              <ul className="py-1">
                {suggestions.map((item) => (
                  <li
                    key={item.facility_id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => handleSelectFacility(item)}
                    className="px-4 py-2.5 cursor-pointer hover:bg-[#f0fdf4] text-sm text-gray-700 hover:text-[#166534] transition-colors border-b last:border-0 border-gray-50 flex flex-col"
                  >
                    <span className="font-medium">{item.facility_name}</span>
                    <span className="text-xs text-gray-400">ID: {item.facility_id} • {item.org_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="id" className="text-[#0b1f1d] flex items-center gap-2">
            Facility ID
          </Label>

          <Input
            id="id"
            type="text"
            placeholder="Auto-filled"
            {...register("id")}
            disabled
            className="border-[#e5e7eb] bg-white/30 text-[#0b1f1d] placeholder-[#6b7280] focus-visible:border-[#51b575] focus-visible:ring-[#2b5f5d] text-sm md:text-medium"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full rounded-xl bg-[#51b575] text-white shadow-lg shadow-green-900/10 hover:bg-[#439b63] disabled:opacity-70 transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </span>
          ) : "Submit"}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs md:text-sm">
        <span className="text-[#4b5563]">Don’t have a facility ID?</span>
        <br />
        <button
          type="button"
          onClick={() => router.push("/facility/register")}
          className="text-[#2b5f5d] underline-offset-4 hover:underline cursor-pointer font-medium underline mt-1"
        >
          Create a new facility
        </button>
      </div>
    </div>
  );
}