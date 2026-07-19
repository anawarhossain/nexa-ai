import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: required("MONGO_URI"),

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  BETTER_AUTH_SECRET: required("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  DATABASE_NAME: process.env.DATABASE_NAME || "nexa-ai",
};

export const isProd = env.NODE_ENV === "production";
