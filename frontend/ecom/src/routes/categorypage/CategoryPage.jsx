import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductGrid from '../../components/ProductGrid';
import ErrorPage from '../../components/ErrorPage';
import ProductModal from '../../components/ProductModal';
import { fetchProductsByCategory } from '../../api/backendCalls';
import { SparklesCore } from '../../components/ui/sparkles';
import SortDropdown from '../../components/ui/SortDropdown';

const SORT_OPTIONS = [
  { value: 'asc',  label: 'Price: Low to High' },
  { value: 'desc', label: 'Price: High to Low' },
];

const CategoryPage = () => {
  const { categoryId } = useParams();
  const categories = useSelector((state) => state.categories.list);
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPage(0);
    setError(null);
    setSearchInput('');
    setSearchQuery('');
  }, [categoryId]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProductsByCategory(categoryId, page, 10, sort);
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
  }, [categoryId, page, sort]);

  const categoryName = categories.find((c) => c.id === Number(categoryId))?.name || `Category ${categoryId}`;

  const filteredProducts = searchQuery
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  if (error) return <ErrorPage status={error.status} message={`Products not found in ${categoryName}`} />;

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <SparklesCore
        className="absolute inset-0 pointer-events-none z-0"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={60}
        particleColor={['#ff0000','#ff7700','#ffff00','#00ff00','#0099ff','#6633ff','#ff00ff']}
        speed={1.5}
      />
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchInput.trim())}
            placeholder="Search products..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none w-64 focus:border-gray-400 transition-colors"
          />
          <button
            onClick={() => setSearchQuery(searchInput.trim())}
            className="bg-gray-900 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => { setSearchInput(''); setSearchQuery(''); }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort + page info */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-400 whitespace-nowrap">
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
        products={filteredProducts}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onProductClick={setSelectedProduct}
        emptyIcon="📦"
        emptyMessage="No products found in this category."
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

export default CategoryPage;
