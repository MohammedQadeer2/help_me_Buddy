import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Avatar from "../components/Avatar";

function Details() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the selected provider from the React Router state
  const provider = location.state?.provider;

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-semibold mb-4">No Provider Selected</h2>
        <Button variant="outline" onClick={() => navigate("/home")} className="max-w-xs">
          Return Home
        </Button>
      </div>
    );
  }

  // Evaluate Badges again for Details view
  const isTopRated = provider.rating >= 4.8;
  const isSuperPro = provider.jobsCompleted > 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-24 md:pb-32">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] sm:px-6 lg:px-8">

        {/* 🔙 Floating Back Button & Header Image */}
        <div className="relative h-40 sm:h-48 md:h-64 lg:h-80 bg-gray-800 w-full rounded-b-2xl md:rounded-b-3xl overflow-hidden shadow-xl">
          {provider.portfolio && provider.portfolio.length > 0 ? (
            <img 
              src={provider.portfolio[0]} 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
              alt="Banner" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-gray-900 opacity-60" />
          )}
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 lg:top-6 lg:left-6 px-4 py-2 bg-gray-950/70 backdrop-blur-md border border-gray-700/50 rounded-full text-xs md:text-sm font-bold shadow-lg hover:bg-gray-800 transition z-10"
          >
            ← Back
          </button>
        </div>

          <div className="px-4 md:px-6 lg:px-12 -mt-12 md:-mt-16 relative z-20">
          {/* 👤 Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 p-6 md:p-8 lg:p-10 rounded-2xl mb-6 lg:mb-10 shadow-xl text-center relative overflow-visible"
          >
            {/* Avatar positioned halfway off the card */}
            <div className="flex justify-center -mt-16 md:-mt-20 mb-4 relative z-30">
              <Avatar src={provider.profileImage} size="xl" className={`w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 shadow-black shadow-lg ${isSuperPro ? 'border-[4px] border-purple-500' : isTopRated ? 'border-[4px] border-yellow-500' : 'border-[4px] border-gray-700'}`} />
              <div className={`absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-[4px] border-gray-900 rounded-full ${provider.availability ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            </div>

            {/* Badges centered above name */}
            <div className="flex justify-center flex-wrap gap-2 mb-3">
              {isTopRated && (
                <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-[10px] md:text-xs px-3 py-1 rounded-full font-bold shadow-sm uppercase tracking-wider inline-block">
                  🏆 Top Rated
                </span>
              )}
              {isSuperPro && (
                <span className="bg-purple-500/20 border border-purple-500/50 text-purple-400 text-[10px] md:text-xs px-3 py-1 rounded-full font-bold shadow-sm uppercase tracking-wider inline-block">
                  ⚡ Super Pro
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1.5 tracking-tight flex justify-center items-center gap-2">
              {/* Added fallback for API's nested user name || Mock Data string */}
              {provider.name || (provider.userId?.name) || "Unknown Provider"}
            </h1>
            <p className="text-sm md:text-base lg:text-lg font-bold text-blue-400 mb-3 uppercase tracking-widest">
              {/* Added fallback to read API category object || Mock Data string */}
              {provider.category?.name || provider.category || "General"}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-5 text-xs md:text-sm lg:text-base text-gray-300 mb-5">
              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 md:py-1.5 rounded-lg border border-gray-700/50">⭐ <span className="font-bold text-white">{provider.rating || 0}</span> <span className="text-gray-400">({provider.reviews || 0})</span></span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-200 bg-gray-800/50 px-2 py-1 md:py-1.5 rounded-lg border border-gray-700/50">✅ {provider.jobsCompleted || 0} <span className="text-gray-400 font-normal">jobs</span></span>
              {/* Added fallback, also checked if provider.location is empty so `.split` doesn't crash */}
              <span className="flex items-center gap-1.5 font-medium text-gray-300 bg-gray-800/50 px-2 py-1 md:py-1.5 rounded-lg border border-gray-700/50">📍 {(provider.location?.name || provider.location || "Unknown").split(',')[0]}</span>
            </div>

            <div className="inline-block px-6 py-2 md:py-3 bg-gray-950 rounded-full text-xl md:text-2xl font-extrabold text-green-400 border-2 border-gray-800 shadow-inner">
              {/* Fallback to pricePerHour (API) or price (Mock) */}
              ₹{provider.pricePerHour || provider.price || 0} <span className="text-xs md:text-sm text-gray-500 font-semibold uppercase tracking-widest ml-1">/ hr</span>
            </div>
          </motion.div>

          {/* 📄 About */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 p-5 md:p-6 lg:p-8 rounded-2xl mb-6 lg:mb-8 shadow-md"
          >
            <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-100 tracking-wide border-b border-gray-800 pb-2">
              About
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-4xl">
              {/* Used fallback for bio or about fields */}
              {provider.bio || provider.about || "No bio provided."}
            </p>
          </motion.div>

          {/* 📸 Portfolio Gallery */}
          {provider.portfolio && provider.portfolio.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 lg:mb-8"
            >
              <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-100 tracking-wide px-2 border-b border-gray-800 pb-2">
                Portfolio
              </h2>
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {provider.portfolio.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Portfolio ${idx}`} 
                    className="h-32 md:h-48 lg:h-56 w-48 md:w-64 lg:w-72 object-cover rounded-xl shadow-sm border border-gray-700 snap-center shrink-0 hover:scale-[1.02] transition-transform cursor-pointer" 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 📍 Live Location Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 p-5 md:p-6 lg:p-8 rounded-2xl mb-8 lg:mb-12 shadow-md"
          >
            <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
              <h2 className="text-lg md:text-xl font-bold text-gray-100 flex items-center gap-2 tracking-wide">
                📍 Provider Location
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </h2>
            </div>
            <div className="w-full h-40 sm:h-56 rounded-lg overflow-hidden border border-gray-800 relative z-10 bg-gray-800 shadow-inner">
              {/* Google Maps iFrame based on Provider's location string */}
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(provider.location?.name || provider.location || "India")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                title="Provider Location Map"
              ></iframe>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center uppercase tracking-wide font-medium">Tracking via verified address</p>
          </motion.div>
        </div>

        {/* 🚀 Fixed Bottom ACTION BUTTONS */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex justify-center z-50">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] flex flex-col sm:flex-row gap-3 sm:px-6 lg:px-8">
            <div className="flex gap-3 w-full sm:w-auto">
              <a href="tel:9876543210" className="flex-1 sm:w-24">
                 <Button variant="outline" className="w-full">
                   📞
                 </Button>
              </a>

              <div className="flex-1 sm:w-24">
                <Button variant="outline" className="w-full" onClick={() => navigate("/chat", { state: { partner: provider } })}>
                  💬
                </Button>
              </div>
            </div>

            <div className="w-full sm:flex-1">
              <Button variant="primary" onClick={() => navigate("/booking", { state: { provider } })} className="w-full">
                📅 Book Now
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;