// features/orders/constants/categories.ts
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'gorengan', label: 'Gorengan' },
  { id: 'rebusan', label: 'Rebusan' },
  { id: 'cireng', label: 'Cireng' },
  { id: 'pisang', label: 'Pisang' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'sambal', label: 'Sambal' },
  { id: 'setengahmatang', label: 'Setengah Matang' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];