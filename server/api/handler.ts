import { connectDB } from "../src/core/config/db";
import { initAuth } from "../src/core/auth/auth";
import { createApp } from "../src/app";
import type { Request, Response, Application } from "express";

let app: Application | null = null;

async function ensureInitialized() {
  if (app) return;
  await connectDB();
  initAuth();
  app = createApp();
}

export default async function handler(req: Request, res: Response) {
  try {
    await ensureInitialized();
    app!(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
