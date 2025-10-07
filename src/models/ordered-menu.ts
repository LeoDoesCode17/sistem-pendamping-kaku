import { Menu } from "./menu";

export class OrderedMenu {
  id: string;
  menu: Menu;
  quantity: number;
  timeCreated: number | undefined;
  timeFinished: number | undefined;
  customize: string | undefined;
  isDone: boolean;

  constructor(params: {
    id: string;
    menu: Menu;
    quantity: number;
    timeCreated: number | undefined;
    timeFinished: number | undefined;
    customize: string | undefined;
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
    id: string;
    menu: string;
    quantity: number;
    customize: string | undefined;
    isDone: boolean
  } {
    return {
      id: this.id,
      menu: this.menu.id,
      quantity: this.quantity,
      customize: this.customize,
      isDone: false,
    };
  }

  static fromJson(data: {
    id: string;
    menu: Menu;
    quantity: number;
    customize: string | undefined;
    timeCreated: number | undefined;
    timeFinished: number | undefined;
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
