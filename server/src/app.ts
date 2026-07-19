import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./core/auth/auth";
import { env } from "./core/config/env";
import { errorHandler, notFoundHandler } from "./core/middleware/errorHandler";
import { sanitizeBody } from "./core/middleware/validation";
import itemsRouter from "./modules/items/items.routes";
import contentGeneratorRouter from "./modules/content-generator/content-generator.routes";

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

  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(sanitizeBody); // global XSS sanitizer

  // app.get("/api/health", (req, res) => {
  //   res.json({ success: true, message: "Nexa AI server is running." });
  // });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", time: new Date().toISOString() });
  });

  // Module routes
  app.use("/api/items", itemsRouter);
  app.use("/api/content-generator", contentGeneratorRouter);


  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

