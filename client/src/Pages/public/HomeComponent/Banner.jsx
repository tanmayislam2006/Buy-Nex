import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";

const bannerDetails = [
  {
    id: 1,
    title: "Up to 60% Off",
    subtitle: "End of Season Sale",
    description: "Get the best deals on your favorite products",
    image:
      "https://nest-frontend-v6.vercel.app/assets/imgs/slider/slider-1.png",
    cta: {
      text: "Shop Now",
      link: "/sale",
    },
  },
  {
    id: 2,
    title: "Summer Collection 2025",
    subtitle: "New Arrivals",
    description: "Explore the latest trends in fashion and accessories.",
    image:
      "https://nest-frontend-v6.vercel.app/assets/imgs/slider/slider-2.png",
    cta: {
      text: "Explore",
      link: "/new",
    },
  },
  {
    id: 3,
    title: "Flash Deal",
    subtitle: "Only 24 Hours",
    description: "Massive discounts on electronics & more. Hurry up!",
    image:
      "https://nest-frontend-v6.vercel.app/assets/imgs/slider/slider-4.png",
    cta: {
      text: "Grab Now",
      link: "/flash-deal",
    },
  },
  {
    id: 4,
    title: "Free Shipping",
    subtitle: "On Orders Over $50",
    description: "Enjoy fast and free delivery across the country.",
    image:
      "https://nest-frontend-v6.vercel.app/assets/imgs/slider/slider-3.png",
    cta: {
      text: "Learn More",
      link: "/shipping-policy",
    },
  },
];

const Banner = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-[30vh] md:min-h-[50vh]">
      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        className="mySwiper h-full"
      >
        {bannerDetails.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            <div
              className="h-[80vh] w-full flex items-center px-4"
              style={{
                backgroundImage: `url('${banner.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <motion.div
                className="p-8 max-w-xl"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl font-medium rounded-2xl block mb-2">
                  {banner.subtitle}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {banner.title}
                </h1>
                <p className="mb-6">{banner.description}</p>
                <motion.a
                  href={banner.cta.link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition duration-300 inline-block"
                >
                  {banner.cta.text}
                </motion.a>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
