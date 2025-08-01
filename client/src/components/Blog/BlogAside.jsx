import React from "react";
import { Link } from "react-router";
import SidebarPost from "./SidebarPost";
import useBlogs from "../../Hooks/useBlogs";

const BlogAside = () => {
  const {
    recentArticles,
    categories,
    handleInputChange,
    handleCategoryChange,
    category,
  } = useBlogs();

  return (
    <aside className="h-fit sticky top-24 right-0 space-y-4 lg:space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          onChange={handleInputChange}
          placeholder="Search by blog title"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
        />
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </div>
      {/* Recent Articles */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-5 border-b pb-3 border-gray-200">
          Recent Articles
        </h2>{" "}
        <div className="space-y-6">
          {recentArticles.map((post, index) => (
            <Link to={`/blog/${post._id}`} key={index}>
              <SidebarPost post={post} />
            </Link>
          ))}
        </div>
      </div>
      {/* Categories */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-5 border-b pb-3 border-gray-200">
          Categories
        </h2>
        <ul className="space-y-3 text-base text-gray-700">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleCategoryChange({ target: { value: cat } })}
                className={`block w-full text-left transition-colors duration-200 cursor-pointer ${category === cat ? 'text-primary font-bold' : 'hover:text-primary'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default BlogAside;
