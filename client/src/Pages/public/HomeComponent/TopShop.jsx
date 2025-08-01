import React from "react";

const shops = [
  {
    id: 1,
    name: "UrbanWear",
    image: "https://cdn-icons-png.flaticon.com/512/889/889442.png",
    tagline: "Style That Speaks for You",
    review: {
      rating: 4.8,
      totalReviews: 1243,
      topComment: "Excellent quality and fast delivery!",
    },
  },
  {
    id: 2,
    name: "GadgetZone",
    image: "https://cdn-icons-png.flaticon.com/512/1042/1042356.png",
    tagline: "Tech at Your Fingertips",
    review: {
      rating: 4.5,
      totalReviews: 998,
      topComment: "Affordable gadgets and great service!",
    },
  },
  {
    id: 3,
    name: "ShoeStop",
    image: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
    tagline: "Step Into Comfort",
    review: {
      rating: 4.7,
      totalReviews: 765,
      topComment: "Trendy shoes and fast delivery.",
    },
  },
  {
    id: 4,
    name: "HomeEssence",
    image: "https://cdn-icons-png.flaticon.com/512/3661/3661383.png",
    tagline: "Make Every Space Cozy",
    review: {
      rating: 4.9,
      totalReviews: 1320,
      topComment: "Best home decor selection online!",
    },
  },
  {
    id: 5,
    name: "BeautyNest",
    image: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png",
    tagline: "Glow Like Never Before",
    review: {
      rating: 4.6,
      totalReviews: 899,
      topComment: "High-quality cosmetics and skin care.",
    },
  },
  {
    id: 6,
    name: "ToyLand",
    image: "https://cdn-icons-png.flaticon.com/512/2454/2454265.png",
    tagline: "Joy for Every Little Heart",
    review: {
      rating: 4.4,
      totalReviews: 543,
      topComment: "Fun toys with safe materials!",
    },
  },
  {
    id: 7,
    name: "BookBarn",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    tagline: "Feed Your Mind",
    review: {
      rating: 4.9,
      totalReviews: 1844,
      topComment: "Fast delivery and wide variety!",
    },
  },
  {
    id: 8,
    name: "GreenLeaf Market",
    image: "https://cdn-icons-png.flaticon.com/512/2909/2909753.png",
    tagline: "Freshness at Your Door",
    review: {
      rating: 4.3,
      totalReviews: 688,
      topComment: "Always fresh and on time!",
    },
  },
  {
    id: 9,
    name: "FitnessFuel",
    image: "https://cdn-icons-png.flaticon.com/512/4320/4320114.png",
    tagline: "Power Your Performance",
    review: {
      rating: 4.6,
      totalReviews: 1101,
      topComment: "Best supplements for serious training!",
    },
  },
  {
    id: 10,
    name: "CraftyHands",
    image: "https://cdn-icons-png.flaticon.com/512/4072/4072372.png",
    tagline: "Made with Love & Creativity",
    review: {
      rating: 4.7,
      totalReviews: 799,
      topComment: "Unique handmade gifts and crafts!",
    },
  },
];

const TopShop = () => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-3xl font-bold text-center mb-4"><span className="text-primary">Top</span> Shops</h2>
        <p className="text-gray-600 text-center">
          Discover the best shops offering exclusive deals and products.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6">
          {/* Example Shop Cards */}
          {shops.map((shop, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center ">
                <img src={shop.image} alt="" className="w-12" />
              </div>
              <h3 className="text-lg font-medium text-center">{shop.name}</h3>
              <p className="text-gray-500 mb-4 text-center text-sm">{shop.tagline}</p>

              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`${
                    i < Math.floor(shop.review.rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  } text-lg`}
                >
                  ★
                </span>
              ))}
              <span>({shop.review.totalReviews})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopShop;
