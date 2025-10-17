import { TransactionCategory } from "@/types/transaction-category";
import { OrderedMenu } from "./ordered-menu";

export class Transaction {
  id: string | null;
  code: string;
  category: TransactionCategory;
  orderedMenus: OrderedMenu[];
  timeCreated: number | null;
  timeFinished: number | null;
  isDone: boolean;

  constructor(params: {
    id: string | null;
    code: string;
    category: TransactionCategory;
    orderedMenus: OrderedMenu[];
    timeCreated: number | null;
    timeFinished: number | null;
    isDone: boolean;
  }) {
    this.id = params.id;
    this.code = params.code;
    this.category = params.category;
    this.orderedMenus = params.orderedMenus;
    this.timeCreated = params.timeCreated;
    this.timeFinished = params.timeFinished;
    this.isDone = params.isDone;
  }

  static fromJson(data: {
    id: string;
    code: string;
    category: string;
    orderedMenus: OrderedMenu[];
    timeCreated: number | null;
    timeFinished: number | null;
    isDone: boolean;
  }): Transaction {
    return new Transaction({
      id: data.id,
      code: data.code,
      category: data.category as TransactionCategory,
      orderedMenus: data.orderedMenus,
      timeCreated: data.timeCreated,
      timeFinished: data.timeFinished,
      isDone: data.isDone,
    });
  }

  toJson(): {
    code: string;
    category: string;
    orderedMenus: {
      id: string | null;
      menu: string;
      quantity: number;
    }[];
    isDone: boolean
  } {
    return {
      code: this.code,
      category: this.category,
      orderedMenus: this.orderedMenus.map((orderedMenu) =>
        orderedMenu.toJson()
      ),
      isDone: false,
    };
  }
}
