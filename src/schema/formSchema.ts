import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(4, "Password must be at least 4 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginFormFields = [
    { name: "email", placeholder: "Email ID", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
] as const;

/* ---------- Forgot Password ---------- */
export const ForgotFormFields = [
    { name: "email", placeholder: "Registered Email ID", type: "email" },
] as const;

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Enter a valid registered email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/* ---------- New Password ---------- */
export const NewPasswordFormFields = [
    { name: "password", placeholder: "Create new password", type: "password" },
    { name: "confirmPassword", placeholder: "Confirm new password", type: "password" },
] as const;

export const newPasswordSchema = z
    .object({
        password: z.string().trim().min(4, "Password must be at least 4 characters"),
        confirmPassword: z.string().trim(),
    })
    .refine((v) => v.password === v.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type NewPasswordValues = z.infer<typeof newPasswordSchema>;

// ---------------- Facility Schema ----------------
export const facilitySchema = z.object({
    name: z.string().min(1, "Facility name is required"),
    id: z.string().min(1, "Facility ID is required"),
});

export const FacilityLoginFormFields = [
    { name: "name", placeholder: "Facility Name", type: "text" },
    { name: "id", placeholder: "Facility ID", type: "text" },
] as const;

export type FacilityFormValues = z.infer<typeof facilitySchema>;

// ---------------- Change Password ----------------
export const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(6, "Old password is required"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;