export const statusConfig = {
  ORDERED:   { label: 'Ordered',   cls: 'border border-blue-300 text-blue-600 bg-blue-50' },
  PAYMENT:   { label: 'Payment',   cls: 'border border-yellow-300 text-yellow-600 bg-yellow-50' },
  CONFIRMED: { label: 'Confirmed', cls: 'border border-violet-300 text-violet-600 bg-violet-50' },
  DELIVERED: { label: 'Delivered', cls: 'border border-green-300 text-green-600 bg-green-50' },
  CANCELLED: { label: 'Cancelled', cls: 'border border-red-300 text-red-500 bg-red-50' },
};

export const tabStatusMap = {
  'All Orders': null,
  'Ordered':    'ORDERED',
  'Payment':    'PAYMENT',
  'Confirmed':  'CONFIRMED',
  'Delivered':  'DELIVERED',
  'Cancelled':  'CANCELLED',
};

export const styles = {
  subHeaderRow:  'bg-gray-50/80 border-b border-gray-100',
  subHeaderCell: 'px-4 py-2',
  subHeaderText: 'flex items-center gap-2 text-sm font-medium text-gray-600',
  subHeaderCount:'text-gray-400 font-normal text-xs',
  updateBtn:     'text-xs px-3 py-1.5 rounded-lg border border-violet-300 text-violet-600 bg-white shadow-[0_3px_0_0_rgba(109,40,217,0.15)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_rgba(109,40,217,0.1)] active:translate-y-0.5 active:shadow-none transition-all duration-150',
  // modal
  modalSpinner:  'flex items-center justify-center h-48',
  orderGrid:     'grid grid-cols-2 gap-3 text-sm',
  labelText:     'text-xs text-gray-400 mb-0.5',
  valueText:     'font-medium text-gray-800',
  itemsRow:      'flex items-center justify-between text-sm bg-gray-50 rounded-xl px-3 py-2',
  selectField:   'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-400',
  modalFooter:   'flex gap-3 justify-end pt-1',
};
