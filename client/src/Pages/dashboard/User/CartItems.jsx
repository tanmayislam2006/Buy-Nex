import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";

const CartItems = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: cart = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["carts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart/${user?.email}`);
      return res.data;
    },
  });

  console.log(cart);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/cart/delete/${id}`);
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axiosSecure.delete(`/cart/clear/${user?.email}`);
      refetch();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };
  const handleBuyNow = (item) => {
    navigate('/orderPage', { state: item });
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axiosSecure.patch(`/cart/update/${id}`, { quantity: newQuantity });
      refetch();
    } catch (error) {
      console.error("Quantity update error:", error);
    }
  };
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="accent-primary" />
                <span className="font-semibold text-gray-700">SELECT ALL ({cart.length} ITEM{cart.length !== 1 ? 'S' : ''})</span>
              </div>
              <button onClick={handleClearCart} className="text-gray-500 hover:text-red-500 flex items-center gap-1 font-medium">
                <FaTrashAlt /> DELETE All
              </button>
            </div>
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4 border-b py-4">
                <div className="flex items-center gap-4 w-full">
                  <input type="checkbox" checked readOnly className="accent-primary" />
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">No Brand, Color Family:Multicolor</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-lg">৳ {item.price}</span>
                    <button className="text-gray-400 hover:text-primary"><span className="text-xl">♡</span></button>
                    <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500"><FaTrashAlt /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded text-lg font-bold"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      className="bg-gray-200 px-2 py-1 rounded text-lg font-bold"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Order Summary Section */}
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="mb-4">
              <div className="text-gray-500 text-sm mb-2">Location</div>
              <button className="text-primary font-medium flex items-center gap-1 text-sm mb-2">
                <span className="material-icons">location_on</span> Add Shipping Address
              </button>
              <hr className="my-2" />
            </div>
            <div className="mb-4">
              <div className="font-semibold text-lg mb-2">Order Summary</div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Subtotal ({cart.length} items)</span>
                <span>৳ {total}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Shipping Fee</span>
                <span>৳ 80</span>
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <input type="text" placeholder="Enter Voucher Code" className="input input-bordered w-full" />
              <button className="bg-blue-500 text-white px-6 rounded font-semibold">APPLY</button>
            </div>
            <div className="flex justify-between items-center font-bold text-lg mb-4">
              <span>Total</span>
              <span className="text-primary">৳ {total + 80}</span>
            </div>
            <button onClick={() => handleBuyNow(cart)} className="w-full bg-orange-500 text-white py-3 rounded font-semibold text-lg hover:bg-orange-600 transition">
              PROCEED TO CHECKOUT ({cart.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
