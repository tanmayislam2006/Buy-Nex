import React from "react";
import useAuth from "../../../Hooks/useAuth";
import UserOverview from "../User/UserOverview";
import SellerOverview from "../Seller/SellerOverview";
import AdminOverview from "../Admin/AdminOverview";
import { Navigate } from "react-router";
import Loading from "../../../components/Loading";

const Overview = () => {
  const { user } = useAuth();

  if (!user) {
    return <Loading />;
  } else if (user.role === "customer" || !user.role) {
    return <UserOverview />;
  } else if (user.role === "seller") {
    return <SellerOverview />;
  } else if (user.role === "admin") {
    return <AdminOverview />;
  }
};

export default Overview;
