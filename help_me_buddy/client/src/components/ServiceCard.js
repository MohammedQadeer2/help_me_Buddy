import { motion } from "framer-motion";
import Avatar from "./Avatar";

export default function ServiceCard({ provider, onClick, onBook }) {
  const isTopRated = provider.rating >= 4.8;
  const isSuperPro = provider.jobsCompleted > 300;
  const isAvailable = provider.availability;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-3 sm:p-4 lg:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-gray-800 transition-all shadow-sm overflow-hidden relative"
    >
      <div className="flex flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
        <div className="relative shrink-0 mt-1 sm:mt-0">
          <Avatar src={provider.profileImage} alt={provider.name || (provider.userId && provider.userId.name)} size="lg" className={`w-12 h-12 sm:w-16 sm:h-16 ${isSuperPro ? "border-2 border-purple-500" : isTopRated ? "border-2 border-yellow-500" : "border-2 border-gray-700"} shadow-sm`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-900 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-500"}`}></div>
        </div>

        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1">
            {isTopRated && (
              <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-[9px] sm:text-[10px] md:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
                ⭐ Top Rated
              </span>
            )}
            {isSuperPro && (
              <span className="bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[9px] sm:text-[10px] md:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
                ⚡ Super Pro
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-100 truncate tracking-tight">{provider.name || (provider.userId && provider.userId.name)}</h3>

          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 whitespace-nowrap">      
            <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded inline-block">{provider.category?.name || provider.category}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-2.5 text-xs sm:text-sm">
            <span className="flex items-center text-gray-200 font-bold bg-gray-950/60 px-2 py-1 rounded-md shadow-inner text-[11px] sm:text-xs">⭐ {provider.rating} <span className="text-gray-500 font-medium ml-1">({provider.reviews})</span></span>
            <span className="text-gray-400 font-medium bg-gray-950/60 px-2 py-1 rounded-md shadow-inner hidden sm:flex items-center gap-1 text-[11px] sm:text-xs">✅ {provider.jobsCompleted} <span className="text-gray-500">jobs</span></span>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-auto mt-3 sm:mt-0 flex flex-row sm:flex-col items-center justify-between sm:items-end bg-gray-950 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-800 sm:border-none shrink-0 shadow-inner sm:shadow-none">
        <div className="flex flex-col items-start sm:items-end">
          <p className="text-lg sm:text-2xl font-bold text-green-400 drop-shadow-sm">₹{provider.pricePerHour}</p>
          <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Per Hour</p>
        </div>
        {onBook && (
          <button 
            onClick={(e) => { e.stopPropagation(); onBook(provider); }}
            className="mt-0 sm:mt-3 px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 border border-blue-500/50"
          >
            Book Now
          </button>
        )}
      </div>
    </motion.div>
  );
}
