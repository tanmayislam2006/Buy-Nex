import React from "react";

const SidebarPost = ({ post }) => {
  return (
    <div className="flex gap-4 items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <img
        src={post.image}
        alt={post.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/64x64/E0E0E0/333333?text=Img";
        }}
      />
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-800 leading-snug">
          {post.title}
        </h3>
        <span className="text-xs text-gray-500 mt-1">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </span>
        <span className="text-xs text-blue-500 font-medium mt-0.5">
          – {post.tag}
        </span>
      </div>
    </div>
  );
};

export default SidebarPost;
