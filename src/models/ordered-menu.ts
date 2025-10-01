import { Menu } from "./menu";
import { Outlet } from "./outlet";

export class OrderedMenu {
  id: string;
  menu: Menu;
  timeCreated: Date;
  timeFinished: Date;
  outlet: Outlet;
  customize: string;

  constructor(params: {
    id: string;
    menu: Menu;
    timeCreated: Date;
    timeFinished: Date;
    outlet: Outlet;
    customize: string;
  }) {
    this.id = params.id;
    this.menu = params.menu;
    this.timeCreated = params.timeCreated;
    this.timeFinished = params.timeFinished;
    this.outlet = params.outlet;
    this.customize = params.customize;
  }
}
