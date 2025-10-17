import OrderPage from '@/features/orders/pages/OrderPage';
import { TransactionCategory } from '@/types/transaction-category';

export default function WaOrderPage() {
  return <OrderPage orderType="wa-order" transactionCategory={TransactionCategory.WhatsappOrder}/>;
}