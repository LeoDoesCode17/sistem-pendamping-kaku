import OrderPage from '@/features/orders/pages/OrderPage';
import { TransactionCategory } from '@/types/transaction-category';

export default function GoFoodPage() {
  return <OrderPage orderType="go-food" transactionCategory={TransactionCategory.GoFood}/>;
}