import OrderPage from '@/features/orders/pages/OrderPage';
import { TransactionCategory } from '@/types/transaction-category';

export default function DineInPage() {
  return <OrderPage orderType="dine-in" transactionCategory={TransactionCategory.DineIn} />;
}