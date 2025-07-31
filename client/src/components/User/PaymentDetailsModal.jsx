import React from "react";

const PaymentDetailsModal = ({ transaction, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold mb-4 text-orange-600">
                    Payment Details
                </h2>

                <div className="space-y-2 text-sm">
                    <div>
                        <strong>Transaction ID:</strong> {transaction.gatewayTransactionId}
                    </div>
                    <div>
                        <strong>Order ID:</strong> {transaction.orderId}
                    </div>
                    <div>
                        <strong>Amount:</strong> {transaction.amount} {transaction.currency}
                    </div>
                    <div>
                        <strong>Method:</strong> {transaction.paymentMethod}
                    </div>
                    <div>
                        <strong>Type:</strong> {transaction.type}
                    </div>
                    <div>
                        <strong>Status:</strong> {transaction.status}
                    </div>
                    <div>
                        <strong>Payout:</strong> {transaction.payoutStatus}
                    </div>
                    <div>
                        <strong>Created At:</strong>{" "}
                        {new Date(transaction.createdAt).toLocaleString()}
                    </div>
                    <div>
                        <strong>Updated At:</strong>{" "}
                        {new Date(transaction.updatedAt).toLocaleString()}
                    </div>

                    {transaction.failureReason && (
                        <div>
                            <strong>Failure Reason:</strong> {transaction.failureReason}
                        </div>
                    )}

                    <details className="bg-gray-100 rounded p-2">
                        <summary className="cursor-pointer font-semibold">
                            Gateway Response
                        </summary>
                        <pre className="overflow-x-auto">
                            <p>{transaction.gatewayResponse.code}</p>
                            <p>{transaction.gatewayResponse.message}</p>
                        </pre>
                    </details>
                </div>

                <button
                    onClick={onClose}
                    className="btn btn-primary mt-6 block ml-auto"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PaymentDetailsModal;
