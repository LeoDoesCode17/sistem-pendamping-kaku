import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { User } from "@/models/user";
import { Outlet } from "@/models/outlet";
import { Role } from "@/types/role";

const USER_COLLECTION = "users";

export async function getUserById(id: string): Promise<User> {
  try {
    const userRef = doc(firestore, USER_COLLECTION, id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const msg = "No user with id: " + id;
      console.error(msg);
      throw new Error(msg);
    }

    const userData = userSnap.data();
    const outletRef = userData.outlet as DocumentReference<
      DocumentData,
      DocumentData
    >;
    const outletSnap = await getDoc(outletRef);

    if (!outletSnap.exists()) {
      const msg = "No outlet id found for user with id: " + id;
      console.error(msg);
      throw new Error(msg);
    }

    const outlet = new Outlet({
      id: outletSnap.id,
      name: outletSnap.data().name,
    });

    return new User({
      id: id,
      email: userData.email,
      name: userData.name,
      role: userData.role as Role,
      outlet: outlet,
    });
  } catch (err) {
    const msg = "Error when fetcing user with id: " + id + " with error: " + err
    console.error(msg);
    throw new Error(msg);
  }
}
