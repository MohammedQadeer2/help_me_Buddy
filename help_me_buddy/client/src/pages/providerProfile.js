import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import Button from "../components/Button";

function ProviderProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Uses Context API
  const [online, setOnline] = useState(true);

  const providerStats = {
    skill: "Certified Professional",
    rating: 4.8,
    experience: "5+ years",
    jobs: 142,
    earnings: "18,500",
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl font-bold">Pro Center</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        {/* 👤 Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-8 rounded-2xl mb-6 text-center shadow-xl relative overflow-hidden"
        >
          {/* Banner */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-900 to-purple-900 opacity-40"></div>
          
          <div className="relative z-10 flex justify-center mb-4">
            <Avatar src={user?.profileImage} size="xl" className="shadow-lg border-4 border-gray-900" />
          </div>

          <h1 className="text-2xl font-bold">{user?.name || "Professional"}</h1>
          <p className="text-sm font-medium text-blue-400 mt-1">{providerStats.skill}</p>

          <div className="flex justify-center items-center gap-3 text-xs text-gray-400 mt-3 font-medium">
            <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700 text-yellow-500">⭐ {providerStats.rating}</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">{providerStats.experience}</span>
          </div>

          {/* Availability Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3 border-t border-gray-800 pt-6">
            <span className="text-sm text-gray-400 font-medium">Status:</span>
            <button
              onClick={() => setOnline(!online)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition duration-300 ${
                online
                  ? "bg-green-600/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                  : "bg-gray-800 text-gray-400 border border-gray-600"
              }`}
            >
              {online ? "● Taking Jobs" : "○ Offline"}
            </button>
          </div>
        </motion.div>

        {/* 📊 Lifetime Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm text-center">
            <div className="w-10 h-10 bg-blue-900/30 text-blue-400 flex items-center justify-center rounded-full mx-auto mb-2 text-lg">
              🛠️
            </div>
            <h3 className="text-2xl font-bold text-white">{providerStats.jobs}</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide uppercase">Jobs Done</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm text-center">
            <div className="w-10 h-10 bg-green-900/30 text-green-400 flex items-center justify-center rounded-full mx-auto mb-2 text-lg">
              💵
            </div>
            <h3 className="text-2xl font-bold text-white">₹{providerStats.earnings}</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide uppercase">Earnings</p>
          </div>
        </div>

        {/* ⚙️ Management List */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-800 transition">
            <span className="font-medium text-gray-300">📝 Edit Profile Details</span>
            <span className="text-gray-500">→</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-800 transition">
            <span className="font-medium text-gray-300">📸 Manage Portfolio Images</span>
            <span className="text-gray-500">→</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-800 transition">
            <span className="font-medium text-gray-300">⭐ View Client Reviews</span>
            <span className="text-gray-500">→</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-800 transition">
            <span className="font-medium text-gray-300">🏦 Bank & Tax Details</span>
            <span className="text-gray-500">→</span>
          </div>
        </div>

        {/* 🚪 Actions */}
        <Button variant="danger" onClick={handleLogout}>
          Log Out of Provider Account
        </Button>

      </div>
    </div>
  );
}

export default ProviderProfile;