import {
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { User } from "@/models/user";
import { Role } from "@/types/role";
import { getOutletById } from "./outlet-collection";

const COLLECTION_NAME = "users";

export async function getUserById(id: string): Promise<User> {
  try {
    const userRef = doc(firestore, COLLECTION_NAME, id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const msg = "No user with id: " + id;
      console.error(msg);
      throw new Error(msg);
    }

    const userData = userSnap.data();
    const outlet = await getOutletById(userData.outlet as string);
    const data = {
      id: userSnap.id,
      email: userData.email as string,
      name: userData.name as string,
      role: userData.role as Role,
      outlet: outlet,
    };

    return User.fromJson(data);
  } catch (err) {
    const msg =
      "Error when fetcing user with id: " + id + " with error: " + err;
    console.error(msg);
    throw new Error(msg);
  }
}
