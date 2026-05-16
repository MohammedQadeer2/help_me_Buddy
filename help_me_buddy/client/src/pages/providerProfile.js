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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex justify-center text-white pb-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-28 w-80 h-80 bg-cyan-500/10 blur-[110px] rounded-full"></div>
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-blue-600/10 blur-[140px] rounded-full"></div>
      </div>
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 sm:px-5 lg:px-6 py-5">

        {/* 🔙 Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl font-bold tracking-wide">Pro Center</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        {/* 👤 Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Banner */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan-500/20 to-blue-600/20"></div>
          
          <div className="relative z-10 flex justify-center mb-4">
            <Avatar src={user?.profileImage} size="xl" className="shadow-lg border-4 border-gray-900" />
          </div>

          <h1 className="text-xl md:text-2xl font-bold">{user?.name || "Professional"}</h1>
          <p className="text-xs font-medium text-cyan-300 mt-1 uppercase tracking-[0.2em]">{providerStats.skill}</p>

          <div className="flex justify-center items-center gap-2 text-[11px] text-slate-300/70 mt-3 font-medium">
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-yellow-300">⭐ {providerStats.rating}</span>
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">{providerStats.experience}</span>
          </div>

          {/* Availability Toggle */}
          <div className="mt-6 flex items-center justify-center gap-3 border-t border-white/10 pt-4">
            <span className="text-sm text-slate-300/70 font-medium">Status:</span>
            <button
              onClick={() => setOnline(!online)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition duration-300 ${
                online
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                  : "bg-white/5 text-slate-300/70 border border-white/10"
              }`}
            >
              {online ? "● Taking Jobs" : "○ Offline"}
            </button>
          </div>
        </motion.div>

        {/* 📊 Lifetime Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl text-center">
            <div className="w-10 h-10 bg-cyan-500/20 text-cyan-300 flex items-center justify-center rounded-full mx-auto mb-2 text-lg">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-white">{providerStats.jobs}</h3>
            <p className="text-[10px] text-slate-300/70 mt-1 font-medium tracking-wide uppercase">Jobs Done</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl text-center">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-300 flex items-center justify-center rounded-full mx-auto mb-2 text-lg">
              💵
            </div>
            <h3 className="text-xl font-bold text-white">₹{providerStats.earnings}</h3>
            <p className="text-[10px] text-slate-300/70 mt-1 font-medium tracking-wide uppercase">Earnings</p>
          </div>
        </div>

        {/* ⚙️ Management List */}
        <div className="space-y-3 mb-6">
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition">
            <span className="font-medium text-slate-200">📝 Edit Profile Details</span>
            <span className="text-slate-400">→</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition">
            <span className="font-medium text-slate-200">📸 Manage Portfolio Images</span>
            <span className="text-slate-400">→</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition">
            <span className="font-medium text-slate-200">⭐ View Client Reviews</span>
            <span className="text-slate-400">→</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition">
            <span className="font-medium text-slate-200">🏦 Bank & Tax Details</span>
            <span className="text-slate-400">→</span>
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