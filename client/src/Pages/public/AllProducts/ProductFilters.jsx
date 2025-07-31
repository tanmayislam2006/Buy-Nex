import React from "react";
import { FaRepeat } from "react-icons/fa6";

const ratings = [4, 3, 2];
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

const ProductFilters = ({
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedRating,
  setSelectedRating,
  categoriesWithCounts,
  brandsWithCounts,
  handleResetFilters,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold">Filters</h2>
        <button
          onClick={handleResetFilters}
          className="cursor-pointer p-1 rounded-full border border-primary"
        >
          <FaRepeat />
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Price Range</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={1}
            defaultValue={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-16 border rounded px-2 py-1"
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            defaultValue={priceRange[1]}
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
          {categoriesWithCounts.map((cat) => (
            <li key={cat.name}>
              <button
                className={`flex justify-between w-full text-left px-2 py-1 rounded ${
                  selectedCategory === cat.name ? "bg-orange-100 text-primary" : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">({cat.count})</span>
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
          {brandsWithCounts.map((brand) => (
            <li key={brand.name}>
              <button
                className={`flex justify-between w-full text-left px-2 py-1 rounded ${
                  selectedBrand === brand.name ? "bg-orange-100 text-primary" : ""
                }`}
                onClick={() => setSelectedBrand(brand.name)}
              >
                <span>{brand.name}</span>
                <span className="text-xs text-gray-400">({brand.count})</span>
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
        <label className="block text-sm font-semibold mb-2">Customer Ratings</label>
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
        <label className="block text-sm font-semibold mb-2">Popular Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
