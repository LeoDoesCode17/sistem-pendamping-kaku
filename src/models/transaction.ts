import { TransactionCategory } from "@/types/transaction-category";
import { OrderedMenu } from "./ordered-menu";

export class Transaction {
  id: string;
  code: string;
  category: TransactionCategory;
  orderedMenus: OrderedMenu[];
  timeCreated: number | undefined;
  timeFinished: number | undefined;

  constructor(params: {
    id: string;
    code: string;
    category: TransactionCategory;
    orderedMenus: OrderedMenu[];
    timeCreated: number | undefined;
    timeFinished: number | undefined;
  }) {
    this.id = params.id;
    this.code = params.code;
    this.category = params.category;
    this.orderedMenus = params.orderedMenus;
    this.timeCreated = params.timeCreated;
    this.timeFinished = params.timeFinished;
  }

  static fromJson(data: {
    id: string;
    code: string;
    category: string;
    orderedMenus: OrderedMenu[];
    timeCreated: number | undefined;
    timeFinished: number | undefined;
  }): Transaction {
    return new Transaction({
      id: data.id,
      code: data.code,
      category: data.category as TransactionCategory,
      orderedMenus: data.orderedMenus,
      timeCreated: data.timeCreated,
      timeFinished: data.timeFinished,
    });
  }

  toJson(): {
    id: string;
    code: string;
    category: string;
    orderedMenus: {
      id: string;
      menu: string;
      quantity: number;
      customize: string | undefined;
    }[];
  } {
    return {
      id: this.id,
      code: this.code,
      category: this.category,
      orderedMenus: this.orderedMenus.map((orderedMenu) =>
        orderedMenu.toJson()
      ),
    };
  }
}
