"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserById } from "@/services/firestore/user-collection";
import { signInEmail as authSignIn } from "@/services/authentication/auth.service";
import { User as AppUser } from "@/models/user";

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<AppUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_KEY = "app:user";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(LOCAL_KEY) : null;
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch (err) {
      console.error("Error when get raw data from local  storage: ", err);
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          try {
            const profile = await getUserById(fbUser.uid);
            setUser(profile);
            try {
              localStorage.setItem(
                LOCAL_KEY,
                JSON.stringify({
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role,
                  outlet: profile.outlet.id, // OK if outlet has non-sensitive fields
                })
              );
            } catch (e) {
              console.warn("Failed to persist user to localStorage", e);
            }
          } catch (err) {
            console.error(
              "Failed to fetch user profile after auth change:",
              err
            );
            // fallback: remove persisted user
            try {
              localStorage.removeItem(LOCAL_KEY);
            } catch {}
            setUser(null);
          }
        } else {
          setUser(null);
          try {
            localStorage.removeItem(LOCAL_KEY);
          } catch {}
        }
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function signInEmail(
    email: string,
    password: string
  ): Promise<AppUser | null> {
    try {
      const signed = await authSignIn(email, password);
      if (signed) {
        setUser(signed);
        try {
          localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify({
              id: signed.id,
              name: signed.name,
              email: signed.email,
              role: signed.role,
              outlet: signed.outlet,
            })
          );
        } catch (e) {
          console.warn("Failed to persist user to localStorage", e);
        }
      }
      return signed;
    } catch (err) {
      console.error("signInEmail error:", err);
      return null;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      try {
        localStorage.removeItem(LOCAL_KEY);
      } catch {}
    } catch (err) {
      console.error("signOut error:", err);
      throw err;
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signInEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
