import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../Hooks/useAxios";
import { FaStar, FaBoxOpen, FaComments, FaShoppingCart } from "react-icons/fa";
import { IoMdArrowRoundBack, IoMdChatboxes } from "react-icons/io";
import Loading from "../../components/Loading";
import { FiShoppingBag } from "react-icons/fi";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import Chat from "../../components/Chat/Chat";

const ProductDetails = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();
  const axiosInstance = useAxios();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedColor, setSelectedColor] = useState(0);
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
  const { data: similarProducts = [], isLoading: isSimilarLoading } = useQuery({
    queryKey: ["similar-products", product?.category],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/products?category=${product.category}&excludeId=${product._id}`
      );
      return res.data;
    },
    enabled: !!product?.category && !!product?._id,
  });

    useEffect(() => {
      if (!id || !user?.email) return;

      const visitData = {
        productId: id,
        userEmail: user.email,
        sellerEmail: product?.sellerEmail,
      };

      axiosInstance
        .post("/track-visit", visitData)
        .then((res) => {
          console.log("Visitor data recorded:", res.data);
        })
        .catch((err) => {
          console.error("Failed to record visitor:", err);
        });
    }, [id, user, axiosInstance, product?.sellerEmail]);


  if (isLoading || isSimilarLoading) return <Loading />;

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error loading product!
      </div>
    );

  const { _id } = product;
  const cartInfo = {
    productId: _id,
    name: product.name,
    sellerEmail: product.sellerEmail,
    image:
      selectedImage % product.images.length
        ? product.images[selectedImage % product.images.length]
        : product.images[0] ||
          "https://img.icons8.com/windows/96/shopping-cart.png",
    price: product.price,
    quantity,
    userEmail: user?.email,
  };
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      const response = await axiosInstance.post("/cart", cartInfo);
      toast.success("Item added to cart: " + product.name);
    } catch (error) {
      toast.error("Error adding item to cart: " + error.message);
    }
  };
  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      const response = await axiosInstance.post("/cart", cartInfo);
      toast.success("Item added to cart: " + product.name);
      navigate("/orderPage", { state: cartInfo });
    } catch (error) {
      toast.error("Error adding item to cart: " + error.message);
    }
  };


  // Function to handle chat button click
  const handleChat = () => {
    if (!user) {
      toast.error("Please log in to chat with the seller.");
      navigate("/auth/login");
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  // Helper functions
  const renderSpecifications = () => {
    if (!product.specifications) return null;


   
    return Object.entries(product.specifications).map(([key, value]) => (
      <tr key={key} className="border-b border-gray-200">
        <td className="px-4 py-2 w-1/3 capitalize">
          {key.replace(/([A-Z])/g, " $1")}
        </td>
        <td className="px-4 py-2">{value}</td>
      </tr>
    ));
  };

  const renderColorOptions = () => {
    if (!product.specifications?.color) return null;

    const colors = product.specifications.color.split(",").map((c) => c.trim());


    return (
      <div className="flex gap-2 items-center mt-3">
        <strong className="mr-2">Color:</strong>
        <div className="flex gap-2">
          {colors.map((color, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedColor(color);
                setSelectedImage(i % (product.images?.length || 1));
              }}
              className={`btn btn-sm transition duration-300
              ${
                selectedColor === color
                  ? "btn-primary border-primary"
                  : "text-accent"
              }
            `}
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
            src="https://img.icons8.com/sf-regular-filled/96/shopping-cart.png"
            alt="Placeholder"
            className="w-full  h-64 object-contain "
          />
        </div>
      );
    }

    console.log(similarProducts)
    return (
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnails - vertical on desktop */}
        <div className="flex flex-row lg:flex-col  gap-4 ">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-16 md:w-18 h-16 md:h-18 rounded p-1  overflow-hidden ${
                selectedImage === i
                  ? "border-primary border-2"
                  : "border border-gray-200 "
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
      </div>
    );
  };

  const renderPriceSection = () => {
    const discountPercentage = product.oldPrice
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
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
        <span
          className={product.inventory > 0 ? "text-green-600" : "text-red-500"}
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
            ? `${product.reviews} Review${product.reviews !== 1 ? "s" : ""}`
            : "No Reviews Yet"}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <FaStar className="text-yellow-500" size={18} />
        <span>
          {product.rating > 0 ? `${product.rating.toFixed(1)}/5` : "No Rating"}
        </span>
      </div>
    </div>
  );

  const renderTags = () => {
    if (!product.tags || product.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-green-100 cursor-pointer transition"
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  const renderQuantitySelector = () => (
    <div className="flex items-center gap-5 mt-10 ">
      <div className="flex items-center rounded-lg overflow-hidden">
        <button
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1 m-1 border border-neutral">{quantity}</span>
        <button
          onClick={() => setQuantity((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
          disabled={quantity >= product.inventory}
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="btn btn-soft btn-primary flex items-center gap-2 duration-500"
      >
        <FaShoppingCart />
        <span className="hidden sm:inline"> Add to Cart</span>
      </button>
      <button
        onClick={handleBuyNow}
        className="btn bg-green-700 hover:bg-green-800 text-white btn-soft flex items-center gap-2 duration-500 transition"
      >
        <FiShoppingBag /> Buy now
      </button>
    </div>
  );

  return (
    <div className="py-5 pb-15 lg:py-20 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 text-sm relative">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-primary mb-6 cursor-pointer"
      >
        <IoMdArrowRoundBack /> Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-8 sm:border-b sm:border-r border-gray-200 pb-10 sm:pr-6 rounded">
        {/* Image Section */}
        <div className="w-full md:w-1/2">{renderImageGallery()}</div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-accent">
              {product.name}
            </h1>
            {product.brand && product.brand !== "N/A" && (
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="font-semibold text-gray-600">Brand :</span>
                <span className="text-green-600 font-medium">
                  {product.brand}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-700">{product.description}</p>
          {renderTags()}
          {renderPriceSection()}
          {renderMetaInfo()}
          {renderColorOptions()}
          {product.specifications.warranty && (
            <div>
              <strong className="text-gray-700">Warranty :</strong>{" "}
              <span className="text-primary">
                {product.specifications.warranty} Warranty. (Please preserve
                your box to claim warranty)
              </span>
            </div>
          )}
          {renderQuantitySelector()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-12 justify-between gap-10">
        {/* Specification Section */}
        <div className="w-full lg:w-2/3">
          <h3 className="font-bold text-accent text-xl sm:text-2xl mb-8 pb-2 relative inline-block">
            Product Details
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></span>
          </h3>

          <div className="grid gap-8">
            {/* Specification Table */}
            <div className="text-gray-700">
              <h3 className="font-semibold text-lg sm:text-xl mb-4 pb-2 relative inline-block group">
                Specification Information
                <span className="absolute left-0 -bottom-0 w-0 group-hover:w-full h-[2px] bg-orange-500 transition-all duration-500 rounded-full"></span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm text-gray-700">
                  <tbody>
                    {product.specifications && (
                      <>
                        <tr>
                          <td
                            colSpan="2"
                            className="bg-orange-50 text-primary font-semibold px-4 py-2"
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
                        className="bg-orange-50 text-primary font-semibold px-4 py-2"
                      >
                        Physical Details
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 w-1/3">Dimensions</td>
                      <td className="px-4 py-2">
                        {product.dimensions.length} x {product.dimensions.width}{" "}
                        x {product.dimensions.height} {product.dimensions.unit}
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

            {/* Additional Info Table */}
            <div className="text-gray-700">
              <h3 className="font-semibold text-lg sm:text-xl mb-4 pb-2 relative inline-block group">
                Additional Information
                <span className="absolute left-0 -bottom-0 w-0 group-hover:w-full h-[2px] bg-orange-500 transition-all duration-300 rounded-full"></span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr>
                      <td
                        colSpan={2}
                        className="bg-orange-50 text-primary font-semibold px-4 py-2"
                      >
                        Details
                      </td>
                    </tr>

                    {product.category && (
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 w-1/3">Category</td>
                        <td className="px-4 py-2">{product.category}</td>
                      </tr>
                    )}

                    {product.seoKeywords?.length > 0 && (
                      <tr className="border-b border-gray-200 align-top">
                        <td className="px-4 py-2">Keywords</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-2">
                            {product.seoKeywords.map((keyword, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 rounded text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    {product.sellerEmail && (
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 w-1/3">Sold By</td>
                        <td className="px-4 py-2">{product.sellerEmail}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Similar Products */}
        <div className="w-full lg:w-1/3">
          <h3 className="font-bold text-xl sm:text-2xl mb-6 pb-1 relative inline-block text-accent">
            Similar Products
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></span>
          </h3>
          <div className="space-y-2 text-gray-600">
            {similarProducts?.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-3 border border-secondary rounded-lg hover:shadow-sm shadow-secondary duration-500 transition cursor-pointer"
                onClick={() => navigate(`/product-details/${item._id}`)}
              >
                <img
                  src={
                    item.images?.[0] ||
                    "https://img.icons8.com/sf-regular-filled/96/shopping-cart.png"
                  }
                  alt={item.name}
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-red-500 font-semibold">
                    Tk. {item.price.toLocaleString()}
                  </p>
                  {item.oldPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      Tk. {item.oldPrice.toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    {"★".repeat(Math.round(item.rating || 0))}
                    <span className="text-gray-600 text-xs">
                      ({item.rating || 0})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Chat Button and Chat Popup */}
      <div>
        <button
          onClick={handleChat}
          className="btn btn-primary fixed bottom-24 border-none right-6 z-50 rounded-full text-2xl py-7 px-4 shadow-lg hover:bg-accent transition duration-300"
        >
          <IoMdChatboxes />
        </button>
        {/* Chat Popup Animation */}
        <div
          className={`fixed bottom-6 right-5 z-40`}
          style={{
            transition:
              "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.68,-0.55,.27,1.55)",
            transform: isChatOpen
              ? "scale(1) translateY(-150px) translateX(-6px)"
              : "scale(0.85) translateY(-100px) translateX(0)",
            opacity: isChatOpen ? 1 : 0,
            pointerEvents: isChatOpen ? "auto" : "none",
            transformOrigin: "bottom right",
            maxWidth: "95vw",
            willChange: "opacity, transform",
          }}
        >
          <Chat
            productId={product?._id}
            sellerEmail={product?.sellerEmail}
            customerEmail={user?.email}
            productName={product?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
