export const styles = {
  // Layout
  layout:          'flex h-[calc(100vh-65px)] bg-[#F4F5F7] overflow-hidden',

  // Sidebar
  sidebar:         'w-60 bg-[#1C1C2E] text-white flex flex-col shrink-0',
  sidebarHeader:   'px-5 py-5 border-b border-white/10',
  sidebarTitle:    'text-xs font-semibold text-white/40 uppercase tracking-widest',
  sidebarNav:      'flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-0.5',

  navBtnBase:      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 relative',
  navBtnActive:    'bg-white/10 text-white font-medium',
  navBtnInactive:  'text-white/50 hover:bg-white/5 hover:text-white/80',
  navBtnDot:       'absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full',

  // Main
  main:            'flex-1 flex flex-col overflow-hidden',

  // Top header bar inside main
  topBar:          'flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shrink-0',
  topBarTitle:     'text-base font-semibold text-gray-800',
  topBarRight:     'flex items-center gap-3',
  topBarSearch:    'flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 w-52',
  topBarSearchInput:'text-sm text-gray-700 bg-transparent outline-none flex-1 placeholder:text-gray-400',
  topBarBadge:     'bg-violet-100 text-violet-600 text-xs font-semibold px-2.5 py-1 rounded-lg',

  // Orders sub-tab bar
  orderTabBar:     'flex items-center justify-between border-b border-gray-100 bg-white px-6 py-0 shrink-0',
  orderTabBtnBase: 'flex items-center gap-1.5 px-3 py-3 text-sm border-b-2 transition-colors',
  orderTabActive:  'border-violet-500 text-violet-600 font-medium',
  orderTabDefault: 'border-transparent text-gray-400 hover:text-gray-600',

  // Search/filter row
  orderSearch:     'flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-1.5 bg-white',
  orderSearchInput:'text-sm text-gray-700 outline-none w-40',
  monthInput:      'border rounded-xl py-1.5 text-xs outline-none transition-colors',
  monthInputActive:'border-violet-400 text-violet-600 font-medium px-2',
  monthInputEmpty: 'border-gray-200 px-1 w-8',
  monthClearBtn:   'text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 border border-gray-200 rounded-xl',
};
