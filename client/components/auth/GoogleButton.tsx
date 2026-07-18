"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    // সফল হলে Google এ রিডাইরেক্ট হয়ে যাবে, তাই setIsLoading(false) এখানে
    // দরকার নেই — শুধু ব্যর্থ হলে ইউজার ফিরে আসবে, তখন বাটন আবার সক্রিয় থাকবে।
    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2.5 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5 disabled:opacity-50"
    >
      <FcGoogle className="h-4 w-4" />
      {isLoading ? "Redirecting..." : label}
    </button>
  );
}
