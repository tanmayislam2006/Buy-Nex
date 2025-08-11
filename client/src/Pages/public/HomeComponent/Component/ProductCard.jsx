import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const ProductCard = ({ product, offers, isTrue }) => {
  return (
    <div className={`p-1  flex flex-col border border-gray-300 rounded-2xl bg-white transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] ${isTrue ? "w-[240px]" : "w-full"}`}>
      {/* Image */}
      <div className="p-1 relative">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105"
        />

        {offers && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {offers}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-2 py-1 space-y-1 text-sm text-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="uppercase">{product.category}</span>
          <div className="flex gap-1.5">
            {product.sizes.map((size, i) => (
              <span key={i} className="font-medium">
                {size}
              </span>
            ))}
          </div>
        </div>

        <p className="font-semibold text-gray-800 leading-snug">
          {product.title}
        </p>

        <div className="text-lg font-bold text-gray-900 space-x-2">
          <span>
            {offers && "$" + (product.price - (product.price * offers) / 100)}
          </span>
          <span
            className={`${
              offers && "line-through text-red-400"
            }`}
          >
            ${product.price}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1.5">
            {product.colors.map((c, idx) => (
              <div
                key={idx}
                className="w-5 h-5 border border-gray-300 rounded-full hover:scale-110 transition-transform"
                style={{ backgroundColor: c.color }}
              ></div>
            ))}
          </div>
          <button
            aria-label={product.liked ? "Unlike" : "Like"}
            className="text-xl text-gray-500 hover:text-primary hover:scale-110 transition-all"
          >
            {product.liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
