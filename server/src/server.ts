import { connectDB } from "./core/config/db";
import { initAuth } from "./core/auth/auth";
import { createApp } from "./app";
import { env } from "./core/config/env";

async function bootstrap() {
  // ধাপ ১: MongoDB কানেক্ট করতে হবে সবার আগে
  await connectDB();

  // ধাপ ২: তারপর Better Auth init (এটার mongodbAdapter কে কানেক্টেড client লাগে)
  initAuth();

  // ধাপ ৩: এখন Express app তৈরি ও চালু করা যাবে
  const app = createApp();

  app.listen(Number(env.PORT), () => {
    console.log(`🚀 Server running at ${env.BETTER_AUTH_URL}`);
    console.log(`🔐 Auth endpoints:   ${env.BETTER_AUTH_URL}/api/auth`);
    console.log(`❤️  Health check:    ${env.BETTER_AUTH_URL}/api/health`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
