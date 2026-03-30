export const styles = {
  page: 'relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-white',

  // Card — replaced by animated glass card in AuthForm.jsx (kept for reference)
  card: 'relative z-10 w-full max-w-sm',

  // Tabs
  tabWrapper:  'flex rounded-lg border border-gray-200 mb-5 overflow-hidden',
  tabActive:   'flex-1 py-2 text-sm font-semibold transition-all bg-gray-900 text-white',
  tabInactive: 'flex-1 py-2 text-sm font-semibold transition-all text-gray-400 bg-transparent hover:text-gray-700',

  // Input fields — light style
  fieldWrapper:   'mb-3',
  fieldWrapperSm: 'mb-2',
  fieldWrapperLg: 'mb-4',
  inputWrapper:   'relative flex items-center',
  input:          'w-full bg-gray-50 border border-gray-200 focus:border-gray-400 text-gray-900 placeholder:text-gray-400 h-10 rounded-lg pl-10 pr-3 text-sm outline-none transition-all duration-300 focus:bg-white',
  inputIcon:      'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
  errorText:      'text-red-500 text-xs mt-1 pl-1',
  serverError:    'text-red-500 text-xs mb-3 text-center',

  // Login form elements
  forgotWrapper: 'text-right mb-4',
  forgotLink:    'text-xs text-gray-400 cursor-pointer hover:text-gray-700 transition-colors',
  submitBtn:     'w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold h-10 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-1',
  footerText:    'text-center text-xs text-gray-400 mt-5',
  footerLink:    'text-gray-900 font-semibold cursor-pointer hover:text-gray-600 transition-colors underline-offset-2 hover:underline',

  // Title inside card
  title: 'text-xl font-bold text-center text-gray-900 mb-1',
};
