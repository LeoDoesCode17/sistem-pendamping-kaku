// features/cashier/utils/filter.ts
import { Transaction } from "@/models/transaction";
import {
  OrderHistory,
  FilterOptions,
  MyFilterOptions,
} from "../types/order-history";

export function filterOrders(
  orders: OrderHistory[],
  filters: FilterOptions
): OrderHistory[] {
  let filtered = [...orders];

  // Filter by order type
  if (filters.orderType && filters.orderType !== "all") {
    filtered = filtered.filter(
      (order) => order.orderType === filters.orderType
    );
  }

  // Filter by date range
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.dateCreated);
      return orderDate >= start && orderDate <= end;
    });
  }

  return filtered;
}

export function myFilterTransactions(
  transactions: Transaction[],
  filters: MyFilterOptions
): Transaction[] {
  let filtered = [...transactions];
  if (filters.transactionCategory && filters.transactionCategory != "ALL") {
    filtered = filtered.filter(
      (transacionn) => transacionn.category === filters.transactionCategory
    );
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    filtered = filtered.filter((transaction) => {
      const transactionDate = new Date(transaction.timeCreated!);
      return transactionDate >= dateStart && transactionDate <= dateEnd;
    });
  }

  return filtered;
}

export function paginateOrders(
  orders: OrderHistory[],
  currentPage: number,
  itemsPerPage: number = 12
): OrderHistory[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return orders.slice(startIndex, endIndex);
}

export function myPaginateTransactions(
  transactions: Transaction[],
  currentPage: number,
  itemsPerPage: number = 12
): Transaction[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return transactions.slice(startIndex, endIndex);
}
