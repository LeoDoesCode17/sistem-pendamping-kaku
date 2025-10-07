import {
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { MenuCategory } from "@/models/menu-category";

const COLLECTION_NAME = "menu_categories";

export const getMenuCategoryById = async (id: string): Promise<MenuCategory> => {
  try {
    const categoryRef = doc(firestore, COLLECTION_NAME, id);
    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists()) {
      const msg = "No menu category with id: " + id;
      console.error(msg);
      throw new Error(msg);
    }
    const categoryData = categorySnap.data();
    const data = {
      id: id,
      name: categoryData.name as string,
    };
    return MenuCategory.fromFirestore(data);
  } catch (err) {
    const msg = "Error when fetching menu category with id: " + id + " with error: " + err;
    console.error(msg);
    throw new Error(msg);
  }
}