import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoClient } from "../config/db";
import { env, isProd } from "../config/env";

/**
 * auth ইনস্ট্যান্স lazy-initialize করা হয়, কারণ mongodbAdapter এর জন্য
 * একটা কানেক্টেড MongoClient দরকার — যেটা connectDB() এর পরেই পাওয়া যাবে।
 * তাই server.ts এ connectDB() এর পরে initAuth() কল করা হবে।
 */
export let auth: ReturnType<typeof betterAuth>;

export function initAuth() {
  const client = getMongoClient();

  auth = betterAuth({
    database: mongodbAdapter(client.db(env.DATABASE_NAME) as any, {
      client: client as any,
    }),

    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,

    // Frontend origin — এটা না দিলে cross-origin cookie/CSRF ব্লক হবে
    trustedOrigins: [env.CLIENT_URL],

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 8,
    },

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    advanced: {
      defaultCookieAttributes: {
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      },
    },
  }) as any;

  console.log("✅ Better Auth initialized (email/password + Google)");
  return auth;
}
