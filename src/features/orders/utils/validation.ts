// features/orders/utils/validation.ts
import { ORDER_CONFIG } from '../constants/orderConfig';
import { OrderHeaderData, OrderType } from '../types/order';
import { OrderedMenu } from '@/models/ordered-menu';

const nonEmpty = (v?: string) => !!(v && v.trim().length > 0);

/**
 * Validasi sebelum konfirmasi pesanan.
 * - Cek minimal 1 item di keranjang
 * - Cek field wajib berdasarkan ORDER_CONFIG untuk orderType saat ini
 */
export function validateBeforeSubmit(params: {
  orderType: OrderType;
  orderData: OrderHeaderData;
  items: OrderedMenu[];
}): { ok: true } | { ok: false; message: string } {
  const { orderType, orderData, items } = params;

  if (!items || items.length === 0) {
    return { ok: false, message: 'Keranjang masih kosong.' };
  }

  const cfg = ORDER_CONFIG[orderType];
  const missing: string[] = [];

  for (const f of cfg.fields) {
    switch (f) {
      case 'customerName':
        if (!nonEmpty(orderData.customerName)) missing.push(cfg.labels.customerName ?? 'Nama pembeli');
        break;
      case 'orderCode':
        if (!nonEmpty(orderData.orderCode)) missing.push(cfg.labels.orderCode ?? 'Kode pesanan');
        break;
      case 'phoneNumber':
        if (!nonEmpty(orderData.phoneNumber)) missing.push(cfg.labels.phoneNumber ?? 'Nomor telepon');
        break;
      default:
        break;
    }
  }

  if (missing.length > 0) {
    // Bahasa UI: jangan sebut "OrderHeader"
    const labelList =
      missing.length === 1
        ? missing[0]
        : missing.slice(0, -1).join(', ') + ' dan ' + missing.slice(-1);

    return {
      ok: false,
      message: `Lengkapi data pembeli terlebih dahulu (${labelList}).`,
    };
  }

  return { ok: true };
}
