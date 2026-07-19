import { createAuthClient } from "better-auth/react";

/**
 * baseURL খালি রাখা হয়েছে কারণ Next.js rewrites /api/* কে
 * server এ proxy করে। ফলে browser same-origin request দেখে
 * এবং cookie ঠিকমতো কাজ করে (InPrivate/incognito windows সহ)।
 * Dev এ .env.local এ NEXT_PUBLIC_API_URL সেট করা থাকলে সেটা
 * সরাসরি server‑এ request যাবে (CORS‑এর মাধ্যমে)।
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

export const authClient = createAuthClient({
  baseURL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
