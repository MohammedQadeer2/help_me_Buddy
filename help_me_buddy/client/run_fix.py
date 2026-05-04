
content = """import { motion } from "framer-motion";
import Avatar from "./Avatar";

export default function ServiceCard({ provider, onClick }) {
  const isTopRated = provider.rating >= 4.8;
  const isSuperPro = provider.jobsCompleted > 300;
  const isAvailable = provider.availability;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-5 lg:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 cursor-pointer hover:bg-gray-800 transition-all shadow-md overflow-hidden relative"
    >
      <div className="flex flex-row items-start sm:items-center gap-4 lg:gap-6 w-full">
        <div className="relative shrink-0 mt-1 sm:mt-0">
          <Avatar src={provider.profileImage} alt={provider.name} size="xl" className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${isSuperPro ? "border-[3px] border-purple-500" : isTopRated ? "border-[3px] border-yellow-500" : "border-[3px] border-gray-700"} shadow-md`} />
          <div className={`absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 border-4 border-gray-900 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-500"}`}></div>
        </div>

        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
          <div className="flex flex-wrap gap-2 mb-1.5 sm:mb-2">
            {isTopRated && (
              <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-[10px] sm:text-xs md:text-sm px-2.5 py-1 rounded-md font-bold uppercase tracking-wider shadow-sm">
                ⭐ Top Rated
              </span>
            )}
            {isSuperPro && (
              <span className="bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] sm:text-xs md:text-sm px-2.5 py-1 rounded-md font-bold uppercase tracking-wider shadow-sm">
                ⚡ Super Pro
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-100 truncate tracking-tight">{provider.name}</h3>

          <div className="flex items-center gap-2 mt-1 sm:mt-1.5 whitespace-nowrap">      
            <p className="text-[10px] sm:text-sm md:text-base text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-2 sm:px-3 py-1 rounded font-mono inline-block block">{provider.category}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-xs sm:text-sm md:text-base">
            <span className="flex items-center text-gray-200 font-bold bg-gray-950/60 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-inner">⭐ {provider.rating} <span className="text-gray-500 font-medium ml-1">({provider.reviews})</span></span>
            <span className="text-gray-400 font-medium bg-gray-950/60 px-2.5 py-1.5 rounded-lg shadow-inner hidden sm:flex items-center gap-1">✅ {provider.jobsCompleted} <span className="text-gray-500">jobs</span></span>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-row sm:flex-col items-center justify-between sm:items-end bg-gray-950 sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-gray-800 sm:border-none shrink-0 shadow-inner sm:shadow-none">
        <p className="text-2xl sm:text-3xl font-black text-green-400 drop-shadow-md">₹{provider.price}</p>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Per Job</p>
      </div>
    </motion.div>
  );
}
"""
with open("src/components/ServiceCard.js", "w", encoding="utf-8") as f:
    f.write(content)

