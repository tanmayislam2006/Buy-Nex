import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state;

  useEffect(() => {
    if (!productData) {
      navigate("/cart"); // If accessed directly or refreshed without state
    }
  }, [productData, navigate]);

  if (!productData) return null;

  // Normalize: always work with an array
  const products = Array.isArray(productData) ? productData : [productData];
  const grandTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto pt-20 px-4 pb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Confirm Your Order
      </h2>

      <div className="space-y-6 bg-white shadow-lg rounded-lg p-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 items-center pb-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Unit Price: ${product.price}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {product.quantity}
              </p>
              <p className="font-semibold mt-1">
                Total: ${(product.price * product.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        <div className="text-lg font-semibold pt-2 border-t">
          Grand Total:{" "}
          <span className="text-primary">${grandTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-end">
          <button className="cursor-pointer bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition w-full sm:w-auto">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
