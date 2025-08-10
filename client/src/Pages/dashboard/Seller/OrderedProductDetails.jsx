import React from 'react';
import { FiPhone, FiPhoneIncoming } from 'react-icons/fi';
import { Navigate, useLocation } from 'react-router';


const OrderedProductDetails = () => {
    const location = useLocation();
    const order = location.state?.order;
    if (!order) {
        return <Navigate to="/dashboard/ordered-products" replace />;
    }
    // Now you have the full 'order' object!
    // You can pass this object as a prop to a display component.
    // console.log(order);

    // --- Helper Functions ---
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        const date = new Date(dateString);
        return date.toLocaleString('en-US', options).replace(',', ' at');
    };

    const calculateTaxPercentage = (subtotal, taxAmount) => {
        if (subtotal === 0) return '0.00';
        return ((taxAmount / subtotal) * 100).toFixed(2);
    };

    return (
        <div className="bg-base-200 p-4 sm:p-6 lg:p-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Dashboard &gt; Order Detail</h1>
            {/* <div className="mb-4">
                <p className="text-sm text-base-content/70"> Order Detail</p>
            </div> */}

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- Left Column --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Order Header */}
                    <div className="card bg-base-100 shadow-lg rounded-box">
                        <div className="card-body">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="card-title text-2xl">Order No: {order.orderNumber}</h2>
                                <span className="badge badge-info mt-2 sm:mt-0">{order.status}</span>
                            </div>
                            <div className="divider my-4"></div>
                            <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
                                <div>
                                    <p className="text-base-content/70">Order Created at</p>
                                    <p className="font-semibold">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-base-content/70">Name</p>
                                    <p className="font-semibold">{order.shippingAddress.name}</p>
                                </div>
                                <div>
                                    <p className="text-base-content/70">Email</p>
                                    <p className="font-semibold">{order.shippingAddress.email}</p>
                                </div>
                                <div>
                                    <p className="text-base-content/70">Contact No</p>
                                    <p className="font-semibold">{order.shippingAddress.phone}</p>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                {/* Delivery Address */}
                                <div className="card bg-base-100 border border-gray-300 rounded-box">
                                    <div className="card-body">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="card-title">Delivery Address</h3>
                                            <button className="btn btn-ghost btn-sm text-error">Edit</button>
                                        </div>
                                        <p className="font-semibold">Name: {order.shippingAddress.name}</p>
                                        <p className="text-base-content/80">
                                            {order.shippingAddress.street}, {order.shippingAddress.area}
                                        </p>
                                        <p className="text-base-content/80">
                                            {order.shippingAddress.city}, {order.shippingAddress.region}
                                        </p>
                                        {/* Conditionally render the landmark only if it exists */}
                                        {order.shippingAddress.landmark && (
                                            <p className="text-base-content/80">
                                                Landmark: {order.shippingAddress.landmark}
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2 mt-4 text-base-content/80"><FiPhone />{order.shippingAddress.phone}</p>
                                    </div>
                                </div>
                                {/* Billing Address */}
                                <div className="card bg-base-100 border border-gray-300 rounded-box">
                                    <div className="card-body">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="card-title">Billing Address</h3>
                                            <button className="btn btn-ghost btn-sm text-error">Edit</button>
                                        </div>
                                        <p className="font-semibold">Name: {order.billingAddress.name}</p>
                                        <p className="text-base-content/80">
                                            {order.billingAddress.street}, {order.billingAddress.area}
                                        </p>
                                        <p className="text-base-content/80">
                                            {order.billingAddress.city}, {order.billingAddress.region}
                                        </p>
                                        {/* Conditionally render the landmark only if it exists */}
                                        {order.billingAddress.landmark && (
                                            <p className="text-base-content/80">
                                                Landmark: {order.billingAddress.landmark}
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2 mt-4 text-base-content/80"><FiPhone />{order.billingAddress.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Order Items */}
                    <div className="card bg-base-100 shadow-lg rounded-box">
                        <div className="card-body">
                            <h3 className="card-title">Order Items</h3>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Photo</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.products.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-lg">
                                                            <img src={item.image} alt={item.name} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='font-medium'>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price.toFixed(2)}</td>
                                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Right Column --- */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Price Summary */}
                    <div className="card bg-base-100 shadow-lg rounded-box">
                        <div className="card-body">
                            <h3 className="card-title">Price</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Sub Total :</span>
                                    <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Shipping :</span>
                                    <span className="font-semibold">${order.shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Tax({calculateTaxPercentage(order.subtotal, order.taxAmount)}%) :</span>
                                    <span className="font-semibold">${order.taxAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="divider my-4"></div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total :</span>
                                <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="card bg-base-100 shadow-lg rounded-box">
                        <div className="card-body">
                            <h3 className="card-title">Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Invoice No :</span>
                                    <span className="font-semibold">{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Tracking No :</span>
                                    <span className="font-semibold">{order.trackingNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base-content/70">Payment :</span>
                                    <span className="font-semibold">{order.paymentMethod}</span>
                                </div>
                            </div>
                            <div className="card-actions mt-4">
                                <button className="btn btn-outline btn-error w-full">Download PDF</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderedProductDetails;