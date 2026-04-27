// Shared Tailwind class strings used across multiple dashboard components

export const view = {
  wrapper:      'flex-1 flex flex-col overflow-hidden',
  tableWrapper: 'flex-1 overflow-auto bg-[#F4F5F7]',
  toolbar:      'flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-white',
  errorWrapper: 'flex-1 flex flex-col items-center justify-center text-center px-6',
  errorTitle:   'text-gray-700 font-medium',
};

export const table = {
  root:        'w-full text-sm border-collapse',
  th:          'px-4 py-3 text-left font-medium text-gray-400 text-xs uppercase tracking-wide bg-white',
  row:         'border-b border-gray-100 bg-white hover:bg-violet-50/40 transition-colors',
  td:          'px-4 py-3',
  tdImg:       'px-4 py-2',
  loadingRow:  'border-b border-gray-50',
  loadingCell: 'h-4 bg-gray-100 rounded animate-pulse',
  emptyCell:   'px-4 py-16 text-center text-gray-400 text-sm',
};

export const btn = {
  update:     'text-xs px-3 py-1.5 rounded-lg border border-violet-300 text-violet-600 bg-white shadow-[0_3px_0_0_rgba(109,40,217,0.15)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_rgba(109,40,217,0.1)] active:translate-y-0.5 active:shadow-none transition-all duration-150',
  delete:     'text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500 bg-white shadow-[0_3px_0_0_rgba(220,38,38,0.15)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_rgba(220,38,38,0.1)] active:translate-y-0.5 active:shadow-none transition-all duration-150',
  deleteSoft: 'text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-400 bg-white shadow-[0_3px_0_0_rgba(220,38,38,0.1)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_rgba(220,38,38,0.08)] active:translate-y-0.5 active:shadow-none transition-all duration-150',
  create:     'flex items-center gap-2 bg-[#1C1C2E] hover:bg-[#2a2a40] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors',
  search:     'bg-[#1C1C2E] hover:bg-[#2a2a40] text-white text-sm px-4 py-1.5 rounded-xl transition-colors',
  clear:      'text-sm text-gray-400 hover:text-gray-600',
  retry:      'mt-4 px-5 py-2 bg-[#1C1C2E] text-white text-sm rounded-xl hover:bg-[#2a2a40] transition-colors',
  actions:    'flex items-center gap-2',
};

export const input = {
  search: 'border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-700 outline-none',
  field:  'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-400',
};

export const modal = {
  overlay:     'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
  overlayDark: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4',
  box:         'bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4',
  boxSm:       'bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6',
  boxMd:       'bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden',
  boxLg:       'bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden',
  header:      'flex items-center justify-between px-6 py-4 border-b border-gray-100',
  title:       'text-base font-semibold text-gray-800',
  closeBtn:    'text-gray-400 hover:text-gray-600 text-lg leading-none',
  body:        'px-6 py-5 flex flex-col gap-5',
  footer:      'flex gap-3 justify-end',
  btnCancel:   'px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors',
  btnDelete:   'px-4 py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors',
  btnSave:     'px-4 py-2 text-sm rounded-xl bg-[#1C1C2E] text-white hover:bg-[#2a2a40] disabled:opacity-50 transition-colors',
  spinner:     'w-8 h-8 border-4 border-gray-200 border-t-[#1C1C2E] rounded-full animate-spin',
  deleteIcon:  'flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4',
};

export const badge = {
  gray:   'text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium',
  green:  'text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium',
  red:    'text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200 font-medium',
};
