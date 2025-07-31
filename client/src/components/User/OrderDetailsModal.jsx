import React from "react";
import { ImCross } from "react-icons/im";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box w-full max-w-2xl">
                <h3 className="font-bold text-xl text-orange-600 mb-2">
                    Order Details
                </h3>

                <div className="py-2 text-sm max-h-[70vh] overflow-y-auto space-y-3">
                    <div>
                        <strong>Order Number:</strong> {order.orderNumber}
                    </div>
                    <div>
                        <strong>Email:</strong> {order.userEmail}
                    </div>
                    <div>
                        <strong>Total:</strong> {order.totalAmount} {order.currency}
                    </div>
                    <div>
                        <strong>Status:</strong> {order.status}
                    </div>
                    <div>
                        <strong>Payment Status:</strong> {order.paymentStatus}
                    </div>
                    <div>
                        <strong>Payment Method:</strong> {order.paymentMethod}
                    </div>

                    {/* Responsive Address */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Shipping Address:</strong>
                            <div className="bg-gray-50 p-3 mt-2 rounded shadow">
                                <p>{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                    {order.shippingAddress.zipCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                <p>{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                        <div>
                            <strong>Billing Address:</strong>
                            <div className="bg-gray-50 p-3 mt-2 rounded shadow">
                                <p>{order.billingAddress.name}</p>
                                <p>{order.billingAddress.street}</p>
                                <p>
                                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                                    {order.billingAddress.zipCode}
                                </p>
                                <p>{order.billingAddress.country}</p>
                                <p>{order.billingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <strong>Notes:</strong> {order.notes}
                    </div>
                    <div>
                        <strong>Discount:</strong>{" "}
                        {order.discountCode
                            ? `${order.discountCode} ($${order.discountAmount})`
                            : "None"}
                    </div>
                    <div>
                        <strong>Shipping Cost:</strong> ${order.shippingCost}
                    </div>
                    <div>
                        <strong>Tax:</strong> ${order.taxAmount}
                    </div>
                    <div>
                        <strong>Tracking:</strong>{" "}
                        {order.trackingNumber || "N/A"}
                    </div>
                    {order.trackingUrl && (
                        <div>
                            <a
                                href="/upcoming"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Track Order
                            </a>
                        </div>
                    )}
                </div>

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>
                        <ImCross />
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default OrderDetailsModal;
