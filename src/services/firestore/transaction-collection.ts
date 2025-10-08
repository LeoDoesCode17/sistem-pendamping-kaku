import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDocs,
  runTransaction,
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

export const updateTransactionStatus = async (
  outletId: string,
  transactionId: string,
  isDone: boolean
): Promise<void> => {
  const docRef = doc(
    firestore,
    `${COLLECTION_NAME}/${outletId}/${transactionId}`
  );
  try {
    // make sure get and update in atomic operation
    await runTransaction(firestore, async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists()) {
        throw new Error(`Transaction ${transactionId} not found`);
      }
      const data = snap.data();
      const now = isDone ? serverTimestamp() : deleteField();
      const rawOrdered = Array.isArray(data.orderedMenus)
        ? data.orderedMenus
        : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedOrdered = rawOrdered.map((orderedMenu: any) => {
        const currentData = { ...orderedMenu, isDone };
        currentData.timeFinished = now;
        return currentData;
      });
      const updatedData = {
        isDone: isDone,
        orderedMenus: updatedOrdered,
        timeFinished: now,
      };
      tx.update(docRef, updatedData);
    });
    console.log(`✅ Transaction ${transactionId} status updated to ${isDone}.`);
  } catch (err) {
    console.error("updateTransactionStatus error:", err);
    throw err;
  }
};
