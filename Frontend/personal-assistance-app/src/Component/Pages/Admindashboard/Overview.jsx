import { BarChart2, Bell, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

import Header from "../../UI/AdminDashboard/Common/Header";
import StatCard from "../../UI/AdminDashboard/Common/StatCard";
import RevenueByServiceChart from "../../UI/AdminDashboard/Revenue/RevenueByServiceChart";
import CategoryDistributionChart from "../../UI/AdminDashboard/Category/CategoryDistributionChart";
import ProfitLossOverviewChart from "../../UI/AdminDashboard/ProfitLoss/ProfitLossOverviewChart";
import { useState, useEffect } from "react";
import axios from "axios";

const Overview = () => {
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalProvider, setTotalProvider] = useState(0);
  const [socket, setsocket] = useState(null);
  const [notification, setNotification] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const getTotalBooking = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/totBooking")
        .then((res) => {
          console.log(res);
          setTotalBooking(res.data.count);
        });
    };

    const getTotalUser = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/totUser")
        .then((res) => {
          console.log(res);
          setTotalUsers(res.data.count);
        });
    };

    const getTotalServices = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/totService")
        .then((res) => {
          setTotalServices(res.data.count);
        });
    };

    const getTotalProviders = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/totProvider")
        .then((res) => {
          setTotalProvider(res.data.count);
        });
    };
    getTotalBooking();
    getTotalUser();
    getTotalServices();
    getTotalProviders();

    //socket connection
    const newSocket = io("http://localhost:8070");
    setsocket(newSocket);

    newSocket.on("New_REFUND_REQUEST", (data) => {
      setNotification((prev) => [
        {
          ...data,
          id: Date.now(),
          read: false,
        },
        ...prev,
      ]);
    });
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const markAllasRead = () => {
    setNotification((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    setNotification((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex-1 w-64 relative z-10  ml-[2%] ">
      <Header title="Overview" />
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">Notification</h3>
              <button
                onClick={markAllasRead}
                className="text-sm text-indigo-500 hover:text-indigo-900"
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notification.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notification.map((notifications) => (
                  <div
                    key={notifications.id}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">New Refund Request</span>
                      <span className="text-xs text-gray-500">
                        {new Date(notifications.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">
                      Amount: ${notification.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      Reason: {notification.reason}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-9 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Agreements"
            icon={Zap}
            value={totalBooking}
            color="#6366F1"
          />
          <StatCard
            name="Users"
            icon={Users}
            value={totalUsers}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Services"
            icon={ShoppingBag}
            value={totalServices}
            color="#EC4899"
          />
          <StatCard
            name="Total Providers"
            icon={BarChart2}
            value={totalProvider}
            color="#10B981"
          />
        </motion.div>
        {/*add Charts*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueByServiceChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};
export default Overview;
