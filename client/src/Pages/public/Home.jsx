import React from "react";
import ComingSoon from "../../components/ComingSoon";
import NewArrival from "./HomeComponent/NewArrival";
import WhatWeOffer from "./HomeComponent/WhatWeOffer";
import LimitedOffer from "./HomeComponent/LimitedOffer";
import TopShop from "./HomeComponent/TopShop";

const Home = () => {
  return (
    <div className="min-h-screen  bg-[#e1e4e9]">
      <ComingSoon showBack={false} />

      <section>
        <NewArrival />
      </section>
      <section>
        <WhatWeOffer />
      </section>
      <section className="container mx-auto px-4 py-8">
        <LimitedOffer />
      </section>
      <section className="container mx-auto px-4 py-8">
        <TopShop />
      </section>
    </div>
  );
};

export default Home;
