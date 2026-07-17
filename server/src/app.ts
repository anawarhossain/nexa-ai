import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./core/auth/auth";
import { env } from "./core/config/env";
import { errorHandler, notFoundHandler } from "./core/middleware/errorHandler";

export function createApp(): Application {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true, // cookie-based session এর জন্য দরকার
    })
  );

  // ⚠️ Better Auth handler অবশ্যই express.json() এর আগে মাউন্ট করতে হবে,
  // নাহলে auth এর নিজস্ব body parsing ভেঙে যাবে।
  // Express v5 এ wildcard route সিনট্যাক্স বদলেছে: "*" এর বদলে "{*any}"
  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Nexa AI server is running." });
  });

  // 👉 Phase 4+ এ এখানে module routes যোগ হবে:
  // app.use("/api/items", itemsRouter);
  // app.use("/api/content-generator", contentGeneratorRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
