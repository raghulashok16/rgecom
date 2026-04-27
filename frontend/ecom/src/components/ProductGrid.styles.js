export const styles = {
  grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',

  empty: {
    wrapper: 'flex flex-col items-center justify-center py-32 text-center',
    icon: 'text-5xl mb-4',
    message: 'text-gray-500 text-sm',
  },

  pagination: {
    wrapper: 'flex items-center justify-center gap-2 mt-10',
    prevNext: 'px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors',
    pageActive: 'w-9 h-9 text-sm rounded-lg border transition-colors bg-gray-900 text-white border-gray-900',
    pageInactive: 'w-9 h-9 text-sm rounded-lg border transition-colors border-gray-200 text-gray-600 hover:bg-gray-100',
  },
};
