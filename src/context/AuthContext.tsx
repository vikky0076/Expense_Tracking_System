"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { auth, db, googleProvider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signUpWithEmail: (username: string, email: string, pass: string) => Promise<void>;
  signInWithUsernameOrEmail: (identifier: string, pass: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLinkCallback: (email: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  uid: "demo-user-123",
  username: "rahul_demo",
  email: "demo.user@fintrack.app",
  displayName: "Rahul (Demo)",
  photoURL: null,
  emailVerified: true,
  isDemo: true,
  createdAt: "2026-08-01",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  // Check for redirect result from Google Auth on mobile mount
  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.warn("Google Redirect Result warning:", err);
    });
  }, []);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: User | null) => {
      if (fbUser) {
        let username = fbUser.displayName || fbUser.email?.split("@")[0] || "user";
        try {
          // Fetch existing user profile from Firestore or initialize cleanly
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            username = userDocSnap.data().username || username;
          } else {
            // First time Google / Auth user - create document cleanly with merge
            await setDoc(
              userDocRef,
              {
                uid: fbUser.uid,
                email: fbUser.email || "",
                username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        } catch (e) {
          console.warn("Firestore profile fetch/init warning:", e);
        }

        setUser({
          uid: fbUser.uid,
          username,
          email: fbUser.email || "",
          displayName: fbUser.displayName || username,
          photoURL: fbUser.photoURL,
          emailVerified: fbUser.emailVerified,
          isDemo: false,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        });
        setIsDemo(false);
      } else if (!isDemo) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  // Sign Up with Username + Email + Password
  const signUpWithEmail = async (username: string, email: string, pass: string) => {
    const cleanUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(cleanUsername)) {
      throw new Error("Username must be 3-30 characters long and contain only letters, numbers, or underscores.");
    }

    try {
      const usernameRef = doc(db, "usernames", cleanUsername);
      const usernameSnap = await getDoc(usernameRef);
      if (usernameSnap.exists()) {
        throw new Error("This username is already taken. Please choose another username.");
      }
    } catch (e: any) {
      if (e.message?.includes("already taken")) throw e;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: cleanUsername });

    const now = new Date().toISOString();
    try {
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          uid: cred.user.uid,
          username: cleanUsername,
          email: cred.user.email,
          createdAt: now,
        },
        { merge: true }
      );

      await setDoc(doc(db, "usernames", cleanUsername), {
        uid: cred.user.uid,
        email: cred.user.email,
      });
    } catch (e) {
      console.warn("Firestore index write warning:", e);
    }

    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn("Verification email send warning:", e);
    }
  };

  // Sign In using Username OR Email
  const signInWithUsernameOrEmail = async (identifier: string, pass: string) => {
    let targetEmail = identifier.trim();

    if (!targetEmail.includes("@")) {
      const cleanUsername = targetEmail.toLowerCase();
      try {
        const usernameRef = doc(db, "usernames", cleanUsername);
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) {
          targetEmail = usernameSnap.data().email;
        }
      } catch (e) {
        console.warn("Username lookup warning:", e);
      }
    }

    await signInWithEmailAndPassword(auth, targetEmail, pass);
  };

  // Send Magic Link Email
  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/magic-link?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
  };

  // Verify Magic Link Callback
  const verifyMagicLinkCallback = async (email: string): Promise<boolean> => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");
      return true;
    }
    return false;
  };

  // Resend Email Verification
  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  // Password Reset
  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Enhanced Google Sign-In with mobile redirect fallback
  const signInWithGoogle = async () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : ""
    );

    if (isMobile) {
      await signInWithRedirect(auth, googleProvider);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn("signInWithPopup failed, attempting signInWithRedirect fallback:", err);
      if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw err;
      }
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  const logout = async () => {
    if (auth.currentUser) {
      await fbSignOut(auth);
    }
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        signUpWithEmail,
        signInWithUsernameOrEmail,
        sendMagicLink,
        verifyMagicLinkCallback,
        resendVerificationEmail,
        sendPasswordReset,
        signInWithGoogle,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
