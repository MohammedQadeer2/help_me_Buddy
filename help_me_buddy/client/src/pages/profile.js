import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { bookings, providers } from "../data/mockData";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth(); // Fetch global user

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Enrich booking data with provider details for display
  const userBookings = bookings.map(b => {
    const provider = providers.find(p => p.id === b.providerId);
    return { ...b, provider };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-24 md:pb-32 pt-6 md:pt-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <button
            onClick={() => navigate("/home")}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-gray-900 border border-gray-800 rounded-full text-sm md:text-base font-bold shadow-lg hover:bg-gray-800 transition shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            ← Home
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">My Profile</h1>
          <div className="w-20 md:w-32"></div> {/* Spacer for centering */}
        </div>

        {/* 👤 Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 p-8 md:p-12 lg:p-16 rounded-3xl mb-12 lg:mb-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-blue-900/30 to-transparent"></div>
          
          <div className="relative z-10 flex justify-center mb-6 md:mb-8">
            <Avatar src={user?.profileImage} size="xl" className="w-28 h-28 md:w-36 md:h-36 shadow-2xl border-[6px] border-gray-900 bg-gray-800" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-3 tracking-tight">{user?.name || "Guest User"}</h1>
          <p className="text-base md:text-lg text-gray-400 mb-4 md:mb-6 font-medium">{user?.email || "No email provided"}</p>
          <span className="inline-block px-5 md:px-6 py-2 md:py-2.5 bg-blue-600/20 text-blue-400 text-sm md:text-base font-bold rounded-full uppercase tracking-widest border border-blue-500/30 shadow-inner">
            {role || "User"} Account
          </span>
        </motion.div>

        {/* 📜 Booking History */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-gray-200 tracking-wide border-b border-gray-800 pb-4">Recent Bookings</h2>

          <div className="space-y-6 md:space-y-8">
            {userBookings.map((b) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={b.id}
                className="bg-gray-900 border border-gray-800 p-6 md:p-8 lg:p-10 rounded-3xl flex flex-col sm:flex-row justify-between gap-6 shadow-xl hover:border-gray-700 transition"
              >
                <div className="flex items-center gap-6">
                  <Avatar src={b.provider?.profileImage} size="md" className="w-16 h-16 md:w-20 md:h-20 border-2 border-gray-700" />
                  <div>
                    <p className="text-lg md:text-xl font-extrabold text-white mb-1 tracking-tight">{b.provider?.name || "Provider Info Unavailable"}</p>
                    <p className="text-sm md:text-base text-gray-400 mt-1 md:mt-2 flex items-center gap-2 font-medium bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50 w-max">
                      📅 <span className="text-gray-300 font-bold">{b.date}</span> at <span className="text-gray-300 font-bold">{b.time}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-center">
                  <span className={`inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm md:text-base font-bold mb-3 md:mb-4 w-max uppercase tracking-wider ${
                    b.status === "Completed" ? "bg-green-900/30 text-green-400 border border-green-800 shadow-[0_0_10px_rgba(34,197,94,0.1)]" :
                    b.status === "Upcoming" ? "bg-blue-900/30 text-blue-400 border border-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.1)]" :
                    "bg-yellow-900/30 text-yellow-400 border border-yellow-800 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                  }`}>
                    {b.status}
                  </span>
                  <p className="text-base md:text-lg font-medium text-gray-300 max-w-[280px] lg:max-w-md truncate" title={b.description}>
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {userBookings.length === 0 && (
              <div className="text-center py-12 md:py-16 bg-gray-900/50 border-2 border-gray-800 rounded-3xl border-dashed">
                <p className="text-lg md:text-xl text-gray-400 font-bold tracking-wide">No bookings found.</p>
              </div>
            )}
          </div>
        </div>

        {/* ⚙️ Account Settings link */}
        <div 
          onClick={() => navigate("/settings")}
          className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-3xl mb-10 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition shadow-lg group"
        >
          <span className="font-extrabold text-lg md:text-xl text-gray-300 tracking-wide group-hover:text-white transition">⚙️ Account Settings</span>
          <span className="text-gray-500 text-2xl group-hover:text-white group-hover:translate-x-2 transition-transform">→</span>
        </div>

        {/* 🚪 Logout */}
        <Button variant="danger" onClick={handleLogout} className="py-5 md:py-6 text-lg md:text-xl font-extrabold w-full rounded-2xl tracking-widest uppercase shadow-xl hover:scale-[1.02]">
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Profile;