import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./db.js";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: process.env.FRONTEND_URLS 
    ? process.env.FRONTEND_URLS.split(',') 
    : ["http://localhost:5173", "http://localhost:3002", "http://localhost:3001", "http://localhost:3003"],
});
