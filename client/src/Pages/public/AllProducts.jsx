import React, { useState } from "react";
import {
  FaShoppingCart,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBasketballBall,
  FaBook,
  FaMobile,
} from "react-icons/fa";

// Category data with icons
const categories = [
  { name: "Electronics", count: 45, icon: <FaLaptop /> },
  { name: "Fashion", count: 32, icon: <FaTshirt /> },
  { name: "Home & Kitchen", count: 28, icon: <FaCouch /> },
  { name: "Sports & Outdoors", count: 19, icon: <FaBasketballBall /> },
  { name: "Books", count: 24, icon: <FaBook /> },
    { name: "Mobile", count: 34, icon: <FaMobile /> },
];

const brands = [
  { name: "Apple", count: 15 },
  { name: "Samsung", count: 23 },
  { name: "Nike", count: 18 },
  { name: "Adidas", count: 12 },
  { name: "Sony", count: 9 },
];

const tags = ["New", "Sale", "Trending", "Wireless", "Eco-friendly", "Premium"];

const ratings = [4, 3, 2];

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    brand: "Apple",
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.5,
    reviews: 42,
    tag: "New",
    desc: "Premium Sound Quality",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    category: "Electronics",
    brand: "Samsung",
    price: 59.99,
    oldPrice: 79.99,
    rating: 4.0,
    reviews: 28,
    tag: "Sale",
    desc: "Health & Activity Tracker",
  },
  {
    id: 3,
    name: "Ultra Slim Laptop",
    category: "Electronics",
    brand: "Sony",
    price: 899.99,
    oldPrice: 1099.99,
    rating: 4.7,
    reviews: 56,
    tag: "",
    desc: "15.6” Full HD Display",
  },
  {
    id: 4,
    name: "Premium Smartphone",
    category: "Electronics",
    brand: "Apple",
    price: 749.99,
    oldPrice: 849.99,
    rating: 4.9,
    reviews: 112,
    tag: "Bestseller",
    desc: "128GB, Unlocked",
  },
];

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [page, setPage] = useState(1);

  const filteredProducts = products.filter((p) => {
    const inCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const inBrand = selectedBrand ? p.brand === selectedBrand : true;
    const inRating = selectedRating
      ? Math.floor(p.rating) >= selectedRating
      : true;
    const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return inCategory && inBrand && inRating && inPrice;
  });

  const perPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-8 bg-[#fafbfc] max-w-[1600px] mx-auto lg:pt-32">
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
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-16 border rounded px-2 py-1"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-16 border rounded px-2 py-1"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Categories</label>
          <ul>
            {categories.map((cat) => (
              <li key={cat.name}>
                <button
                  className={`flex justify-between w-full text-left px-2 py-1 rounded ${
                    selectedCategory === cat.name
                      ? "bg-orange-100 text-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.count}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="text-xs text-gray-500 mt-1"
                onClick={() => setSelectedCategory("")}
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
            {brands.map((brand) => (
              <li key={brand.name}>
                <button
                  className={`flex justify-between w-full text-left px-2 py-1 rounded ${
                    selectedBrand === brand.name
                      ? "bg-orange-100 text-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedBrand(brand.name)}
                >
                  <span>{brand.name}</span>
                  <span className="text-xs text-gray-400">{brand.count}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="text-xs text-gray-500 mt-1"
                onClick={() => setSelectedBrand("")}
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
                  onClick={() => setSelectedRating(r)}
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
                onClick={() => setSelectedRating(0)}
              >
                Show all
              </button>
            </li>
          </ul>
        </div>

        {/* Tags */}
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

        {/* Category Swiper */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <div key={index}>
              <div
                onClick={() => setSelectedCategory(cat.name)}
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
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </span>
          <select className="border rounded px-2 py-1 text-sm">
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-4 relative flex flex-col"
            >
              {product.tag && (
                <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">
                  {product.tag}
                </span>
              )}
              <div className="h-24 sm:h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-3xl text-gray-300">
                🛒
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
              <div className="text-xs text-gray-500 mb-2">{product.desc}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <button className="mt-auto bg-primary hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition">
                Add to Cart <FaShoppingCart className="inline ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded border"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1 ? "bg-primary text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded border"
          >
            &gt;
          </button>
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
