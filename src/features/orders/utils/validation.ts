import { ORDER_CONFIG } from '../constants/orderConfig';
import { OrderHeaderData, OrderType } from '../types/order';
import { OrderedMenu } from '@/models/ordered-menu';

const nonEmpty = (v?: string, prefix?: string) => {
  if (!v) return false;
  const trimmed = v.trim();
  if (prefix && trimmed === prefix.trim()) return false; // hanya prefix → kosong
  return trimmed.length > 0;
};

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
    if (f === 'gofoodCode') continue; // opsional

    switch (f) {
      case 'customerName':
        if (!nonEmpty(orderData.customerName)) {
          missing.push(cfg.labels.customerName ?? 'Nama pembeli');
        }
        break;
      case 'orderCode':
        if (!nonEmpty(orderData.orderCode, cfg.prefix)) {
          missing.push(cfg.labels.orderCode ?? 'Kode pesanan');
        }
        break;
      case 'phoneNumber':
        if (!nonEmpty(orderData.phoneNumber)) {
          missing.push(cfg.labels.phoneNumber ?? 'Nomor telepon');
        }
        break;
      default:
        break;
    }
  }

  if (missing.length > 0) {
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
