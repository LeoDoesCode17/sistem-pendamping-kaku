import {
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Menu } from "@/models/menu";
import { getMenuCategoryById } from "./menu-category-collection";

const COLLECTION_NAME = "menus";

export const getMenuById = async (id: string): Promise<Menu> => {
  try {
    const menuRef = doc(firestore, COLLECTION_NAME, id);
    const menuSnap = await getDoc(menuRef);
    if (!menuSnap.exists()) {
      const msg = "No menu with id: " + id;
      console.error(msg);
      throw new Error(msg);
    }
    const menuData = menuSnap.data();
    const menuCategory = await getMenuCategoryById(menuData.category as string);
    const data = {
      id: id,
      name: menuData.name as string,
      category: menuCategory,
    };
    return Menu.fromFirestore(data);

  }catch (err) {
    const msg = "Error when fetching menu with id: " + id + " with error: " + err;
    console.error(msg);
    throw new Error(msg);
  }
}