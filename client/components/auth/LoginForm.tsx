"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { FiAlertCircle, FiZap } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { DEMO_CREDENTIALS } from "@/lib/demo-credentials";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./GoogleButton";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function doSignIn(values: LoginValues) {
    setServerError(null);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message ?? "Invalid email or password. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function onSubmit(values: LoginValues) {
    setIsSubmitting(true);
    await doSignIn(values);
    setIsSubmitting(false);
  }

  async function handleDemoLogin() {
    setIsDemoLoading(true);
    setValue("email", DEMO_CREDENTIALS.email);
    setValue("password", DEMO_CREDENTIALS.password);
    await doSignIn(DEMO_CREDENTIALS);
    setIsDemoLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-ash">Log in to continue to your agents.</p>

      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={isDemoLoading || isSubmitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-signal/50 bg-signal/5 px-4 py-2.5 text-sm font-medium text-signal transition-colors hover:bg-signal/10 disabled:opacity-50"
      >
        <FiZap className="h-4 w-4" />
        {isDemoLoading ? "Signing in..." : "Try the demo account"}
      </button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton label="Continue with Google" />

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
          or with email
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {serverError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ink">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={cn(
              "h-11 w-full rounded-xl border bg-paper px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.email ? "border-ember" : "border-line"
            )}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-ember">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={cn(
              "h-11 w-full rounded-xl border bg-paper px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.password ? "border-ember" : "border-line"
            )}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-ember">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ash">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-signal hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
