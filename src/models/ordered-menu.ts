import { Menu } from "./menu";

export class OrderedMenu {
  id: string | null;
  menu: Menu;
  quantity: number;
  timeCreated: number | null;
  timeFinished: number | null;
  customize: string | null;
  isDone: boolean;

  constructor(params: {
    id: string | null;
    menu: Menu;
    quantity: number;
    timeCreated: number | null;
    timeFinished: number | null;
    customize: string | null;
    isDone: boolean;
  }) {
    this.id = params.id;
    this.menu = params.menu;
    this.customize = params.customize;
    this.quantity = params.quantity;
    this.timeCreated = params.timeCreated;
    this.timeFinished = params.timeFinished;
    this.isDone = params.isDone;
  }

  toJson(): {
    id: string | null;
    menu: string;
    quantity: number;
    isDone: boolean
  } {
    return {
      id: this.id,
      menu: this.menu.id,
      quantity: this.quantity,
      isDone: false,
    };
  }

  static fromJson(data: {
    id: string | null;
    menu: Menu;
    quantity: number;
    customize: string | null;
    timeCreated: number | null;
    timeFinished: number | null;
    isDone: boolean;
  }): OrderedMenu {
    return new OrderedMenu({
      id: data.id,
      menu: data.menu,
      quantity: data.quantity,
      customize: data.customize,
      timeCreated: data.timeCreated,
      timeFinished: data.timeFinished,
      isDone: data.isDone,
    });
  }
}
