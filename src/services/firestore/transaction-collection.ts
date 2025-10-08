import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Transaction } from "@/models/transaction";
import { OrderedMenu } from "@/models/ordered-menu";
import { Menu } from "@/models/menu";
import { getAllMenus } from "./menu-collection";

const COLLECTION_NAME = "transactions";

export const getAllTransactions = async (
  outletId: string
): Promise<Transaction[]> => {
  try {
    const colRef = collection(firestore, `${COLLECTION_NAME}/${outletId}`);
    const [querySnapshot, allMenus] = await Promise.all([
      getDocs(colRef),
      getAllMenus(),
    ]);
    const menuMap = new Map(allMenus.map((menu) => [menu.id, menu]));
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const timeCreated =
        data.timeCreated instanceof Timestamp
          ? data.timeCreated.toMillis()
          : typeof data.timeCreated === "number"
          ? data.timeCreated
          : undefined;
      const timeFinished =
        data.timeFinished instanceof Timestamp
          ? data.timeFinished.toMillis()
          : typeof data.timeFinished === "number"
          ? data.timeFinished
          : undefined;
      const orderedMenus: OrderedMenu[] = data.orderedMenus.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (orderedMenu: any) =>
          OrderedMenu.fromJson({
            id: orderedMenu.id as string,
            menu: menuMap.get(orderedMenu.menu as string) as Menu,
            quantity: orderedMenu.quantity as number,
            customize: orderedMenu.customize as string | undefined,
            timeCreated: timeCreated,
            timeFinished: timeFinished,
            isDone: orderedMenu.isDone as boolean,
          })
      );
      return Transaction.fromJson({
        id: docSnap.id as string,
        code: data.code as string,
        category: data.category as string,
        orderedMenus: orderedMenus,
        timeCreated: timeCreated,
        timeFinished: timeFinished,
        isDone: data.isDone as boolean,
      });
    });
  } catch (err) {
    console.error("getAllTransactions error:", err);
    throw err;
  }
};

export const createNewTransaction = async (
  outletId: string,
  transaction: Transaction
): Promise<void> => {
  try {
    const colRef = collection(firestore, `${COLLECTION_NAME}/${outletId}`);
    const now = serverTimestamp();
    await addDoc(colRef, {
      ...transaction.toJson(),
      timeCreated: now,
    });
  } catch (err) {
    console.error("createNewTransaction error:", err);
    throw err;
  }
};
