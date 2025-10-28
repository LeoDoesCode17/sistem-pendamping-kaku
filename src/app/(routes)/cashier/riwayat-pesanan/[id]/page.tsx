// app/cashier/riwayat-pesanan/[id]/page.tsx
import OrderDetailPage from '@/features/cashier/pages/OrderDetailPage';

export default async function OrderDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}
