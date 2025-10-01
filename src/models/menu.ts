import { MenuCategory } from "./menu-category";

export class Menu {
  id: string;
  name: string;
  category: MenuCategory;

  constructor(params: { id: string; name: string; category: MenuCategory }) {
    this.id = params.id;
    this.name = params.name;
    this.category = params.category;
  }
}
