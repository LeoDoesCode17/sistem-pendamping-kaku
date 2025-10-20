import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Menu } from "@/models/menu";
import { MenuCategory } from "@/types/menu-category";

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
    const data = {
      id: id,
      name: menuData.name as string,
      abbreviation: menuData.abbraviation as string,
      category: menuData.category as MenuCategory,
    };
    return Menu.fromJson(data);

  }catch (err) {
    const msg = "Error when fetching menu with id: " + id + " with error: " + err;
    console.error(msg);
    throw new Error(msg);
  }
}

export const getAllMenus = async (): Promise<Menu[]> => {
  try {
    const colRef = collection(firestore, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => Menu.fromJson({
      id: docSnap.id as string,
      name: docSnap.data().name as string,
      abbreviation: docSnap.data().abbreviation as string,
      category: docSnap.data().category as MenuCategory
    }));
  }catch (err) {
    console.error("getAllMenus error:", err);
    throw err;
  }
}