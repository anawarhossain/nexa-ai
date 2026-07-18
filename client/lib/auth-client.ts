import { createAuthClient } from "better-auth/react";

/**
 * NEXT_PUBLIC_API_URL হলো server.ts যেখানে চলছে সেই origin
 * (যেমন dev এ http://localhost:5000)। createAuthClient নিজে থেকেই
 * প্রতিটা fetch এ credentials: "include" পাঠায়, তাই cross-origin
 * cookie ঠিকমতো সেট/পড়া হবে — যতক্ষণ server এর CORS এ credentials:true
 * আর trustedOrigins এ এই frontend এর URL থাকে (আমরা Phase 1 এ এটা করেছি)।
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
