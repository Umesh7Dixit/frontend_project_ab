"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import {
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ChevronLeft
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const forgotPasswordSchema = z.object(
    {
        email: z.string().email("Invalid email address"),
        otp: z.string().min(6, "OTP must be 6 digits"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    }
).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
}

const getPasswordStrength = (password: string) => {
    if (!password) return null;
    if (password.length < 6) return { label: "Weak", color: "bg-red-500", width: "30%" };
    if (password.length < 10) return { label: "Medium", color: "bg-yellow-500", width: "60%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
};

export default function ForgotPasswordModal({ open, onClose }: Props) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const [passwordStrength, setPasswordStrength] = useState<{
        label: string;
        color: string;
        width: string;
    } | null>(null);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        control,
        getValues,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
    });

    const emailValue = watch("email");

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    const handleSendOTP = async () => {
        const isValid = await trigger("email");
        if (!isValid) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            setResendTimer(30);
        }, 1500);

    };

    const handleVerifyOTP = async () => {
        const isValid = await trigger("otp");
        if (!isValid) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1500);

    };

    const onSubmit = async (data: ForgotPasswordValues) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onClose();
            setStep(1);
        }, 2000);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md backdrop-blur-md rounded-xl shadow-lg p-6 overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button
                                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-2"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify Identity"}
                            {step === 3 && "Reset Password"}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
                    <AnimatePresence mode="wait" custom={step}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-6"
                            >

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            placeholder="name@company.com"
                                            {...register("email")}
                                            className="pl-10 rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <span className="flex items-center gap-2">
                                            Send Code <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={2}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-6"
                            >
                                <div className="text-sm text-gray-500">
                                    We've sent a 6-digit code to <span className="font-semibold text-emerald-600">{emailValue}</span>.
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-gray-700">Verification Code</Label>

                                    <div className="flex justify-center py-2">
                                        <Controller
                                            control={control}
                                            name="otp"
                                            render={({ field }) => (
                                                <InputOTP
                                                    maxLength={6}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            )}
                                        />
                                    </div>

                                    {errors.otp && (
                                        <p className="text-xs text-center text-red-500 mt-1">{errors.otp.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleVerifyOTP}
                                    disabled={loading}
                                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                                </Button>

                                <p className="text-xs text-center text-gray-500">
                                    Didn't receive the code?{" "}
                                    {resendTimer > 0 ? (
                                        <span className="text-gray-400 font-medium cursor-not-allowed">
                                            Resend in {resendTimer}s
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            className="text-emerald-600 font-medium hover:underline"
                                        >
                                            Resend
                                        </button>
                                    )}
                                </p>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={3}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="space-y-5"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                id="newPassword"
                                                placeholder="Min. 8 characters"
                                                {...register("newPassword")}
                                                onChange={(e) => {
                                                    register("newPassword").onChange(e);
                                                    setPasswordStrength(getPasswordStrength(e.target.value));
                                                }}
                                                className="pl-10 rounded-lg"
                                            />
                                        </div>
                                        {passwordStrength && (
                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: passwordStrength.width }}
                                                        className={`h-full ${passwordStrength.color}`}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-right text-gray-500">{passwordStrength.label}</span>
                                            </div>
                                        )}
                                        {errors.newPassword && (
                                            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                id="confirmPassword"
                                                placeholder="Re-enter password"
                                                {...register("confirmPassword")}
                                                className="pl-10 rounded-lg"
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 mt-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </DialogContent>
        </Dialog>

    );
}