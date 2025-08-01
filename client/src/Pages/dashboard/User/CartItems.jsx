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
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>

      {isLoading ? (
        <Loading />
      ) : cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link
            to="/all-products"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-md p-4 rounded-lg"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full sm:w-2/3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Price: ${item.price}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex gap-5 items-center">
                    <p className="">{item.quantity}</p>
                    <p className="font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-5 items-center">
                    <button
                     onClick={()=>handleBuyNow(item)}
                      className="cursor-pointer bg-primary text-white px-4 py-1.5 rounded hover:bg-opacity-90 text-sm w-full sm:w-auto text-center"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Item"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-10 border-t pt-6 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-xl font-semibold">
              Subtotal:{" "}
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
              <button
                onClick={()=>handleBuyNow(cart)}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
