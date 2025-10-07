import { collection, getDocs } from "firebase/firestore";
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
    const querySnapshot = await getDocs(colRef);
    const allMenus = await getAllMenus();
    const menuMap = new Map(allMenus.map((menu) => [menu.id, menu]));
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const orderedMenus: OrderedMenu[] = data.orderedMenus.map(
        (orderedMenu: {
          id: string;
          menu: string;
          quantity: number;
          customize: string | undefined;
          timeCreated: number | undefined;
          timeFinished: number | undefined;
          isDone: boolean;
        }) =>
          OrderedMenu.fromJson({
            id: orderedMenu.id as string,
            menu: menuMap.get(orderedMenu.menu as string) as Menu,
            quantity: orderedMenu.quantity as number,
            customize: orderedMenu.customize as string | undefined,
            timeCreated: orderedMenu.timeCreated as number | undefined,
            timeFinished: orderedMenu.timeFinished as number | undefined,
            isDone: orderedMenu.isDone as boolean,
          })
      );
      return Transaction.fromJson({
        id: docSnap.id as string,
        code: data.code as string,
        category: data.category as string,
        orderedMenus: orderedMenus,
        timeCreated: data.timeCreated as number | undefined,
        timeFinished: data.timeFinished as number | undefined,
        isDone: data.isDone as boolean,
      });
    });
  } catch (err) {
    console.error("getAllTransactions error:", err);
    throw err;
  }
};
