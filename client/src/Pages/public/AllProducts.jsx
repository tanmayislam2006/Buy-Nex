import React, { useState } from "react";
import {
  FaShoppingCart,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBasketballBall,
  FaBook,
  FaMobile,
  FaHeadphones,
  FaWatch,
  FaTabletAlt,
  FaCamera,
  FaGamepad,
  FaTv,
  FaBlender,
  FaToaster,
  FaShirt,
  FaJeans,
  FaRunning,
  FaFootballBall,
  FaDumbbell,
  FaHeartbeat,
  FaGraduationCap,
  FaGlobe,
  FaPaintBrush,
} from "react-icons/fa";

// Category data with icons
const categories = [
  { name: "Electronics", count: 7, icon: <FaLaptop /> },
  { name: "Fashion", count: 5, icon: <FaTshirt /> },
  { name: "Home & Kitchen", count: 4, icon: <FaCouch /> },
  { name: "Sports & Outdoors", count: 3, icon: <FaBasketballBall /> },
  { name: "Books", count: 3, icon: <FaBook /> },
  { name: "Mobile", count: 2, icon: <FaMobile /> },
];

const brands = [
  { name: "Apple", count: 3 },
  { name: "Samsung", count: 4 },
  { name: "Nike", count: 2 },
  { name: "Adidas", count: 1 },
  { name: "Sony", count: 2 },
  { name: "Dell", count: 1 },
  { name: "Xiaomi", count: 1 },
  { name: "Bose", count: 1 },
  { name: "LG", count: 1 },
  { name: "KitchenAid", count: 1 },
];

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
    image: <FaHeadphones />,
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
    image: <FaWatch />,
  },
  {
    id: 3,
    name: "Ultra Slim Laptop",
    category: "Electronics",
    brand: "Dell",
    price: 899.99,
    oldPrice: 1099.99,
    rating: 4.7,
    reviews: 56,
    tag: "",
    desc: "15.6” Full HD Display",
    image: <FaLaptop />,
  },
  {
    id: 4,
    name: "Premium Smartphone",
    category: "Mobile",
    brand: "Apple",
    price: 749.99,
    oldPrice: 849.99,
    rating: 4.9,
    reviews: 112,
    tag: "Bestseller",
    desc: "128GB, Unlocked",
    image: <FaMobile />,
  },
  {
    id: 5,
    name: "4K Smart TV",
    category: "Electronics",
    brand: "LG",
    price: 499.99,
    oldPrice: 699.99,
    rating: 4.2,
    reviews: 78,
    tag: "Sale",
    desc: "Vibrant Colors, Smart Features",
    image: <FaTv />,
  },
  {
    id: 6,
    name: "Digital Camera DSLR",
    category: "Electronics",
    brand: "Sony",
    price: 599.99,
    oldPrice: 750.00,
    rating: 4.3,
    reviews: 35,
    tag: "New",
    desc: "Professional Photography",
    image: <FaCamera />,
  },
  {
    id: 7,
    name: "Gaming Console Pro",
    category: "Electronics",
    brand: "Sony",
    price: 399.99,
    oldPrice: 450.00,
    rating: 4.6,
    reviews: 92,
    tag: "Trending",
    desc: "Immersive Gaming Experience",
    image: <FaGamepad />,
  },
  {
    id: 8,
    name: "Classic Denim Jeans",
    category: "Fashion",
    brand: "Nike",
    price: 49.99,
    oldPrice: 65.00,
    rating: 3.8,
    reviews: 21,
    tag: "Durable",
    desc: "Comfortable & Stylish Fit",
    image: <FaJeans />,
  },
  {
    id: 9,
    name: "Casual T-Shirt (Men's)",
    category: "Fashion",
    brand: "Adidas",
    price: 24.99,
    oldPrice: 30.00,
    rating: 4.1,
    reviews: 15,
    tag: "Eco-friendly",
    desc: "Soft Cotton Fabric",
    image: <FaShirt />,
  },
  {
    id: 10,
    name: "Elegant Sofa Set",
    category: "Home & Kitchen",
    brand: "Samsung",
    price: 1200.00,
    oldPrice: 1500.00,
    rating: 4.8,
    reviews: 30,
    tag: "Premium",
    desc: "Luxurious Comfort for Your Living Room",
    image: <FaCouch />,
  },
  {
    id: 11,
    name: "High-Performance Blender",
    category: "Home & Kitchen",
    brand: "KitchenAid",
    price: 129.99,
    oldPrice: 150.00,
    rating: 4.4,
    reviews: 25,
    tag: "New",
    desc: "Smoothies and More",
    image: <FaBlender />,
  },
  {
    id: 12,
    name: "Compact Toaster Oven",
    category: "Home & Kitchen",
    brand: "Samsung",
    price: 79.99,
    oldPrice: 99.99,
    rating: 3.9,
    reviews: 18,
    tag: "Compact",
    desc: "Perfect for Small Kitchens",
    image: <FaToaster />,
  },
  {
    id: 13,
    name: "Yoga Mat Pro",
    category: "Sports & Outdoors",
    brand: "Nike",
    price: 29.99,
    oldPrice: 35.00,
    rating: 4.2,
    reviews: 10,
    tag: "New",
    desc: "Non-slip Surface for All Workouts",
    image: <FaHeartbeat />,
  },
  {
    id: 14,
    name: "Basketball - Official Size",
    category: "Sports & Outdoors",
    brand: "Adidas",
    price: 34.99,
    oldPrice: 40.00,
    rating: 4.0,
    reviews: 14,
    tag: "",
    desc: "Durable for Indoor and Outdoor Play",
    image: <FaBasketballBall />,
  },
  {
    id: 15,
    name: "Best-Selling Novel",
    category: "Books",
    brand: "N/A",
    price: 15.99,
    oldPrice: 19.99,
    rating: 4.6,
    reviews: 60,
    tag: "Bestseller",
    desc: "A Captivating Story",
    image: <FaBook />,
  },
  {
    id: 16,
    name: "Beginner's Guide to React",
    category: "Books",
    brand: "N/A",
    price: 25.00,
    oldPrice: 30.00,
    rating: 4.1,
    reviews: 22,
    tag: "New",
    desc: "Learn Modern Web Development",
    image: <FaGraduationCap />,
  },
  {
    id: 17,
    name: "Travel Guide - World Edition",
    category: "Books",
    brand: "N/A",
    price: 22.50,
    oldPrice: 28.00,
    rating: 4.3,
    reviews: 17,
    tag: "Trending",
    desc: "Explore the Globe",
    image: <FaGlobe />,
  },
  {
    id: 18,
    name: "Designer Handbag",
    category: "Fashion",
    brand: "Samsung", // Example, not a real fashion brand for Samsung
    price: 199.99,
    oldPrice: 250.00,
    rating: 4.5,
    reviews: 38,
    tag: "Premium",
    desc: "Stylish and Spacious",
    image: <FaTshirt />, // Using T-shirt as a generic fashion icon
  },
  {
    id: 19,
    name: "Sport Running Shoes",
    category: "Sports & Outdoors",
    brand: "Nike",
    price: 85.00,
    oldPrice: 100.00,
    rating: 4.4,
    reviews: 45,
    tag: "Sale",
    desc: "Lightweight and Responsive",
    image: <FaRunning />,
  },
  {
    id: 20,
    name: "Art Painting Kit",
    category: "Home & Kitchen", // Could also be 'Hobbies' or 'Crafts'
    brand: "N/A",
    price: 39.99,
    oldPrice: 45.00,
    rating: 3.7,
    reviews: 9,
    tag: "New",
    desc: "Unleash Your Creativity",
    image: <FaPaintBrush />,
  },
  {
    id: 21,
    name: "Entry-Level Smartphone",
    category: "Mobile",
    brand: "Xiaomi",
    price: 199.99,
    oldPrice: 220.00,
    rating: 3.9,
    reviews: 55,
    tag: "Sale",
    desc: "Affordable and Functional",
    image: <FaMobile />,
  },
  {
    id: 22,
    name: "Wireless Earbuds",
    category: "Electronics",
    brand: "Bose",
    price: 149.99,
    oldPrice: 180.00,
    rating: 4.7,
    reviews: 70,
    tag: "Wireless",
    desc: "Crisp Audio, All-Day Comfort",
    image: <FaHeadphones />,
  },
];

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest"); // Added state for sorting

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
  }).sort((a, b) => { // Added sorting logic
    if (sortBy === "Newest") {
      return b.id - a.id; // Assuming higher ID means newer
    } else if (sortBy === "Price: Low to High") {
      return a.price - b.price;
    } else if (sortBy === "Price: High to Low") {
      return b.price - a.price;
    }
    return 0;
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
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPage(1); // Reset page on filter change
                  }}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.count}</span>
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
            {brands.map((brand) => (
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
                  <span className="text-xs text-gray-400">{brand.count}</span>
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
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
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
                {product.image || '🛒'} {/* Use specific image if available, else generic cart */}
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