export class MenuCategory {
  id: string;
  name: string;

  constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }

  static fromFirestore(data: { id: string, name: string }): MenuCategory {
    return new MenuCategory({
      id: data.id,
      name: data.name
    });
  }
}
