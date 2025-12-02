"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Save } from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordValues,
} from "@/schema/formSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
}

const getPasswordStrength = (password: string) => {
  if (!password) return null;
  if (password.length < 6) return { label: "Weak", color: "bg-red-500" };
  if (password.length < 10) return { label: "Medium", color: "bg-yellow-500" };
  return { label: "Strong", color: "bg-green-600" };
};

const ChangePasswordModal: React.FC<Props> = ({
  open,
  onClose,
  userId = "EMP-12345",
  userName = "John Doe",
}) => {
  const [passwordStrength, setPasswordStrength] = useState<{
    label: string;
    color: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (values: ChangePasswordValues) => {
    console.log("Password updated:", values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-medium text-gray-800">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-xs text-gray-500">User</p>
          <p className="text-sm font-semibold text-gray-700">
            {userId} – {userName}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              type="password"
              id="oldPassword"
              placeholder="Enter old password"
              {...register("oldPassword")}
              className="rounded-lg"
            />
            {errors.oldPassword && (
              <p className="text-xs text-red-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              {...register("newPassword")}
              onChange={(e) =>
                setPasswordStrength(getPasswordStrength(e.target.value))
              }
              className="rounded-lg"
            />
            {passwordStrength && (
              <div className="flex items-center gap-2 mt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "80px" }}
                  className={`h-1.5 rounded ${passwordStrength.color}`}
                />
                <span className="text-xs text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="rounded-lg"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save />
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
