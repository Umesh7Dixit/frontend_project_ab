"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useSearchParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  NewPasswordFormFields,
  newPasswordSchema,
  NewPasswordValues,
} from "@/schema/formSchema";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleHoverTap,
} from "@/lib/animations";

export default function NewPasswordForm({
  onSwitch,
}: {
  onSwitch: (v: "login" | "forgot" | "newpass") => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    criteriaMode: "firstError",
  });

  // Guard: token is required
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired link. Please request a new reset email.");
      onSwitch("login");
      router.replace("/login"); // clean URL
    }
  }, [token, onSwitch, router]);

  const onSubmit = () => {
    if (!token) return; // extra safety
    // send { token, ...values } to API later
    toast.success("Password reset successful", {
      description: "You can now log in with your new password.",
    });
    onSwitch("login");
    router.replace("/login");
  };

  const onError = (errs: Record<string, any>) => {
    const first = Object.values(errs)[0];
    toast.error(first?.message as string);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg md:p-8"
    >
      <motion.div
        variants={fadeInUp}
        className="mb-1 flex items-center justify-center gap-2"
      >
        <Image
          src="/icons/main.png"
          alt="CarbonScan.ai"
          width={35}
          height={35}
          className="rounded-md"
        />
        <span className="font-montserrat text-xl font-semibold tracking-wide">
          CarbonScan.ai
        </span>
      </motion.div>

      <motion.p
        variants={fadeIn}
        className="mb-8 text-center text-sm text-[#f3f4f6]"
      >
        Create a strong password and confirm it to reset your account.
      </motion.p>

      <motion.form
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-5"
        noValidate
      >
        {NewPasswordFormFields.map((field) => (
          <motion.div
            key={field.name}
            variants={fadeInUp}
            className="space-y-2"
          >
            <Label htmlFor={field.name} className="text-[#f3f4f6]">
              {field.placeholder}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete="new-password"
              {...register(field.name as keyof NewPasswordValues)}
              className="border-[#e5e7eb] bg-white/10 text-white placeholder-[#c7cbd1] backdrop-blur-md focus-visible:border-[#51b575] focus-visible:ring-[#2b5f5d]"
            />
          </motion.div>
        ))}

        <motion.div
          variants={scaleHoverTap}
          initial="visible"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            type="submit"
            disabled={isSubmitting || !token}
            className="mt-2 w-full rounded-xl bg-[#51b575] text-white shadow-lg shadow-black/10 hover:opacity-95 focus-visible:ring-[#2b5f5d] disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : "Reset password"}
          </Button>
        </motion.div>

        <button
          type="button"
          onClick={() => {
            onSwitch("login");
            router.replace("/login");
          }}
          className="mx-auto block text-sm text-[#b6e0d0] underline-offset-4 hover:underline"
        >
          Back to login
        </button>
      </motion.form>
    </motion.div>
  );
}
