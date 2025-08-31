import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import AdvancedTimer from "../components/AdvancedTimer";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIds, setHighlightedIds] = useState([]);
  const previousOrdersRef = useRef([]);

  const itemsPerPage = 3;
  const navigate = useNavigate();

  const playNotificationSound = () => {
    const audio = new Audio("/ding.mp3");
    audio.play();
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        const sorted = res.data.orders
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((order, index, arr) => ({
            ...order,
            numericId: arr.length - index,
          }));

        const prevIds = previousOrdersRef.current.map((o) => o._id);
        const newOrderIds = sorted
          .filter((o) => !prevIds.includes(o._id))
          .map((o) => o._id);

        if (newOrderIds.length > 0) {
          setHighlightedIds(newOrderIds);
          playNotificationSound();
          toast.success("🆕 New order update received!");
          setTimeout(() => setHighlightedIds([]), 3000); // remove highlight after 3 seconds
        }

        if (
          JSON.stringify(previousOrdersRef.current) !== JSON.stringify(sorted)
        ) {
          setOrders(sorted);
          previousOrdersRef.current = sorted;
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-800";
      case "Packing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Out for delivery":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      "Order Placed": "📦",
      Packing: "🧳",
      Shipped: "🚚",
      "Out for delivery": "📍",
      Delivered: "✅",
    };
    return map[status] || "❔";
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      String(order.numericId).includes(query) ||
      formatDateTime(order.date).toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8 bg-white from-gray-50 to-blue-50 min-h-screen">
      <div className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by order ID, product name, or date..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading your orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">
          🛒 No matching orders found.
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedOrders.map((order, index) => {
              const itemsTotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const deliveryCharge =
                typeof order.deliveryCharge === "number"
                  ? order.deliveryCharge
                  : itemsTotal < 200
                  ? 30
                  : 0;
              const discount = order.discount || 0;
              const totalPayable = itemsTotal + deliveryCharge - discount;

              const isHighlighted = highlightedIds.includes(order._id);

              return (
                <div
                  key={index}
                  className={`bg-white p-4 md:p-6 rounded-xl shadow-md border hover:shadow-lg transition relative ${
                    isHighlighted ? "ring-2 ring-green-400 animate-pulse" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div className="text-blue-900 font-bold text-lg">
                      My Order No. {String(order.numericId).padStart(2, "0")} -
                      Details
                    </div>
                    <div className="text-sm text-gray-600">
                      Date & Time : {formatDateTime(order.date)}
                    </div>
                  </div>

                  <div className="max-h-40 overflow-y-auto border-y py-3 space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                      >
                        <div className="flex gap-3 items-center">
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-800">
                              {item.name} × {item.quantity} ({item.size})
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          {currency}
                          {item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                    <div>
                      <p> Items: {order.items.length}</p>
                      <p>
                         Payment:{" "}
                        <span className="font-semibold">
                          {order.payment ? "Paid" : "Pending"}
                        </span>{" "}
                        ({order.paymentMethod})
                      </p>
                    </div>
                    <div>
                      <p>
                       {order.address.city}, {order.address.country}
                      </p>
                      <p>
                        ETD:{" "}
                        {formatDateTime(
                          new Date(
                            new Date(order.date).getTime() + 30 * 60000
                          )
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <p className="text-sm">
                        Item Total: {currency}
                        {itemsTotal}
                      </p>
                      <p className="text-sm">
                        Delivery Charge: {currency}
                        {deliveryCharge}
                      </p>
                      <p className="text-base font-bold text-gray-800">
                        Total Payable: {currency}
                        {totalPayable}
                      </p>

                      <span
                        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusBadge(order.status)} {order.status}
                      </span>

                      <AdvancedTimer
                        orderDate={order.date}
                        status={order.status}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-full mt-8 overflow-x-auto">
              <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-2 min-w-[300px] sm:gap-3 px-2 py-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`min-w-[40px] px-3 py-2 rounded-full text-sm font-semibold border transition ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-900 cursor-not-allowed"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  ◀
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                      return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    const isHidden = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {isHidden && (
                          <span className="px-2 text-gray-400 font-bold">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[40px] px-2 py-2 rounded-full text-sm font-semibold border transition ${
                            currentPage === page
                              ? "bg-gray-600 text-white"
                              : "bg-white text-gray-600 hover:bg-blue-100"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`min-w-[40px] px-3 py-2 rounded-full text-sm font-semibold border transition ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-900 cursor-not-allowed"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  ▶
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <a
              href="https://wa.me/917650965133"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
            >
              💬 Chat with Customer Support
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
