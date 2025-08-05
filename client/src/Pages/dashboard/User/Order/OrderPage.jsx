import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import { calculateShipping } from "../../../../Utils/Utils";

const generateOrderId = (prefix = "BN") =>
  `ORD-${prefix}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
const generateTrackingId = (prefix = "BN") =>
  `TRC-${prefix}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

const OrderPage = () => {
  const [orderData, setOrderData] = useState(null);
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
    (sum, p) => (sum + p.price * p.quantity),
    0
  );
  const shippingCost = Math.ceil(calculateShipping(subtotal));
  const taxAmount = Math.ceil(subtotal * 0.01);
  const discountAmount = 15;
  const totalAmount = (
    subtotal + shippingCost + taxAmount - discountAmount
  ).toFixed(2);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const order = {
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
      paymentMethod: data.paymentMethod || "SSl comarch",
      shippingAddress: { ...data },
      billingAddress: { ...data },
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrderData(order);
    toast.success("Order data save successfully");
  };

  const placeOrder = () => {
        if (!orderData) {
          toast.error("Please save delivery info first");
          return;
        }
    try {
      axiosSecure.post("/ssl-payment-init", { orderData }).then((res) => {
        window.location.replace(res.data);
      });
    } catch (error) {
      console.error("Order placement failed", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 sm:px-6 sm:pt-6 sm:rounded-lg sm:shadow space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            id="order-form"
          >
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  defaultValue={user?.name}
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your first and last name"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  defaultValue={user?.email}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("region", { required: true })}
                  placeholder="Please choose your region"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.region && (
                  <span className="text-red-500 text-xs">
                    Region is required
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("phone", { required: true })}
                  placeholder="Please enter your phone number"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs">
                    Phone is required
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("city", { required: true })}
                  placeholder="Please choose your city"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.city && (
                  <span className="text-red-500 text-xs">City is required</span>
                )}
              </div>
              <div>
                <input
                  {...register("street", { required: true })}
                  placeholder="Building / House No / Floor / Street"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.street && (
                  <span className="text-red-500 text-xs">
                    Street is required
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("area", { required: true })}
                  placeholder="Please choose your area"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.area && (
                  <span className="text-red-500 text-xs">Area is required</span>
                )}
              </div>
              <div>
                <input
                  {...register("landmark", { required: true })}
                  placeholder="Colony / Suburb / Locality / Landmark"
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary"
                />
                {errors.landmark && (
                  <span className="text-red-500 text-xs">
                    Landmark is required
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90 transition"
            >
              Save Delivery Information
            </button>
          </form>
          <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="py-4 px-2 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 w-full">
                  <img
                    className="w-10 h-10 sm:w-16 sm:h-16"
                    src={product.image}
                    alt={product.name}
                  />
                  <p className="font-medium w-40 sm:min-w-60 sm:w-full">{product.name}</p>
                  <p className="text-gray-500 w-16">Qty: {product.quantity}</p>
                </div>
                <p className="font-semibold w-20">
                  $ {(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Left Form */}

        {/* Right Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-20">
          <h3 className="text-lg font-semibold mb-4">Promotion</h3>
          <div className="flex mb-4">
            <input
              placeholder="Enter Store/BuyNex Code"
              className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-primary flex-1"
            />
            <button
              type="button"
              onClick={() => toast.error("Coming Soon")}
              className="ml-2 bg-primary text-white px-4 rounded"
            >
              APPLY
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 text-sm space-y-1">
            <p className="flex justify-between">
              <span>Items Total ({products.length} Items)</span>
              <span>$ {subtotal}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery Fee</span>
              <span>$ {shippingCost}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax</span>
              <span>$ {taxAmount}</span>
            </p>
            <p className="flex justify-between">
              <span>Discount</span>
              <span>- $ {discountAmount}</span>
            </p>
            <p className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>$ {totalAmount}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              VAT included, where applicable
            </p>
          </div>

          <button
            disabled={!orderData}
            onClick={placeOrder}
            className="w-full mt-6 bg-primary text-white py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
