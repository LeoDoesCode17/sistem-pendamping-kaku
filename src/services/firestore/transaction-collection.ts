import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Transaction } from "@/models/transaction";
import { OrderedMenu } from "@/models/ordered-menu";
import { Menu } from "@/models/menu";
import { getAllMenus } from "./menu-collection";

const COLLECTION_NAME = "transactions";

export const getAllTransactions = async (
  outletId: string,
  isDone?: boolean
): Promise<Transaction[]> => {
  try {
    const colRef = collection(firestore, `${COLLECTION_NAME}/${outletId}/list`);
    // ✅ Only get transactions where isDone == false
    const q =
      typeof isDone === "boolean"
        ? query(colRef, where("isDone", "==", isDone))
        : colRef;
    const [querySnapshot, allMenus] = await Promise.all([
      getDocs(q),
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
          : null;
      const timeFinished =
        data.timeFinished instanceof Timestamp
          ? data.timeFinished.toMillis()
          : typeof data.timeFinished === "number"
          ? data.timeFinished
          : null;
      const orderedMenus: OrderedMenu[] = data.orderedMenus.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (orderedMenu: any) =>
          OrderedMenu.fromJson({
            id: orderedMenu.id as string,
            menu: menuMap.get(orderedMenu.menu as string) as Menu,
            quantity: orderedMenu.quantity as number,
            customize: orderedMenu.customize as string | null,
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
    const colRef = collection(firestore, `${COLLECTION_NAME}/${outletId}/list`);
    const now = serverTimestamp();
    await addDoc(colRef, {
      ...transaction.toJson(),
      timeCreated: now,
      timeFinished: now,
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
    `${COLLECTION_NAME}/${outletId}/list/${transactionId}`
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
        // currentData.timeFinished = now;
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

export const updateOrderedMenuStatus = async (
  outletId: string,
  transactionId: string,
  orderedMenuId: string,
  isDone: boolean
): Promise<void> => {
  const docRef = doc(
    firestore,
    `${COLLECTION_NAME}/${outletId}/${transactionId}`
  );
  try {
    await runTransaction(firestore, async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists()) {
        throw new Error(`Transaction ${transactionId} not found`);
      }
      const data = snap.data();
      const now = isDone ? serverTimestamp() : deleteField();
      let found = false;
      const rawOrdered = Array.isArray(data.orderedMenus)
        ? data.orderedMenus
        : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedOrdered = rawOrdered.map((orderedMenu: any) => {
        if (orderedMenu.id === orderedMenuId) {
          found = true;
          const currentData = { ...orderedMenu, isDone };
          currentData.timeFinished = now;
          return currentData;
        } else {
          return orderedMenu;
        }
      });

      if (!found) {
        throw new Error(
          `OrderedMenu ${orderedMenuId} not found in transaction ${transactionId}`
        );
      }
      const updatedData = {
        orderedMenus: updatedOrdered,
      };
      tx.update(docRef, updatedData);
    });
    console.log(
      `✅ Ordered Menu ${orderedMenuId} status updated to ${isDone}.`
    );
  } catch (err) {
    console.error("updateOrderedMenuStatus error:", err);
    throw err;
  }
};

export const getAllOrderedMenus = async (
  outletId: string
): Promise<OrderedMenu[]> => {
  try {
    // get all transactions first
    // get all ordered menus from transactions
    // sort it based on timeCreated asc (older first)
    const transactions = await getAllTransactions(outletId);
    const orderedMenus = transactions.flatMap((t) => t.orderedMenus);
    return orderedMenus.sort((a, b) => a.timeCreated! - b.timeCreated!);
  } catch (err) {
    console.error("getAllOrderedMenus error:", err);
    throw err;
  }
};
