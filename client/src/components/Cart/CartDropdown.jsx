// components/CartDropdown.jsx
import React from "react";
import { Link } from "react-router"; 

const CartDropdown = ({ cartItems, setShowCartDropdown }) => {
  return (
    <div className="absolute right-4 top-full mt-2 w-72 bg-white shadow-lg rounded-md p-4 z-50">
      <h4 className="font-semibold mb-2">Cart Preview</h4>
      <ul className="space-y-2 max-h-56 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-sm">Your cart is empty</p>
        ) : (
          cartItems.slice(0, 3).map((item) => (
            <li key={item._id} className="flex items-center gap-3 bg-gray-100 p-2 rounded hover:bg-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
      <Link
        onClick={() => setShowCartDropdown(false)}
        to="/cart"
        className="block mt-4 text-center text-sm font-semibold text-primary hover:underline"
      >
        View All ({cartItems.length})
      </Link>
    </div>
  );
};

export default CartDropdown;
