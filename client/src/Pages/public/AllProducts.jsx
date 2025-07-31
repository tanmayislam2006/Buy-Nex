import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // Ensure react-router-dom is installed and used for Link
import useAxios from "../../Hooks/useAxios";

// Import icons (these are static and not fetched from DB, so they remain here)
import {
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBasketballBall,
  FaBook,
  FaMobile,
  FaShoppingCart,
} from "react-icons/fa";

// Static icon mapping for categories (since icons are React components)
const categoryIcons = {
  Electronics: <FaLaptop />,
  Fashion: <FaTshirt />,
  "Home & Kitchen": <FaCouch />,
  "Sports & Outdoors": <FaBasketballBall />,
  Books: <FaBook />,
  Mobile: <FaMobile />,
  // Add other categories and their icons as needed
};

// Tags and Ratings can remain hardcoded or be fetched from a static endpoint if preferred.
const tags = [
  "New",
  "Sale",
  "Trending",
  "Wireless",
  "Eco-friendly",
  "Premium",
  "Bestseller",
  "Durable",
  "Smart",
  "Compact",
];

const ratings = [4, 3, 2];

const AllProducts = () => {
  const axiosInstance = useAxios();

  // State for filters and pagination
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 2000]); // Default max price
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [limit, setLimit] = useState(8); // Products per page

  // Fetch all data in a single query
  const {
    data: allProductData,
    isLoading,
    isError,
    error,
    refetch, // Use refetch to trigger a new query
  } = useQuery({
    queryKey: [
      "allProductData",
      selectedCategory,
      selectedBrand,
      selectedRating,
      priceRange,
      sortBy,
      page,
      limit,
    ],
    queryFn: async () => {
      const params = {
        page,
        limit,
        sortBy,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (selectedRating) params.minRating = selectedRating;
      // Only include price range params if they are not default
      if (priceRange[0] !== 0) params.minPrice = priceRange[0];
      if (priceRange[1] !== 2000) params.maxPrice = priceRange[1];

      const res = await axiosInstance.get("/api/all-product-data", { params });
      return res.data;
    },
    keepPreviousData: true, // Helps in smoother UI transitions during pagination/filtering
  });

  const products = allProductData?.products || [];
  const totalProducts = allProductData?.totalProducts || 0;
  const currentPage = allProductData?.currentPage || 1;
  const totalPages = allProductData?.totalPages || 1;
  const categoriesWithCounts = allProductData?.categoryCounts?.map((cat) => ({
    ...cat,
    icon: categoryIcons[cat.name] || null, // Attach icon from static mapping
  })) || [];
  const brandsWithCounts = allProductData?.brandCounts || [];

  // Recalculate max price for price range filter if needed, or get from server metadata
  // useEffect(() => {
  //   // You might fetch maxPrice from a separate API or from the initial allProductData if available
  //   // For now, assuming a fixed max range for the input field.
  // }, [allProductData]);

  if (isLoading) {
    return <p className="text-center py-10">Loading products and filters...</p>;
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Error loading data: {error.message}</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-8 max-w-[1600px] mx-auto lg:pt-32">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 bg-white rounded-lg p-6 shadow-sm mb-4 lg:mb-0">
        <h2 className="font-bold mb-4">Filters</h2>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Price Range
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                setPriceRange([+e.target.value, priceRange[1]]);
                setPage(1); // Reset page on filter change
              }}
              className="w-16 border rounded px-2 py-1"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                setPriceRange([priceRange[0], +e.target.value]);
                setPage(1); // Reset page on filter change
              }}
              className="w-16 border rounded px-2 py-1"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Categories</label>
          <ul>
            {categoriesWithCounts.map((cat) => (
              <li key={cat.name}>
                <button
                  className={`flex justify-between w-full text-left px-2 py-1 rounded ${
                    selectedCategory === cat.name
                      ? "bg-orange-100 text-primary"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPage(1); // Reset page on filter change
                  }}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400">({cat.count})</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="text-xs text-gray-500 mt-1"
                onClick={() => {
                  setSelectedCategory("");
                  setPage(1); // Reset page on filter change
                }}
              >
                Show all
              </button>
            </li>
          </ul>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Brands</label>
          <ul>
            {brandsWithCounts.map((brand) => (
              <li key={brand.name}>
                <button
                  className={`flex justify-between w-full text-left px-2 py-1 rounded ${
                    selectedBrand === brand.name
                      ? "bg-orange-100 text-primary"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedBrand(brand.name);
                    setPage(1); // Reset page on filter change
                  }}
                >
                  <span>{brand.name}</span>
                  <span className="text-xs text-gray-400">({brand.count})</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="text-xs text-gray-500 mt-1"
                onClick={() => {
                  setSelectedBrand("");
                  setPage(1); // Reset page on filter change
                }}
              >
                Show all
              </button>
            </li>
          </ul>
        </div>

        {/* Ratings */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Customer Ratings
          </label>
          <ul>
            {ratings.map((r) => (
              <li key={r}>
                <button
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    selectedRating === r ? "bg-orange-100 text-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedRating(r);
                    setPage(1); // Reset page on filter change
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < r ? "★" : "☆"}</span>
                  ))}
                  <span className="ml-1 text-xs">&amp; up</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="text-xs text-gray-500 mt-1"
                onClick={() => {
                  setSelectedRating(0);
                  setPage(1); // Reset page on filter change
                }}
              >
                Show all
              </button>
            </li>
          </ul>
        </div>

        {/* Tags (assuming these are still static for now) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Popular Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">All Products</h1>
          <p className="text-gray-500 text-sm">
            Browse our complete collection
          </p>
        </div>

        {/* Category Swiper (now uses dynamically fetched categories) */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesWithCounts.map((cat) => (
            <div key={cat.name}>
              <div
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setPage(1); // Reset page on filter change
                }}
                className={`flex flex-col items-center justify-center text-sm p-3 rounded-xl shadow-md w-full h-24 transition hover:scale-105 cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <span>{cat.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Products Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Showing {products.length} of {totalProducts} products
          </span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1); // Reset page on sort change
            }}
          >
            <option value="Newest">Newest</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                to={`/product-details/${product._id}`} 
                key={product._id} 
                className="bg-white rounded-lg shadow-sm p-4 relative flex flex-col"
              >
                {product.tags && product.tags.length > 0 && (
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">
                    {product.tags[0]}{" "}
                  </span>
                )}
                <div className="h-24 sm:h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-3xl text-gray-300">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-contain max-h-full max-w-full"
                    />
                  ) : (
                    <img
                      src="https://img.icons8.com/windows/64/shopping-cart-loaded--v1.png"
                      alt="No image available"
                      className="object-contain max-h-full max-w-full"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    ({product.reviews})
                  </span>
                </div>
                <div className="font-semibold text-sm">{product.name}</div>
                <div className="text-xs text-gray-500 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.description}
                </div>
                <div className="flex items-center gap-2 mb-3 mt-auto">
                  <span className="text-base font-bold">
                    ${product.price?.toFixed(2) || "N/A"}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm line-through text-gray-400">
                      ${product.oldPrice?.toFixed(2) || "N/A"}
                    </span>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No products found matching your criteria.</p>
          )}
        </div>

        {/* Pagination */}
        {totalProducts > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="px-3 py-1 rounded border"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1 ? "bg-primary text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="px-3 py-1 rounded border"
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProducts;