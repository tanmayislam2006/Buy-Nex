import React from "react";
import { Link, Outlet } from "react-router";
import SidebarPost from "./SidebarPost";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../Loading";

const BlogLayout = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs-details"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/articles-category`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

    
    
  const { recentArticles, categories } = data || {};
console.log(categories);
  return (
    <div className="font-sans antialiased min-h-screen px-4 lg:px-0">
      <section className="container mx-auto py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 ">
            <Outlet />
          </div>
          {/* Right Sidebar */}
          <aside className="h-fit sticky top-24 right-0 space-y-4 lg:space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Our Blog"
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
                  <SidebarPost key={index} post={post} />
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
                    <Link
                      to="/blogs"
                      className="block hover:text-blue-600 transition-colors duration-200"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogLayout;
