import React from "react";
import { Link } from "react-router";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-[#ffffff] rounded-2xl p-4 shadow">
      <div className="overflow-hidden rounded-xl h-60 sm:h-72  lg:h-96">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/E0E0E0/333333?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="pt-4 px-1 space-y-2">
        <p className="text-sm text-gray-400">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
          <span className="mx-1">-</span> {blog.category}
        </p>
        <h2 className="text-lg font-semibold text-gray-800 leading-snug">
          {blog.title}
        </h2>
        <Link
          to={`/blog/${blog._id}`}
          className="inline-flex items-center text-primary font-semibold hover:underline text-sm group"
        >
          Read More{" "}
          <span className="ml-1 group-hover:translate-x-1 transition-transform">
            &raquo;
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
