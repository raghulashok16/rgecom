export const styles = {
  pageOuter: 'relative min-h-screen bg-white overflow-hidden',
  page: 'relative z-10 max-w-7xl mx-auto px-6 py-10',

  toolbar: 'flex items-center justify-between mb-6 gap-4',

  search: {
    wrapper: 'flex items-center gap-2',
    input:   'border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none w-64 focus:border-gray-400 transition-colors',
    button:  'bg-gray-900 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors',
    clear:   'text-sm text-gray-400 hover:text-gray-600 transition-colors',
  },

  sort: {
    wrapper:  'flex items-center gap-3',
    pageInfo: 'text-sm text-gray-400 whitespace-nowrap',
    select:   'border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer',
  },
};
