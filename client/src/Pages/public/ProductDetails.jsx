import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxios from "../../Hooks/useAxios";
import { FaStar, FaBoxOpen, FaComments, FaShoppingCart, FaHeart } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const ProductDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center">Error loading product!</div>;

  // Helper functions
  const renderSpecifications = () => {
    if (!product.specifications) return null;
    
    return Object.entries(product.specifications).map(([key, value]) => (
      <tr key={key} className="border-b border-gray-200">
        <td className="px-4 py-2 w-1/3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
        <td className="px-4 py-2">{value}</td>
      </tr>
    ));
  };

  const renderColorOptions = () => {
    if (!product.specifications?.color) return null;
    
    const colors = product.specifications.color.split(",").map(c => c.trim());
    return (
      <div className="flex gap-2 items-center">
        <strong>Color:</strong>
        <div className="flex gap-2">
          {colors.map((color, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i % (product.images?.length || 1))}
              className="btn btn-sm border-neutral text-accent hover:bg-neutral"
              style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() }}
              aria-label={color}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderImageGallery = () => {
    if (!product.images || product.images.length === 0) {
      return (
        <div className="bg-gray-100 flex items-center justify-center rounded-lg">
          <img
            src="https://via.placeholder.com/600x400?text=No+Image+Available"
            alt="Placeholder"
            className="w-full h-64 object-contain"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnails - vertical on desktop */}
        <div className="hidden md:flex flex-col gap-2 w-20">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-full h-16 rounded border-2 overflow-hidden ${
                selectedImage === i ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        
        {/* Main image */}
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.images[selectedImage % product.images.length]}
            alt={product.name}
            className="w-full h-96 object-contain"
          />
        </div>
        
        {/* Thumbnails - horizontal on mobile */}
        <div className="flex md:hidden gap-2 overflow-x-auto py-2">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                selectedImage === i ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPriceSection = () => {
    const discountPercentage = product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

    return (
      <div className="flex flex-wrap items-center gap-4">
        {/* Current Price */}
        <p className="text-3xl lg:text-4xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>

        {/* Original Price and Discount */}
        {product.oldPrice && product.oldPrice > product.price && (
          <>
            <p className="text-lg text-gray-500 line-through">
              ${product.oldPrice.toFixed(2)}
            </p>
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>
    );
  };

  const renderMetaInfo = () => (
    <div className="flex flex-wrap gap-4 items-center text-gray-700 mt-4 text-sm">
      {/* Stock */}
      <div className="flex items-center gap-1">
        <FaBoxOpen
          className={product.inventory > 0 ? "text-green-600" : "text-red-500"}
          size={18}
        />
        <span className={product.inventory > 0 ? "text-green-600" : "text-red-500"}>
          {product.inventory > 0 ? `${product.inventory} In Stock` : "Out of Stock"}
        </span>
      </div>

      {/* Reviews */}
      <div className="flex items-center gap-1">
        <FaComments className="text-blue-500" size={18} />
        <span>
          {product.reviews > 0
            ? `${product.reviews} Review${product.reviews !== 1 ? "s" : ""}`
            : "No Reviews Yet"}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <FaStar className="text-yellow-500" size={18} />
        <span>
          {product.rating > 0
            ? `${product.rating.toFixed(1)}/5`
            : "No Rating"}
        </span>
      </div>
    </div>
  );

  const renderTags = () => {
    if (!product.tags || product.tags.length === 0) return null;
    
    return (
      <div className="flex gap-2 flex-wrap mt-4">
        {product.tags.map((tag, index) => (
          <span key={index} className="badge badge-outline">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const renderQuantitySelector = () => (
    <div className="flex items-center gap-4 mt-6">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1">{quantity}</span>
        <button
          onClick={() => setQuantity(prev => prev + 1)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
          disabled={quantity >= product.inventory}
        >
          +
        </button>
      </div>
      <button className="btn btn-primary flex items-center gap-2">
        <FaShoppingCart /> Add to Cart
      </button>
      <button className="btn btn-outline">
        <FaHeart />
      </button>
    </div>
  );

  return (
    <div className="py-8 lg:pt-12 max-w-7xl mx-auto px-4">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-primary mb-6"
      >
        <IoMdArrowRoundBack /> Back to Products
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-1">
          {renderImageGallery()}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-accent">
              {product.name}
            </h1>
            {product.brand && product.brand !== "N/A" && (
              <p className="text-lg text-gray-600">Brand: {product.brand}</p>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {renderPriceSection()}
          {renderMetaInfo()}
          {renderColorOptions()}
          {renderTags()}
          {renderQuantitySelector()}
        </div>
      </div>

      {/* Specification Section */}
      <div className="mt-12">
        <h3 className="font-bold text-2xl mb-6 border-b pb-2">Product Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Specification Table */}
          <div>
            <h4 className="font-semibold text-xl mb-4">Specifications</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {product.specifications && (
                    <>
                      <tr>
                        <td
                          colSpan="2"
                          className="bg-gray-100 text-gray-800 font-semibold px-4 py-2"
                        >
                          Product Specifications
                        </td>
                      </tr>
                      {renderSpecifications()}
                    </>
                  )}

                  <tr>
                    <td
                      colSpan="2"
                      className="bg-gray-100 text-gray-800 font-semibold px-4 py-2"
                    >
                      Physical Details
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 w-1/3">Dimensions</td>
                    <td className="px-4 py-2">
                      {product.dimensions.length} x {product.dimensions.width} x{" "}
                      {product.dimensions.height} {product.dimensions.unit}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2">Weight</td>
                    <td className="px-4 py-2">{product.weight} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h4 className="font-semibold text-xl mb-4">Additional Information</h4>
            <div className="space-y-4">
              {product.category && (
                <div>
                  <h5 className="font-medium">Category</h5>
                  <p className="capitalize">{product.category}</p>
                </div>
              )}

              {product.seoKeywords && product.seoKeywords.length > 0 && (
                <div>
                  <h5 className="font-medium">Keywords</h5>
                  <div className="flex flex-wrap gap-2">
                    {product.seoKeywords.map((keyword, i) => (
                      <span key={i} className="badge badge-outline">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.sellerId && (
                <div>
                  <h5 className="font-medium">Sold By</h5>
                  <p>{product.sellerId.replace("seller", "Seller ")}</p>
                </div>
              )}
            </div>
          </div>
          {product.specifications.warranty && (
            <div className="">
              <strong className="lg:text-base">Warranty :</strong>{" "}
              <span className="text-primary">
                {product.specifications.warranty} Warranty. (Please preserve
                your box to claim warranty)
              </span>
            </div>
          )}
          {/* Action Buttons */}
          {/* <div className="mt-10 flex flex-wrap gap-5 ">
            <button
              className=" shadow duration-500 transition btn btn-soft btn-primary px-10"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>

            <button
              className="shadow duration-500 transition btn btn-accent text-white px-10"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
          </div> */}
          
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;