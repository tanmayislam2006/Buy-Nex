import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router';

const CartItems = () => {
  // Sample static cart items — replace with your actual cart state
  const cart = [
    {
      id: 1,
      title: 'Wireless Headphones',
      price: 120,
      quantity: 2,
      image: 'https://assets.gadgetandgear.com/upload/product/20230530_1685430710_183928.jpeg',
    },
    {
      id: 2,
      title: 'Smart Watch',
      price: 80,
      quantity: 1,
      image: 'https://assets.gadgetandgear.com/upload/product/20230530_1685430710_183928.jpeg',
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      price: 120,
      quantity: 2,
      image: 'https://assets.gadgetandgear.com/upload/product/20230530_1685430710_183928.jpeg',
    },
    {
      id: 4,
      title: 'Smart Watch',
      price: 80,
      quantity: 1,
      image: 'https://assets.gadgetandgear.com/upload/product/20230530_1685430710_183928.jpeg',
    },
  ];

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/all-products" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow p-4 rounded-lg"
              >
                <div className="flex items-center gap-4 w-full sm:w-2/3">
                  <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-md" />
                  <div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-sm text-gray-600">Price: ${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button className="px-2 py-1" disabled={item.quantity <= 1}>-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button className="px-2 py-1">+</button>
                  </div>
                  <p className="font-semibold">${item.price * item.quantity}</p>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t pt-6 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-xl font-semibold">
              Subtotal: <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600">
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
