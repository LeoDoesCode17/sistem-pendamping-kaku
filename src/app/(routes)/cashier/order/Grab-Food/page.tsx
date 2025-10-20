import OrderPage from '@/features/orders/pages/OrderPage';
import { TransactionCategory } from '@/types/transaction-category';

export default function GrabFoodPage() {
  return <OrderPage orderType="grab-food" transactionCategory={TransactionCategory.GrabFood}/>;
}