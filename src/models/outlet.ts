export class Outlet {
  id: string;
  name: string;

  constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }

  static fromJson(data: { id: string, name: string }): Outlet {
    return new Outlet({
      id: data.id,
      name: data.name,
    })
  }
}
