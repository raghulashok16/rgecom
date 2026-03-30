export const categoryImages = {
  1: 'https://i.ibb.co/20NRZ63f/pexels-pixabay-356056.jpg', // Electronics
  2: 'https://cdn-icons-png.flaticon.com/512/863/863684.png',  // Clothing
  3: 'https://cdn-icons-png.flaticon.com/512/207/207114.png',  // Books
  4: 'https://cdn-icons-png.flaticon.com/512/826/826028.png',  // Home & Kitchen
  5: 'https://cdn-icons-png.flaticon.com/512/857/857441.png',  // Sports
  6: 'https://cdn-icons-png.flaticon.com/512/3082/3082053.png',// Toys & Games
  7: 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png',// Beauty & Health
  8: 'https://cdn-icons-png.flaticon.com/512/743/743955.png',  // Automotive & Parts
};

export const getCategoryImage = (categoryId) =>
  categoryImages[categoryId] || 'https://cdn-icons-png.flaticon.com/512/679/679922.png';
