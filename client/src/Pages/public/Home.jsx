import React from "react";
import ComingSoon from "../../components/ComingSoon";
import NewArrival from "./HomeComponent/NewArrival";
import WhatWeOffer from "./HomeComponent/WhatWeOffer";



const Home = () => {
  return (
    <div className="min-h-screen  bg-[#e1e4e9]">
      <ComingSoon showBack={false} />

      <section>
        <NewArrival />
      </section>
      <section>
        <WhatWeOffer/>
      </section>
    </div>
  );
};

export default Home;
