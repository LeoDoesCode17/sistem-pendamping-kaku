import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "@/models/user";
import { getUserById } from "../firestore/user-collection";

export async function signInEmail(email: string, password: string): Promise<User | null> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // fetch data from firestore and pass it to return User model
  const userId = cred.user.uid;
  try {
    const user = getUserById(userId);
    return user;
  }catch(err) {
    console.error("Error to get user by id: ", err);
    return null;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}