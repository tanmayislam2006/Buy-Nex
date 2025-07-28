import React from "react";
import { Link } from "react-router";
const BuyFix = () => {
  return (
    <Link className="flex items-center" to={"/"}>
      <img src="https://web.justbeepit.com/authImg.png" className="w-10 h-10 mr-2" alt="" />
      <h3 className="text-lg font-bold text-primary">
       Buy Fix
      </h3>
    </Link>
  );
};

export default BuyFix;
