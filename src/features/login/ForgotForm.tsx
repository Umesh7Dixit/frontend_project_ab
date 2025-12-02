"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  ForgotFormFields,
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/schema/formSchema";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleHoverTap,
} from "@/lib/animations";

export default function ForgotForm({
  onSwitch,
}: {
  onSwitch: (v: "login" | "forgot" | "newpass") => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    criteriaMode: "firstError",
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    toast.success("Reset link sent", {
      description: `Check your inbox: ${values.email}`,
      richColors: true,
      duration: 5000,
    });
    onSwitch("newpass"); //temporarily switching to new password form
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
        Forgot your password? Enter your registered email to receive a reset
        link.
      </motion.p>

      <motion.form
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-5"
        noValidate
      >
        {ForgotFormFields.map((field) => (
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
              autoComplete="email"
              inputMode="email"
              {...register(field.name)}
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
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-[#51b575] text-white shadow-lg shadow-black/10 hover:opacity-95 focus-visible:ring-[#2b5f5d] disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : "Send reset link"}
          </Button>
        </motion.div>

        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="mx-auto block text-sm text-[#b6e0d0] underline-offset-4 hover:underline"
        >
          Back to login
        </button>
      </motion.form>
    </motion.div>
  );
}
