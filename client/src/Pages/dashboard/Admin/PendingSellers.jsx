import React, { useState } from "react";

const mockSellers = [
  {
    id: "seller001",
    name: "Alice Boutique",
    email: "alice@example.com",
    joined: "2025-07-25",
  },
  {
    id: "seller002",
    name: "John’s Gadgets",
    email: "john@example.com",
    joined: "2025-07-28",
  },
];

const PendingSellers = () => {
  const [sellers, setSellers] = useState(mockSellers);
  const [loading, setLoading] = useState(null);

  const handleAction = async (sellerId, action) => {
    setLoading(sellerId + action);

    try {
      // Replace with real backend API
      await fetch(`/api/sellers/${sellerId}/${action.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Seller ${action}ed by admin.`,
        }),
      });

      // Remove seller from list
      setSellers((prev) => prev.filter((s) => s.id !== sellerId));
    } catch (error) {
      console.error(`Failed to ${action} seller`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Pending Sellers</h2>

      {sellers.length === 0 ? (
        <div className="text-gray-600 text-center mt-10">
          No pending sellers.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller) => (
                    <tr key={seller.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{seller.name}</td>
                      <td className="px-6 py-4">{seller.email}</td>
                      <td className="px-6 py-4">{seller.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleAction(seller.id, "Accept")}
                            disabled={loading === seller.id + "Accept"}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50">
                            {loading === seller.id + "Accept"
                              ? "Accepting..."
                              : "Accept"}
                          </button>
                          <button
                            onClick={() => handleAction(seller.id, "Reject")}
                            disabled={loading === seller.id + "Reject"}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
                            {loading === seller.id + "Reject"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white p-4 rounded-xl shadow-md space-y-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">{seller.name}</h3>
                  <p className="text-sm text-gray-600">{seller.email}</p>
                  <p className="text-xs text-gray-500">
                    Joined: {seller.joined}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(seller.id, "Accept")}
                    disabled={loading === seller.id + "Accept"}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50">
                    {loading === seller.id + "Accept"
                      ? "Accepting..."
                      : "Accept"}
                  </button>
                  <button
                    onClick={() => handleAction(seller.id, "Reject")}
                    disabled={loading === seller.id + "Reject"}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
                    {loading === seller.id + "Reject"
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PendingSellers;
