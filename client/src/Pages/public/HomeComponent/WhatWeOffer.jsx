import React from "react";

const support = [
  {
    icon: "https://cdn-icons-png.flaticon.com/128/1042/1042320.png",
    title: "Free Shipping",
    desc: "Free shipping on all US orders or orders above $200",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/1827/1827392.png",
    title: "24/7 Support",
    desc: "Contact us anytime via chat, email, or phone",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/929/929416.png",
    title: "Secure Payment",
    desc: "Your payment info is processed securely",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/128/992/992703.png",
    title: "Easy Returns",
    desc: "Return within 30 days with no hassle",
  },
];

const WhatWeOffer = () => {
  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {support.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 flex flex-col items-center text-center gap-4 border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="w-14 h-14 object-contain"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatWeOffer;
