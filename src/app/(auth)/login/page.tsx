import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthPage from "@/features/login/Auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthPage />
    </Suspense>
  );
}
