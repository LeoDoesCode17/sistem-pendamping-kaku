import OrderPage from '@/features/orders/pages/OrderPage';
import { TransactionCategory } from '@/types/transaction-category';

export default function ShopeeFoodPage() {
  return <OrderPage orderType="shopee-food" transactionCategory={TransactionCategory.ShopeeFood} />;
}