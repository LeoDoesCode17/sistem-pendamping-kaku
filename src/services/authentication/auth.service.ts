import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "@/models/user";
import { getUserById } from "../firestore/user-collection";

export async function signInEmail(email: string, password: string): Promise<User | null> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const userId = cred.user.uid;
    const user = await getUserById(userId);
    return user;  
  }catch (err) {
    console.error("signInEmail failed for email:", email, "error:", err);
    return null;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}