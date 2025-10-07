import { Menu } from "./menu";
import { Outlet } from "./outlet";

export class OrderedMenu {
  id: string;
  menu: Menu;
  quantity: number;
  customize: string;

  constructor(params: {
    id: string;
    menu: Menu;
    quantity: number;
    outlet: Outlet;
    customize: string;
  }) {
    this.id = params.id;
    this.menu = params.menu;
    this.customize = params.customize;
    this.quantity = params.quantity;
  }
}
