import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./db.js";

// All origins that are allowed to make Better Auth requests.
// Better Auth's toNodeHandler handles its own CORS internally — it does NOT
// inherit Express cors() headers — so every legitimate origin MUST be listed here.
const TRUSTED_ORIGINS = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(s => s.trim())
  : [
      // ── local dev ──────────────────────────────────────────────────────────
      "http://localhost:5173",   // student-app (vite default)
      "http://localhost:3001",   // admin-app alt port
      "http://localhost:3002",   // admin-app alt port
      "http://localhost:3003",   // admin-app alt port
      // ── production / vercel ────────────────────────────────────────────────
      "https://automate-university-fke8.vercel.app",
      "https://automate-university.vercel.app",
      "https://automate-university-git-main-faizanakhoonsh-faizanbashir018.vercel.app",
    ];

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: TRUSTED_ORIGINS,
});
