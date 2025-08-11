import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/free-mode";
import ProductCard from "./Component/ProductCard";

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
const NewArrival = () => {
  return (
    <div className="w-full py-10">
      <div className="container mx-auto px-4">
        <h4 className="font-semibold text-3xl text-center mb-2">
          New <span className="text-orange-500">Arrival</span>
        </h4>
        <div className="divider my-4"></div>

        <Swiper
          spaceBetween={18}
          freeMode={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[Autoplay, FreeMode]}
          loop={true}
          speed={1200}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            480: { slidesPerView: 2 },
            640: { slidesPerView: 2.5 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
          }}
          className="mySwiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <ProductCard product={product} isTrue={true} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewArrival;
