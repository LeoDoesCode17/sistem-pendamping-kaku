// features/orders/constants/categories.ts
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'gorengan', label: 'Gorengan' },
  { id: 'rebusan', label: 'Rebusan' },
  { id: 'cimol', label: 'Cimol' },
  { id: 'pisang', label: 'Pisang' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'sambal', label: 'Sambal' }
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];