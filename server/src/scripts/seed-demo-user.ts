import { connectDB } from "../core/config/db";
import { initAuth } from "../core/auth/auth";

/**
 * ⚠️ client/lib/demo-credentials.ts এর সাথে এই ইমেইল/পাসওয়ার্ড হুবহু মিলতে হবে।
 * রান করতে: cd server && npm run seed:demo
 */
const DEMO_EMAIL = "demo@nexa-ai.example.com";
const DEMO_PASSWORD = "Demo@12345";
const DEMO_NAME = "Demo User";

async function seed() {
  await connectDB();
  const auth = initAuth();

  try {
    await auth.api.signUpEmail({
      body: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        name: DEMO_NAME,
      },
    });
    console.log(`✅ Demo user created: ${DEMO_EMAIL}`);
  } catch (error: any) {
    const message = String(error?.message || error);
    if (message.toLowerCase().includes("already") || message.toLowerCase().includes("exist")) {
      console.log(`ℹ️  Demo user already exists (${DEMO_EMAIL}) — skipping.`);
    } else {
      console.error("❌ Failed to seed demo user:", error);
    }
  }

  process.exit(0);
}

seed();
