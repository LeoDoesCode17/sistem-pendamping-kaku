import { TransactionCategory } from "@/types/transaction-category";
import { OrderedMenu } from "./ordered-menu";

export class Transaction {
  id: string | undefined;
  code: string;
  category: TransactionCategory;
  orderedMenus: OrderedMenu[];
  timeCreated: number | undefined;
  timeFinished: number | undefined;
  isDone: boolean;

  constructor(params: {
    id: string | undefined;
    code: string;
    category: TransactionCategory;
    orderedMenus: OrderedMenu[];
    timeCreated: number | undefined;
    timeFinished: number | undefined;
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
    timeCreated: number | undefined;
    timeFinished: number | undefined;
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
    id: string | undefined;
    code: string;
    category: string;
    orderedMenus: {
      id: string;
      menu: string;
      quantity: number;
      customize: string | undefined;
    }[];
    isDone: boolean
  } {
    return {
      id: this.id,
      code: this.code,
      category: this.category,
      orderedMenus: this.orderedMenus.map((orderedMenu) =>
        orderedMenu.toJson()
      ),
      isDone: false,
    };
  }
}
