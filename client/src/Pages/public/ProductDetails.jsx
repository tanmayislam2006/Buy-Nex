import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxios from "../../Hooks/useAxios";
import { FaStar, FaBoxOpen, FaComments } from "react-icons/fa";

const sampleProduct = {
  sellerId: "seller123",
  name: "Wireless Bluetooth Headphones",
  description:
    "High-quality wireless Bluetooth headphones with noise cancellation, deep bass, and 20 hours of battery life.",
  oldPrice: 79.99,
  price: 69.99,
  inventory: 10,
  images: [
    "https://assets.gadgetandgear.com/upload/product/20230530_1685430710_183928.jpeg",
    "https://www.startech.com.bd/image/cache/catalog/headphone/fantech/wh01/wh01-01-500x500.jpg",
  ],
  category: "Electronics",
  brand: "Apple",
  specifications: {
    color: "Pink, Black",
    connectivity: "Bluetooth 5.0",
    batteryLife: "20 hours",
    weight: "250g",
    warranty: "1 year",
  },
  averageRating: 4.5,
  reviews: 245,
  tags: ["headphones", "wireless", "bluetooth", "audio"],
  weight: 0.25,
  dimensions: {
    length: 20.0,
    width: 15.0,
    height: 8.0,
    unit: "cm",
  },
  seoKeywords: ["wireless headphones", "bluetooth headset", "noise cancelling"],
};

const ProductDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  // const { data: product, isLoading, isError } = useQuery({
  //   queryKey: ["product", id],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get(`products/${id}`);
  //     return res.data;
  //   },
  //   enabled: !!id,
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error loading product!</p>;

  const product = sampleProduct;

  // colors split from string and trimmed
  const colors = product.specifications.color.split(",").map((c) => c.trim());

  // combine colors + images dynamically
  const colorVariants = colors.map((colorName, index) => ({
    colorName,
    image: product.images[index] || product.images[0], // fallback first image
  }));

  // selected image state
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="py-30 lg:pt-44 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-1 ">
          {/* product image */}
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full max-w-sm md:max-w-md mx-auto rounded-lg shadow-lg"
          />

          {/* Thumbnails */}
          <div className="flex  gap-4 mt-4 justify-center ">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i}`}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img
                    ? "border-orange-500"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4 text-gray-600 text-sm lg:text-base">
          <h1 className="text-2xl lg:text-3xl font-bold text-accent">
            {product.name}
          </h1>
          <p>{product.description}</p>

          {/* price section */}
          <div className="flex items-center gap-4">
            {/* Discount Price */}
            <p className="text-3xl lg:text-4xl font-bold text-primary">
              ${product.price}
            </p>

            {/* Original Price (Strike-through) */}
            <p className="text-lg text-gray-500 line-through">
              ${product.oldPrice}
            </p>
            {/* Discount Badge */}
            <span className="bg-red-600 text-white btn btn-xs rounded-full">
              {(
                ((product.oldPrice - product.price) / product.oldPrice) *
                100
              ).toFixed(2)}{" "}
              %
            </span>
          </div>

          {/* review, stock & rating */}
          <div className="flex gap-8 items-center text-gray-700 mt-4 text-sm">
            {/* Stock */}
            <div className="flex items-center gap-1">
              <FaBoxOpen
                className={
                  product.inventory > 0 ? "text-green-600" : "text-red-500"
                }
                size={18}
              />
              <span
                className={
                  product.inventory > 0 ? "text-green-600" : "text-red-500"
                }
              >
                {product.inventory > 0
                  ? `${product.inventory} In Stock`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-1">
              <FaComments className="text-blue-500" size={18} />
              <span>
                {product.reviews > 0
                  ? `${product.reviews} Reviews`
                  : "No Reviews Yet"}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" size={18} />
              <span>
                {product.averageRating > 0
                  ? `${product.averageRating} `
                  : "No Rating"}
              </span>
            </div>
          </div>

          {/* Color Buttons */}
          <div className="flex gap-2 items-center">
            <strong>Color :</strong>
            <div className="flex gap-2 ">
              {colorVariants.map((variant, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(variant.image)}
                  className={`btn btn-sm transition-all duration-300  ${
                    selectedImage === variant.image
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "border-neutral text-accent hover:bg-neutral"
                  }`}
                >
                  {variant.colorName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specification Title */}
      <h3 className="font-bold text-xl mt-8 mb-4">Specification</h3>

      {/* Specification Table */}
      <table className="w-full border-collapse text-sm">
        <tbody>
          {/* Technical Specification */}
          <tr>
            <td
              colSpan="2"
              className="bg-orange-100 text-orange-700 font-semibold px-4 py-2"
            >
              Technical Specification
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2 w-1/3">Connectivity</td>
            <td className="px-4 py-2">{product.specifications.connectivity}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2">Battery Life</td>
            <td className="px-4 py-2">{product.specifications.batteryLife}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2">Color</td>
            <td className="px-4 py-2">{product.specifications.color}</td>
          </tr>

          {/* Physical Specification */}
          <tr>
            <td
              colSpan="2"
              className="bg-orange-100 text-orange-700 font-semibold px-4 py-2"
            >
              Physical Specification
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2">Dimensions</td>
            <td className="px-4 py-2">
              {product.dimensions.length} x {product.dimensions.width} x{" "}
              {product.dimensions.height} {product.dimensions.unit}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2">Weight</td>
            <td className="px-4 py-2">{product.weight} kg</td>
          </tr>

          {/* Warranty Information */}
          <tr>
            <td
              colSpan="2"
              className="bg-orange-100 text-orange-700 font-semibold px-4 py-2"
            >
              Warranty Information
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2">Warranty</td>
            <td className="px-4 py-2">{product.specifications.warranty}</td>
          </tr>

          {/* SEO Keywords */}
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2 font-medium">SEO Keywords</td>
            <td className="px-4 py-2">{product.seoKeywords.join(", ")}</td>
          </tr>

          {/* Description */}
          <tr>
            <td
              colSpan="2"
              className="bg-orange-100 text-orange-700 font-semibold px-4 py-2"
            >
              Description
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="px-4 py-2 text-gray-700">
              {product.description}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetails;
