import React, { useEffect, useState } from "react";
import ProductCard from "./Component/ProductCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Pagination from "../../../shared/Pagination";

const products = [
  {
    id: 1,
    title: "Cotton Fabric T-Shirt",
    category: "T-Shirt",
    sizes: ["S", "M", "L", "XL"],
    price: 120,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/5.jpg",
    colors: [
      { color: "#f87171" }, // red-400
      { color: "#60a5fa" }, // blue-400
      { color: "#34d399" }, // green-400
    ],
    liked: false,
  },
  {
    id: 2,
    title: "Slim Fit Polo Shirt",
    category: "Polo",
    sizes: ["M", "L"],
    price: 95,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/6.jpg",
    colors: [
      { color: "#fbbf24" }, // amber-400
      { color: "#6366f1" }, // indigo-500
    ],
    liked: true,
  },
  {
    id: 3,
    title: "Casual Denim Shirt",
    category: "Shirt",
    sizes: ["S", "M", "L"],
    price: 140,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/2.jpg",
    colors: [
      { color: "#0ea5e9" }, // sky-500
      { color: "#a855f7" }, // violet-500
    ],
    liked: false,
  },
  {
    id: 4,
    title: "Classic White Tee",
    category: "T-Shirt",
    sizes: ["S", "M", "L"],
    price: 60,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/1.jpg",
    colors: [
      { color: "#ffffff" }, // white
      { color: "#e5e7eb" }, // gray-200
    ],
    liked: true,
  },
  {
    id: 5,
    title: "Striped Summer Shirt",
    category: "Shirt",
    sizes: ["M", "L", "XL"],
    price: 130,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/4.jpg",
    colors: [
      { color: "#f59e0b" }, // yellow-500
      { color: "#10b981" }, // emerald-500
    ],
    liked: false,
  },
  {
    id: 6,
    title: "Graphic Oversized Tee",
    category: "T-Shirt",
    sizes: ["S", "L"],
    price: 80,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/3.jpg",
    colors: [
      { color: "#e11d48" }, // rose-600
      { color: "#14b8a6" }, // teal-500
    ],
    liked: true,
  },
  {
    id: 7,
    title: "Lightweight Hoodie",
    category: "Hoodie",
    sizes: ["M", "L", "XL"],
    price: 150,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/7.jpg",
    colors: [
      { color: "#64748b" }, // slate-500
      { color: "#3b82f6" }, // blue-500
    ],
    liked: false,
  },
  {
    id: 8,
    title: "Basic Black Tee",
    category: "T-Shirt",
    sizes: ["S", "M"],
    price: 50,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/8.jpg",
    colors: [
      { color: "#000000" }, // black
      { color: "#4b5563" }, // gray-600
    ],
    liked: false,
  },
  {
    id: 9,
    title: "Vintage Washed Tee",
    category: "T-Shirt",
    sizes: ["S", "M", "L", "XL"],
    price: 110,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/9.jpg",
    colors: [
      { color: "#facc15" }, // yellow-400
      { color: "#a3e635" }, // lime-400
    ],
    liked: true,
  },
  {
    id: 10,
    title: "Knitted Long Sleeve",
    category: "Sweater",
    sizes: ["M", "L"],
    price: 160,
    image:
      "https://maraviyainfotech.com/projects/mantu-html/assets/img/product/10.jpg",
    colors: [
      { color: "#6d28d9" }, // purple-700
      { color: "#7c3aed" }, // violet-600
    ],
    liked: false,
  },
];
const LimitedOffer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  // countdown
  const startSeconds = 183600;
  const [timeLeft, setTimeLeft] = useState(startSeconds);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0") + "h";
    const mins =
      String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0") + "m";
    const secs = String(totalSeconds % 60).padStart(2, "0") + "s";
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="px-4 py-10 mx-auto max-w-7xl">
      <motion.div
        className="flex items-center justify-center gap-6 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-center text-2xl whitespace-nowrap md:text-3xl font-semibold">
          Limited Time Offer
        </h2>
        <span className="text-lg p-2 bg-gray-700 text-white rounded-2xl">
          {formatTime(timeLeft)}
        </span>
      </motion.div>

      <div className="divider" />

      <div
        className="mt-8 grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        data-aos="fade-up"
      >
        {currentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} offers={50} />
          </motion.div>
        ))}
      </div>

      <div
        className="flex justify-center mt-10 space-x-3"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded transition ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LimitedOffer;
