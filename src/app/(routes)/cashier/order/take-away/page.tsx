import OrderPage from '@/features/orders/pages/OrderPage';
import { TransactionCategory } from '@/types/transaction-category';

export default function TakeAwayPage() {
  return <OrderPage orderType="take-away" transactionCategory={TransactionCategory.TakeAway}/>;
}