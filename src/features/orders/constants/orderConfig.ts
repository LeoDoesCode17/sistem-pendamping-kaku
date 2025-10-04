// features/orders/constants/orderConfig.ts
interface OrderConfigItem {
  fields: string[];
  labels: Record<string, string>;
  prefix?: string;
}

export const ORDER_CONFIG: Record<string, OrderConfigItem> = {
  'dine-in': {
    fields: ['customerName'],
    labels: {
      customerName: 'Nama Pemesan'
    }
  },
  'take-away': {
    fields: ['customerName'],
    labels: {
      customerName: 'Nama Pemesan'
    }
  },
  'grab-food': {
    fields: ['orderCode'],
    labels: {
      orderCode: 'Kode Pesanan'
    },
    prefix: 'GF - '
  },
  'go-food': {
    fields: ['orderCode'],
    labels: {
      orderCode: 'Kode Pesanan'
    },
    prefix: 'GO - '
  },
  'shopee-food': {
    fields: ['orderCode'],
    labels: {
      orderCode: 'Kode Pesanan'
    },
    prefix: '# '
  },
  'wa-order': {
    fields: ['customerName', 'phoneNumber'],
    labels: {
      customerName: 'Nama Pemesan',
      phoneNumber: 'Nomor Telepon'
    }
  }
};