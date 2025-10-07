import {
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Outlet } from "@/models/outlet";

const COLLECTION_NAME = "outlets";

export const getOutletById = async (id: string): Promise<Outlet> => {
  try {
    const outletRef = doc(firestore, COLLECTION_NAME, id)
    const outletSnap = await getDoc(outletRef)
    if (!outletSnap.exists()) {
      const msg = "No outlet with id: " + id
      console.error(msg)
      throw new Error(msg)
    }
    const data = { id: outletSnap.id, name: outletSnap.data().name }
    return Outlet.fromJson(data)
  }catch (err) {
    const msg = "Error when fetching outlet with id: " + id + " with error: " + err
    console.error(msg)
    throw new Error(msg)
  }
}