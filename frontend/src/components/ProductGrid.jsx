import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { styles } from './ProductGrid.styles';
import SlidingPagination from './ui/sliding-pagination';

// ProductGrid shows a grid of products with loading skeletons and pagination.
// Props:
//   products     - array of product objects to display
//   loading      - true while data is being fetched
//   page         - current page number (starts at 0)
//   totalPages   - total number of pages
//   onPageChange - function to call when the user clicks a page button
//   emptyIcon    - emoji shown when there are no products
//   emptyMessage - text shown when there are no products

const ProductGrid = ({
  products,
  loading,
  page,
  totalPages,
  onPageChange,
  onProductClick,
  emptyIcon = '🔍',
  emptyMessage = 'No products found.',
}) => {

  // Initial load — no products yet, show skeletons
  if (loading && products.length === 0) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div className={styles.empty.wrapper}>
        <p className={styles.empty.icon}>{emptyIcon}</p>
        <p className={styles.empty.message}>{emptyMessage}</p>
      </div>
    );
  }

  // Products — keep visible during page transitions, dim while loading
  return (
    <>
      <div
        className={styles.grid}
        style={{ transition: 'opacity 0.2s ease', opacity: loading ? 0.4 : 1 }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <SlidingPagination
            totalPages={totalPages}
            currentPage={page + 1}
            onPageChange={(p) => onPageChange(p - 1)}
            maxVisiblePages={9}
          />
        </div>
      )}
    </>
  );
};

export default ProductGrid;
