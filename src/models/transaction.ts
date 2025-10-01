import { Menu } from "./menu";
import { Outlet } from "./outlet";
import { TransactionCategory } from "./transaction-category";

export class Transaction {
  id: string;
  code: string;
  category: TransactionCategory;
  outlet: Outlet;
  orderedMenus: Menu[];
  timeCreated: Date;
  timeFinished: Date;

  constructor(params: {  id: string;
  code: string;
  category: TransactionCategory;
  outlet: Outlet;
  orderedMenus: Menu[];
  timeCreated: Date;
  timeFinished: Date;}) {
    this.id = params.id;
    this.code = params.code;
    this.category = params.category;
    this.outlet = params.outlet;
    this.orderedMenus = params.orderedMenus;
    this.timeCreated = params.timeCreated;
    this.timeFinished = params.timeFinished;
  }
}