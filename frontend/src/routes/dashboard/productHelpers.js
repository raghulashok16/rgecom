export const categoryImageById = {
  1: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png',
  2: 'https://cdn-icons-png.flaticon.com/512/863/863684.png',
  3: 'https://cdn-icons-png.flaticon.com/512/207/207114.png',
  4: 'https://cdn-icons-png.flaticon.com/512/826/826028.png',
  5: 'https://cdn-icons-png.flaticon.com/512/857/857441.png',
  6: 'https://cdn-icons-png.flaticon.com/512/3082/3082053.png',
  7: 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png',
  8: 'https://cdn-icons-png.flaticon.com/512/743/743955.png',
};

export const getImage = (product) =>
  product.imageUrl ||
  categoryImageById[product.categoryId] ||
  'https://cdn-icons-png.flaticon.com/512/679/679922.png';
