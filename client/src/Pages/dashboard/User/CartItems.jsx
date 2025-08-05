import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import { calculateShipping, calculateTotalAmount } from "../../../Utils/Utils";

const CartItems = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#F85606",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/cart/delete/${id}`);
        refetch();
        setSelectedItems((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "The item has been removed.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete the item.", "error");
      }
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear the entire cart? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#F85606",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/cart/clear/${user?.email}`);
        refetch();
        setSelectedItems([]);
        Swal.fire("Cleared!", "Your cart has been cleared.", "success");
      } catch (error) {
        console.error("Clear cart error:", error);
        Swal.fire("Error!", "Failed to clear the cart.", "error");
      }
    }
  };

  const handleBuyNow = () => {
    if (selectedItems.length === 0) return;
    navigate("/orderPage", { state: selectedItems });
  };

const handleUpdateQuantity = async (id, newQuantity) => {
  if (newQuantity < 1) return;
  try {
    await axiosSecure.patch(`/cart/update/${id}`, { quantity: newQuantity });
    refetch();

    // Update quantity inside selectedItems
    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  } catch (error) {
    console.error("Quantity update error:", error);
  }
};

  const toggleSelectItem = (item) => {
    const exists = selectedItems.find((i) => i._id === item._id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart);
    }
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-20 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-8">
        {/* Cart Items Section */}
        <div className="md:col-span-2">
          <div className="sm:bg-white rounded-xl sm:shadow pt-4 divide-y divide-gray-300 overflow-x-auto">
            <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 pb-4 gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="accent-primary cursor-pointer"
                />
                <span className="font-medium sm:font-semibold text-gray-700 text-xs sm:text-base">
                  SELECT ALL ({cart.length} ITEM{cart.length !== 1 ? "S" : ""})
                </span>
              </div>
              <button
                disabled={cart.length < 1}
                onClick={handleClearCart}
                className="text-gray-500 hover:text-red-500 flex items-center gap-1 font-medium text-xs sm:text-base cursor-pointer"
              >
                <FaTrashAlt /> DELETE All
              </button>
            </div>
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-4"
              >
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((i) => i._id === item._id)}
                    onChange={() => toggleSelectItem(item)}
                    className="accent-primary cursor-pointer"
                  />
                  <Link to={`/product-details/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded"
                    />
                  </Link>
                  <div className="flex-1 min-w-[120px]">
                    <div className="font-semibold text-gray-800 text-xs sm:text-base">
                      {item.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium text-xs sm:text-lg">
                      $ {(item.price.toFixed(2) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      className="bg-gray-200 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-sm  sm:text-lg font-medium cursor-pointer disabled:opacity-50"
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="font-medium text-xs sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-gray-200 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-sm  sm:text-lg font-medium cursor-pointer disabled:opacity-50"
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity + 1)
                      }
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
        <div className="sticky top-16">
          <div className="bg-white rounded-xl shadow p-2 sm:p-4 lg:p-6 sticky top-24">
            <div className="mb-4">
              <div className="font-semibold mb-2 text-xs sm:text-lg">
                Order Summary
              </div>
              <div className="flex justify-between text-gray-700 mb-1 text-xs sm:text-base">
                <span>Subtotal ({selectedItems.length} items)</span>
                <span>$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-1 text-xs sm:text-base">
                <span>Shipping Fee</span>
                <span>$ {calculateShipping(total)}</span>
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Enter Voucher Code"
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
              />
              <button className="btn btn-primary text-white text-xs sm:text-base">
                APPLY
              </button>
            </div>
            <div className="flex justify-between items-center font-bold mb-4 text-xs sm:text-lg">
              <span>Total</span>
              <span className="text-primary">
                $ {calculateTotalAmount(total)}
              </span>
            </div>
            <button
              disabled={selectedItems.length < 1 && true}
              onClick={handleBuyNow}
              className="btn btn-primary w-full text-white text-xs sm:text-lg"
            >
              Proceed to Checkout ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
