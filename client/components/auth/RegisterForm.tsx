"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./GoogleButton";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterValues) {
    setServerError(null);
    setIsSubmitting(true);

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message ?? "Could not create your account. Please try again.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ash">Start deploying agents in a minute.</p>

      <div className="mt-6">
        <GoogleButton label="Sign up with Google" />
      </div>

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
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
            className={cn(
              "h-11 w-full rounded-xl border bg-paper px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.name ? "border-ember" : "border-line"
            )}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1.5 text-xs text-ember">{errors.name.message}</p>}
        </div>

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
          {errors.email && <p className="mt-1.5 text-xs text-ember">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className={cn(
              "h-11 w-full rounded-xl border bg-paper px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.password ? "border-ember" : "border-line"
            )}
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-ember">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={cn(
              "h-11 w-full rounded-xl border bg-paper px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40",
              errors.confirmPassword ? "border-ember" : "border-line"
            )}
            placeholder="Repeat your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-ember">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ash">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-signal hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
