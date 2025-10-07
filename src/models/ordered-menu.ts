import { Menu } from "./menu";

export class OrderedMenu {
  id: string;
  menu: Menu;
  quantity: number;
  timeCreated: number | undefined;
  timeFinished: number | undefined;
  customize: string;

  constructor(params: {
    id: string;
    menu: Menu;
    quantity: number;
    timeCreated: number | undefined;
    timeFinished: number | undefined;
    customize: string;
  }) {
    this.id = params.id;
    this.menu = params.menu;
    this.customize = params.customize;
    this.quantity = params.quantity;
    this.timeCreated = params.timeCreated;
    this.timeFinished = params.timeFinished;
  }
}
