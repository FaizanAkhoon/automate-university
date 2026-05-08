import { betterAuth } from "better-auth";
import { db } from "./db.js";

// All origins that are allowed to make Better Auth requests.
const TRUSTED_ORIGINS = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",

      "https://automate-university-fke8.vercel.app",
      "https://automate-university-h1co.vercel.app",
      "https://automate-university-1fuz.vercel.app",
      "https://automate-university.vercel.app",
      "https://automate-university-git-main-faizanakhoonsh-faizanbashir018.vercel.app",
    ];

export const auth = betterAuth({
  database: db,

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: TRUSTED_ORIGINS,
});