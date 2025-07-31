import React from "react";

const blogs = [
  {
    id: 1,
    image: "https://i.ibb.co/TPD5b0F/blog1.jpg",
    date: "June 30, 2025",
    category: "Fashion",
    title: "Marketing Guide: 5 Steps to Success to way.",
  },
  {
    id: 2,
    image: "https://i.ibb.co/tM5nKtX/blog2.jpg",
    date: "April 02, 2025",
    category: "Cosmetics",
    title: "Best way to solve business issue in market.",
  },
  {
    id: 3,
    image: "https://i.ibb.co/TPD5b0F/blog1.jpg",
    date: "May 21, 2025",
    category: "Fashion",
    title: "Top trends to follow in 2025.",
  },
];

const recentPosts = [
  {
    image: "https://i.ibb.co/NZ9tj0s/blog3.jpg",
    title: "The Best Fashion Influencers.",
    date: "February 10, 2025–2026",
    tag: "Organic",
  },
  {
    image: "https://i.ibb.co/NZ9tj0s/blog3.jpg",
    title: "Vogue Shopping Weekend.",
    date: "March 14, 2025–2026",
    tag: "Fruits",
  },
  {
    image: "https://i.ibb.co/NZ9tj0s/blog3.jpg",
    title: "Fashion Market Reveals Her Jacket.",
    date: "June 09, 2025–2026",
    tag: "Vegetables",
  },
];

const BlogCard = ({ blog }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <img
      src={blog.image}
      alt={blog.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <p className="text-xs text-gray-500">
        {blog.date} - {blog.category}
      </p>
      <h2 className="text-lg font-semibold text-gray-800 mt-1 mb-2">
        {blog.title}
      </h2>
      <a href="#" className="text-sm text-blue-600 font-medium hover:underline">
        Read More →
      </a>
    </div>
  </div>
);

const SidebarPost = ({ post }) => (
  <div className="flex gap-3 items-start">
    <img
      src={post.image}
      alt={post.title}
      className="w-14 h-14 rounded object-cover"
    />
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold text-gray-800">{post.title}</h3>
      <span className="text-xs text-gray-500">{post.date}</span>
      <span className="text-xs text-blue-500">– {post.tag}</span>
    </div>
  </div>
);

const Blogs = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left (Main Blog Grid) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-8">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Our Blog"
              className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
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
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Articles</h2>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <SidebarPost key={index} post={post} />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="hover:text-primary">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Cosmetics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Lifestyle
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Marketing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Tips & Tricks
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Blogs;
