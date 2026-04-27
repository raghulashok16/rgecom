export const styles = {
  card: 'bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow',
  imageWrapper: 'relative p-6 flex items-center justify-center min-h-52 bg-gray-100',
  badge: 'absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide',
  image: 'max-h-44 object-contain',
  info: 'p-3',
  name: 'text-sm text-gray-900 font-medium line-clamp-2 mb-1',
  price: 'text-sm text-gray-600',
  skeleton: {
    card: 'bg-gray-100 rounded-lg overflow-hidden',
    imageArea: 'min-h-52 bg-gray-200 animate-pulse',
    info: 'p-3 space-y-2',
    line1: 'h-3 bg-gray-200 rounded animate-pulse w-3/4',
    line2: 'h-3 bg-gray-200 rounded animate-pulse w-1/3',
  },
};
