import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react"

import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
const generateOrderId = (prefix = 'BN') => {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${prefix}-${randomNum}`;
};
const generateTrackingId = (prefix = 'BN') => {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRC-${prefix}-${randomNum}`;
};
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

  const products = Array.isArray(productData) ? productData : [productData];
  const subtotal = products.reduce(
    (sum, p) => Math.ceil(sum + p.price * p.quantity),
    0
  );
  const shippingCost = 10;
  const taxAmount = 5;
  const discountAmount = 15;
  const totalAmount = Math.ceil(subtotal + shippingCost + taxAmount) ;

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
console.log(orderData);
    try {
      await axiosSecure.post("/ssl-payment-init",{orderData}).then(res=>{
        window.location.replace(res.data);
      });

    } catch (error) {
      console.error("Order placement failed", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-20 px-4 pb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Order</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Shipping / Billing Info</h3>
          <input {...register("name", { required: true })} placeholder="Full Name" className="input" />
          <input {...register("street", { required: true })} placeholder="Street Address" className="input" />
          <input {...register("city", { required: true })} placeholder="City" className="input" />
          <input {...register("state", { required: true })} placeholder="State" className="input" />
          <input {...register("zipCode", { required: true })} placeholder="Zip Code" className="input" />
          <input {...register("country", { required: true })} placeholder="Country" className="input" />
          <input {...register("phone", { required: true })} placeholder="Phone" className="input" />

          <select {...register("paymentMethod", { required: true })} className="input">
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Stripe">Stripe</option>
          </select>

          <textarea {...register("notes")} placeholder="Order Notes (optional)" className="input"></textarea>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-2">Review Items</h3>
          <div className="divide-y">
            {products.map((product, i) => (
              <div key={i} className="py-4 flex gap-4 items-center">
                <img src={product.image} className="w-16 h-16 rounded" alt={product.name} />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {product.quantity} × ${product.price}</p>
                </div>
                <p className="font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t text-right space-y-1">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Shipping: ${shippingCost}</p>
            <p>Tax: ${taxAmount}</p>
            <p>Discount: -${discountAmount}</p>
            <p className="text-lg font-bold">Total: ${totalAmount.toFixed(2)}</p>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderPage;
