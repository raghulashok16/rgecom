export const stockLevel = (qty, threshold) => {
  if (qty === 0)         return { label: 'Out of Stock', cls: 'bg-red-50 text-red-600 border border-red-200' };
  if (qty <= threshold)  return { label: 'Low Stock',    cls: 'bg-yellow-50 text-yellow-600 border border-yellow-200' };
  return                        { label: 'In Stock',     cls: 'bg-green-50 text-green-600 border border-green-200' };
};

export const MOVEMENT_BADGE = {
  IN:         'bg-green-50 text-green-600 border border-green-200',
  OUT:        'bg-red-50 text-red-600 border border-red-200',
  ADJUSTMENT: 'bg-violet-50 text-violet-600 border border-violet-200',
};

export const styles = {
  toolbarWrap:     'flex items-center justify-between border-b border-gray-100 bg-white px-6',
  toolbarLeft:     'flex items-center gap-2',
  searchInput:     'border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-700 outline-none w-56',
  movementBtn:     'text-xs px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap',
  filterRow:       'flex items-center gap-2 py-2',
  filterTabs:      'flex items-center rounded-xl border border-gray-200 overflow-hidden text-xs font-medium',
  filterBtnBase:   'relative px-3 py-1.5 transition-colors whitespace-nowrap inline-flex items-center gap-1.5',
  filterActive:    'bg-green-500 text-white',
  filterInactive:  'bg-yellow-500 text-white',
  filterLowStock:  'bg-orange-500 text-white',
  filterOutStock:  'bg-red-500 text-white',
  filterAll:       'bg-[#1C1C2E] text-white',
  filterDefault:   'text-gray-500 hover:bg-gray-50',
  badgeActive:     'bg-white/30 text-white',
  badgeLowStock:   'bg-orange-500 text-white',
  badgeOutStock:   'bg-red-500 text-white',
  badgeBase:       'inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold leading-none',
  stockQtyCell:    'px-4 py-3 font-semibold text-gray-800',
  updateStockBtn:  'text-xs px-3 py-1.5 rounded-xl border border-violet-300 text-violet-600 bg-white hover:bg-violet-50 transition-colors',
  // StockAdjustModal
  adjLabel:        'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1',
  adjInput:        'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-400',
  adjApplyBtn:     'w-full py-2 text-sm rounded-xl bg-[#1C1C2E] text-white hover:bg-[#2a2a40] disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-1',
  productInfoBox:  'flex items-center gap-3 mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100',
  productImg:      'w-10 h-10 object-contain shrink-0',
  // MovementHistoryModal
  movModalBox:     'bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col',
  movTabsRow:      'flex items-center gap-1 px-6 pt-3 pb-0',
  movTabAll:       'px-4 py-1.5 rounded-full text-xs font-medium transition-colors bg-[#1C1C2E] text-white',
  movTabIN:        'px-4 py-1.5 rounded-full text-xs font-medium transition-colors bg-green-500 text-white',
  movTabOUT:       'px-4 py-1.5 rounded-full text-xs font-medium transition-colors bg-red-500 text-white',
  movTabADJ:       'px-4 py-1.5 rounded-full text-xs font-medium transition-colors bg-violet-500 text-white',
  movTabDefault:   'px-4 py-1.5 rounded-full text-xs font-medium transition-colors text-gray-500 hover:bg-gray-100',
  movTableWrap:    'flex-1 overflow-auto px-6 py-3',
  movEmptyMsg:     'flex items-center justify-center py-16 text-gray-400 text-sm',
  movQtyCell:      'px-3 py-2 font-semibold text-gray-800',
  movRefCell:      'px-3 py-2 text-gray-600',
  movRefIdCell:    'px-3 py-2 text-gray-500',
  movDateCell:     'px-3 py-2 text-gray-500 text-xs',
};
