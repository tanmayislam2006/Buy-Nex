import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBasketballBall,
  FaBook,
  FaMobile,
  FaShoppingCart,
} from "react-icons/fa";
import useAxios from "../../../Hooks/useAxios";
import ProductFilters from "./ProductFilters";
import Loading from "../../../components/Loading";

// Category icon mapping
const categoryIcons = {
  Electronics: <FaLaptop />,
  Fashion: <FaTshirt />,
  "Home & Living": <FaCouch />,
  "Sports & Outdoors": <FaBasketballBall />,
  Books: <FaBook />,
  Mobile: <FaMobile />,
};

const AllProducts = () => {
  const axiosInstance = useAxios();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const limit = 8;

  const {
    data: allProductData,
    isLoading,
    isError,
    error,
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
      const params = { page, limit, sortBy };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (selectedRating) params.minRating = selectedRating;
      if (priceRange[0] !== 0) params.minPrice = priceRange[0];
      if (priceRange[1] !== 2000) params.maxPrice = priceRange[1];

      const res = await axiosInstance.get("/all-product-data", { params });
      return res.data;
    },
    keepPreviousData: true,
  });

  const products = allProductData?.products || [];
  const totalProducts = allProductData?.totalProducts || 0;
  const currentPage = allProductData?.currentPage || 1;
  const totalPages = allProductData?.totalPages || 1;
  const categoriesWithCounts =
    allProductData?.categoryCounts?.map((cat) => ({
      ...cat,
      icon: categoryIcons[cat.name] || null,
    })) || [];
  const brandsWithCounts = allProductData?.brandCounts || [];

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedRating(0);
    setPriceRange([0, 200]);
    setPage(1);
    setSortBy("Newest");
  };

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Error loading data: {error.message}
      </p>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto lg:pt-32">
      {/* Drawer toggle for mobile */}
      <div className="flex justify-end lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:block w-full lg:w-64 bg-white rounded-lg p-6 shadow-sm">
          <ProductFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            categoriesWithCounts={categoriesWithCounts}
            brandsWithCounts={brandsWithCounts}
            handleResetFilters={handleResetFilters}
          />
        </aside>

        {/* Drawer for small devices */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0  bg-opacity-40 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-sm bg-gray-200 px-2 py-1 rounded"
                >
                  Close
                </button>
              </div>
              <ProductFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                categoriesWithCounts={categoriesWithCounts}
                brandsWithCounts={brandsWithCounts}
                handleResetFilters={handleResetFilters}
              />
            </div>
          </>
        )}

        {/* Main Section */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-2">All Products</h1>
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesWithCounts.map((cat) => (
              <div key={cat.name}>
                <div
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPage(1);
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

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Showing {products.length} of {totalProducts} products
            </span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="Newest">Newest</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product-details/${product._id}`}
                  className="bg-white rounded-lg shadow-sm p-4 flex flex-col"
                >
                  <div className="h-24 sm:h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-3xl text-gray-300">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-contain max-h-full max-w-full"
                      />
                    ) : (
                      <FaShoppingCart />
                    )}
                  </div>
                  <div className="font-semibold text-sm mb-1">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.description}
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
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-base font-bold">
                      ${product.price?.toFixed(2) || "N/A"}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm line-through text-gray-400">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="px-3 py-1 rounded border cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded border cursor-pointer ${
                    currentPage === i + 1 ? "bg-primary text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="px-3 py-1 rounded border cursor-pointer"
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllProducts;
