import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "@/models/user";

export async function signInEmail(email: string, password: string): Promise<void> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // fetch data from firestore and pass it to return User model
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}