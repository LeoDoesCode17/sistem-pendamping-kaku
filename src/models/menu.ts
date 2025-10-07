import { MenuCategory } from "@/types/menu-category";

export class Menu {
  id: string;
  name: string;
  category: MenuCategory;

  constructor(params: { id: string; name: string; category: MenuCategory }) {
    this.id = params.id;
    this.name = params.name;
    this.category = params.category;
  }

  static fromJson(data: { id: string, name: string, category: MenuCategory}): Menu {
    return new Menu({
      id: data.id,
      name: data.name,
      category: data.category,
    })
  }

  toJson(): { id: string, name: string, category: string } {
    return {
      id: this.id,
      name: this.name,
      category: this.category
    }
  }
}
