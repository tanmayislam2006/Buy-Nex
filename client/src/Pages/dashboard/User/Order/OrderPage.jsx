import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const generateOrderId = (prefix = "BN") =>
  `ORD-${prefix}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
const generateTrackingId = (prefix = "BN") =>
  `TRC-${prefix}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const productData = location.state;

  useEffect(() => {
    if (!productData) {
      navigate("/cart");
    }
  }, [productData, navigate]);

  const products = Array.isArray(productData)
    ? productData
    : productData
    ? [productData]
    : [];
  const subtotal = products.reduce(
    (sum, p) => Math.ceil(sum + p.price * p.quantity),
    0
  );
  const shippingCost = (subtotal * 0.05);
  const taxAmount = (subtotal * 0.01); 
  const discountAmount = 15;
  const totalAmount = Math.ceil(
    subtotal + shippingCost + taxAmount - discountAmount
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const orderData = {
      userEmail: user.email,
      orderNumber: generateOrderId("BN"),
      trackingNumber: generateTrackingId("BN"),
      products,
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentStatus: "Unpaid",
      paymentMethod: data.paymentMethod,
      shippingAddress: { ...data },
      billingAddress: { ...data },
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/ssl-payment-init", { orderData });
      window.location.replace(res.data);
    } catch (error) {
      console.error("Order placement failed", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 bg-white p-6 rounded-lg shadow space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              {...register("name", { required: true })}
              placeholder="Enter your first and last name"
              className="input"
            />
            <input
              {...register("region", { required: true })}
              placeholder="Please choose your region"
              className="input"
            />
            <input
              {...register("phone", { required: true })}
              placeholder="Please enter your phone number"
              className="input"
            />
            <input
              {...register("city", { required: true })}
              placeholder="Please choose your city"
              className="input"
            />
            <input
              {...register("street", { required: true })}
              placeholder="Building / House No / Floor / Street"
              className="input"
            />
            <input
              {...register("area", { required: true })}
              placeholder="Please choose your area"
              className="input"
            />
            <input
              {...register("landmark", { required: true })}
              placeholder="Colony / Suburb / Locality / Landmark"
              className="input"
            />
            <input
              {...register("extra", { required: true })}
              placeholder="For Example: House# 123, Street# 123, ABC Road"
              className="input"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Select Payment Method
            </label>
            <select
              {...register("paymentMethod", { required: true })}
              className="input"
            >
              <option value="SSLCommerz">SSLCommerz</option>
              <option value="Cash On Delivery">Cash On Delivery</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Select a label for effective delivery:
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                className="border border-green-500 text-green-600 px-4 py-1 rounded"
              >
                business OFFICE
              </button>
              <button
                type="button"
                className="border border-red-500 text-red-600 px-4 py-1 rounded"
              >
                home HOME
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90 transition"
          >
            Proceed to Pay
          </button>
        </form>

        {/* Right Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Promotion</h3>
          <div className="flex mb-4">
            <input
              placeholder="Enter Store/Daraz Code"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={() => alert("Coming Soon")}
              className="ml-2 bg-primary text-white px-4 rounded"
            >
              APPLY
            </button>
          </div>

          <div className="border-t pt-4 text-sm space-y-1">
            <p className="flex justify-between">
              <span>Items Total ({products.length} Items)</span>
              <span>৳ {subtotal}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery Fee</span>
              <span>৳ {shippingCost}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax</span>
              <span>৳ {taxAmount}</span>
            </p>
            <p className="flex justify-between">
              <span>Discount</span>
              <span>- ৳ {discountAmount}</span>
            </p>
            <p className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>৳ {totalAmount}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              VAT included, where applicable
            </p>
          </div>

          <button
            type="submit"
            form="order-form"
            className="w-full mt-6 bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
