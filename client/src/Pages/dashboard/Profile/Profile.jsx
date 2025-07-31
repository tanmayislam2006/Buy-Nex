import React from "react";
import useAuth from "../../../Hooks/useAuth";
import UserProfile from "../User/UserProfile";
import SellerProfile from "../Seller/SellerProfile";
import AdminProfile from "../Admin/AdminProfile";
import Loading from "../../../components/Loading";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Loading />;
  } else if (user.role === "customer" || !user.role) {
    return <UserProfile />;
  } else if (user.role === "seller") {
    return <SellerProfile />;
  } else if (user.role === "admin") {
    return <AdminProfile />;
  }
};

export default Profile;
