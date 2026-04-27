import { useState, useEffect } from 'react';
import ProductGrid from '../../components/ProductGrid';
import ErrorPage from '../../components/ErrorPage';
import ProductModal from '../../components/ProductModal';
import { fetchProducts, searchProducts } from '../../api/backendCalls';
import { styles } from './Home.styles';
import { SparklesCore } from '../../components/ui/sparkles';
import SortDropdown from '../../components/ui/SortDropdown';

const SORT_OPTIONS = [
  { value: 'asc',  label: 'Price: Low to High' },
  { value: 'desc', label: 'Price: High to Low' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = searchQuery
          ? await searchProducts(searchQuery, page, 10, sort)
          : await fetchProducts(page, 10, sort);
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message;
        setError({ status, message });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, sort, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchQuery('');
    setError(null);
  };

  if (error) {
    return (
      <ErrorPage
        status={error.status}
        message={error.message}
        onRetry={handleClear}
      />
    );
  }

  return (
    <div className={styles.pageOuter}>
      <SparklesCore
        className="absolute inset-0 pointer-events-none z-0"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={60}
        particleColor={['#ff0000','#ff7700','#ffff00','#00ff00','#0099ff','#6633ff','#ff00ff']}
        speed={1.5}
      />
    <div className={styles.page}>

      {/* Toolbar — hidden when no products and not loading */}
      <div className={`${styles.toolbar} ${!loading && products.length === 0 && !searchQuery ? 'hidden' : ''}`}>
        {/* Search */}
        <div className={styles.search.wrapper}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products..."
            className={styles.search.input}
          />
          <button
            onClick={handleSearch}
            className={styles.search.button}
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={handleClear}
              className={styles.search.clear}
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort + page info */}
        <div className={styles.sort.wrapper}>
          <p className={styles.sort.pageInfo}>
            {loading ? 'Loading...' : `Page ${page + 1} of ${totalPages || 1}`}
          </p>
          <SortDropdown
            value={sort}
            onChange={(v) => { setSort(v); setPage(0); }}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onProductClick={setSelectedProduct}
        emptyIcon="🔍"
        emptyMessage="No products found."
      />

      {/* Product Modal */}
      <ProductModal
        productId={selectedProduct?.id ?? null}
        fallbackProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
    </div>
  );
};

export default Home;
