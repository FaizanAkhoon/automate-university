/**
 * AUTHENTICATION UTILITIES
 * 
 * This file sets up the correct paths and hooks for Better Auth + MongoDB.
 * Currently, these are mocked to allow frontend development to continue.
 * 
 * WHEN READY TO IMPLEMENT BETTER AUTH:
 * 1. npm install @better-auth/react
 * 2. Uncomment the authClient code below
 * 3. Delete the mock functions.
 */

// --- FUTURE BETTER AUTH SETUP ---
/*
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:5001" // Your MongoDB Backend URL
})
*/

// --- MOCK FUNCTIONS (Replace these with authClient calls later) ---

export const checkSession = async () => {
  // FUTURE: const { data: session } = await authClient.useSession();
  // FUTURE: return session !== null;
  
  // Mock: Check local storage for a fake session
  return localStorage.getItem('mock_session') === 'true';
};

export const signInWithEmail = async (email, password) => {
  // FUTURE: 
  // const { data, error } = await authClient.signIn.email({
  //     email,
  //     password
  // });
  // if (error) throw new Error(error.message);
  // return data;

  // Mock: Just set a fake session
  console.log("Mock Sign In with Email:", email);
  localStorage.setItem('mock_session', 'true');
  return true;
};

export const signInWithGoogle = async () => {
  // FUTURE:
  // await authClient.signIn.social({
  //     provider: "google",
  //     callbackURL: "/dashboard" // where to redirect after google auth
  // });

  // Mock: Just set a fake session
  console.log("Mock Sign In with Google Redirect Triggered");
  alert("Redirecting to Google OAuth... (Better Auth Path Ready)");
  localStorage.setItem('mock_session', 'true');
  return true;
};

export const signOut = async () => {
  // FUTURE: await authClient.signOut();
  
  // Mock: Clear fake session
  localStorage.removeItem('mock_session');
  return true;
};
