import { MenuCategory } from "@/types/menu-category";

export class Menu {
  id: string;
  name: string;
  abbreviation: string;
  category: MenuCategory;

  constructor(params: { id: string; name: string; abbraviation: string; category: MenuCategory }) {
    this.id = params.id;
    this.name = params.name;
    this.category = params.category;
    this.abbreviation = params.abbraviation;
  }

  static fromJson(data: { id: string, name: string, abbreviation: string, category: MenuCategory}): Menu {
    return new Menu({
      id: data.id,
      name: data.name,
      abbraviation: data.abbreviation,
      category: data.category,
    })
  }

  toJson(): { id: string, name: string, abbreviation: string, category: string } {
    return {
      id: this.id,
      name: this.name,
      abbreviation: this.abbreviation,
      category: this.category
    }
  }
}
