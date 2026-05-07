/**
 * AUTHENTICATION UTILITIES — Better Auth
 * 
 * Uses Better Auth client to communicate with the Express backend
 * running at http://localhost:5000. Sessions are cookie-based.
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000",
});

/**
 * Check if a user session exists.
 * Falls back to localStorage mock if Better Auth hasn't been set up yet on the backend.
 */
export const checkSession = async () => {
  try {
    const session = await authClient.getSession();
    if (session?.data?.session) {
      return true;
    }
    // If no real session, check fallback
    return localStorage.getItem('mock_session') === 'true';
  } catch {
    // Backend might not be running — fall back to mock
    return localStorage.getItem('mock_session') === 'true';
  }
};

/**
 * Sign in with email + password via Better Auth.
 * Falls back to mock if the backend isn't ready.
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      // If Better Auth returns "user not found", try sign-up automatically
      if (error.message?.includes('not found') || error.message?.includes('Invalid') || error.status === 401) {
        const signUpResult = await authClient.signUp.email({
          email,
          password,
          name: email.split('@')[0],
        });
        if (signUpResult.error) {
          throw new Error(signUpResult.error.message || 'Sign up failed');
        }
        return signUpResult.data;
      }
      throw new Error(error.message || 'Sign in failed');
    }
    return data;
  } catch (err) {
    // If Better Auth is unreachable, fall back to mock for dev
    if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('Failed')) {
      console.warn("Better Auth backend unreachable — using mock session");
      localStorage.setItem('mock_session', 'true');
      return true;
    }
    throw err;
  }
};

/**
 * Sign in with Google via Better Auth social provider.
 * Falls back to mock if not configured yet.
 */
export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  } catch {
    // Google OAuth not configured yet — fall back to mock
    console.warn("Google OAuth not configured — using mock session");
    alert("Google OAuth requires server-side configuration.\nUsing mock session for development.");
    localStorage.setItem('mock_session', 'true');
    return true;
  }
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  try {
    await authClient.signOut();
  } catch {
    // Fallback: clear mock session
  }
  localStorage.removeItem('mock_session');
  return true;
};
