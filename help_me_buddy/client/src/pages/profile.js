import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { getMyBookings } from "../api/bookingApi";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, activeMode } = useAuth(); // Fetch global user
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setUserBookings(res.data);
      console.log("User Bookings:", res.data);
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-24 md:pb-32 pt-6 md:pt-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => navigate("/home")}
            className="px-4 md:px-5 py-2 bg-gray-900 border border-gray-800 rounded-full text-xs md:text-sm font-bold shadow-lg hover:bg-gray-800 transition"
          >
            ← Home
          </button>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">My Profile</h1>
          <div className="w-16 md:w-20"></div> {/* Spacer for centering */}
        </div>

        {/* 👤 Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 p-6 md:p-8 lg:p-10 rounded-2xl mb-8 lg:mb-10 text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-blue-900/30 to-transparent"></div>
          
          <div className="relative z-10 flex justify-center mb-4 md:mb-6">
            <Avatar src={user?.profileImage} size="xl" className="w-20 h-20 md:w-28 md:h-28 shadow-xl border-[4px] border-gray-900 bg-gray-800" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">{user?.name || "Guest User"}</h1>
          <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4 font-medium">{user?.email || "No email provided"}</p>
          <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 text-xs md:text-sm font-bold rounded-full uppercase tracking-wider border border-blue-500/30">
            {activeMode === "provider" ? "Provider" : "Hiring"} Account
          </span>
        </motion.div>

        {/* 📜 Booking History */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-200 tracking-wide border-b border-gray-800 pb-3">Recent Bookings</h2>

          <div className="space-y-4 md:space-y-6">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading bookings...</div>
            ) : userBookings.length === 0 ? (
              <div className="text-center py-8 md:py-10 bg-gray-900/50 border border-gray-800 rounded-2xl border-dashed">
                <p className="text-base md:text-lg text-gray-400 font-bold tracking-wide">No bookings found.</p>
              </div>
            ) : userBookings.map((b) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={b._id}
                className="bg-gray-900 border border-gray-800 p-4 md:p-6 lg:p-8 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 shadow-lg hover:border-gray-700 transition"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={b.providerId?.profileImage} size="md" className="w-12 h-12 md:w-16 md:h-16 border-2 border-gray-700" />
                  <div>
                    <p className="text-base md:text-lg font-bold text-white mb-0.5 tracking-tight">
                      {b.providerId?.userId?.name || b.providerId?.name || "Provider Info Unavailable"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 mt-1 flex items-center gap-2 font-medium bg-gray-800/50 px-2.5 py-1 rounded border border-gray-700/50 w-max">
                      📅 <span className="text-gray-300 font-bold">{b.bookingDate}</span> at <span className="text-gray-300 font-bold">{b.bookingTime}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-2 font-semibold uppercase tracking-wider">
                      {b.category?.name || b.category || "Category Unavailable"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-center">
                  <span className={`inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold mb-2 w-max uppercase tracking-wider ${
                    b.status === "Completed" ? "bg-green-900/30 text-green-400 border border-green-800 shadow-[0_0_10px_rgba(34,197,94,0.1)]" :
                    b.status === "Pending" ? "bg-blue-900/30 text-blue-400 border border-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.1)]" :
                    "bg-yellow-900/30 text-yellow-400 border border-yellow-800 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                  }`}>
                    {b.status || "Pending"}
                  </span>
                  <p className="text-sm md:text-base font-medium text-gray-300 max-w-[280px] lg:max-w-md truncate" title={b.issueDescription}>
                    {b.issueDescription}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ⚙️ Account Settings link */}
        <div 
          onClick={() => navigate("/settings")}
          className="bg-gray-900 border border-gray-800 p-5 md:p-6 rounded-2xl mb-8 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition shadow-sm group"
        >
          <span className="font-bold text-base md:text-lg text-gray-300 tracking-wide group-hover:text-white transition">⚙️ Account Settings</span>
          <span className="text-gray-500 text-xl group-hover:text-white group-hover:translate-x-2 transition-transform">→</span>
        </div>

        {/* 🚪 Logout */}
        <Button variant="danger" onClick={handleLogout} className="py-3 md:py-4 text-base md:text-lg font-bold w-full rounded-xl tracking-wider uppercase shadow-md hover:scale-[1.02]">
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Profile;