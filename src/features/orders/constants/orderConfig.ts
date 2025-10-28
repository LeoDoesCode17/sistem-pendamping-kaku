interface OrderConfigItem {
  fields: string[];
  labels: Record<string, string>;
  prefix?: string;
}

export const ORDER_CONFIG: Record<string, OrderConfigItem> = {
  'dine-in': {
    fields: ['customerName'],
    labels: { customerName: 'Nama Pemesan' },
  },
  'take-away': {
    fields: ['customerName'],
    labels: { customerName: 'Nama Pemesan' },
  },
  'grab-food': {
    fields: ['orderCode'],
    labels: { orderCode: 'Kode Pesanan' },
    prefix: 'GF - ',
  },
  'go-food': {
    // ✅ tampilkan 2 input: kode pesanan + kode angka (opsional)
    fields: ['orderCode', 'gofoodCode'],
    labels: {
      orderCode: 'Kode Pesanan',
      gofoodCode: 'Kode GoFood (opsional)',
    },
    prefix: 'GO - ',
  },
  'shopee-food': {
    fields: ['orderCode'],
    labels: { orderCode: 'Kode Pesanan' },
    prefix: '# ',
  },
  'wa-order': {
    fields: ['customerName', 'phoneNumber'],
    labels: {
      customerName: 'Nama Pemesan',
      phoneNumber: 'Nomor Telepon',
    },
  },
};
