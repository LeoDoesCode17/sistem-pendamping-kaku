// features/cashier/utils/filter.ts
import { OrderHistory, FilterOptions } from '../types/order-history';

export function filterOrders(
  orders: OrderHistory[],
  filters: FilterOptions
): OrderHistory[] {
  let filtered = [...orders];

  // Filter by order type
  if (filters.orderType && filters.orderType !== 'all') {
    filtered = filtered.filter(order => order.orderType === filters.orderType);
  }

  // Filter by date range
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.dateCreated);
      return orderDate >= start && orderDate <= end;
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