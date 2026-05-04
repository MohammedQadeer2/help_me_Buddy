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
        <div className="relative h-56 sm:h-72 md:h-96 lg:h-[450px] bg-gray-800 w-full rounded-b-3xl md:rounded-b-[3rem] overflow-hidden shadow-2xl">
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
            className="absolute top-6 left-6 lg:top-10 lg:left-10 px-6 py-2.5 bg-gray-950/70 backdrop-blur-md border border-gray-700/50 rounded-full text-sm md:text-base font-bold shadow-lg hover:bg-gray-800 transition z-10"
          >
            ← Back
          </button>
        </div>

          <div className="px-4 md:px-6 lg:px-12 -mt-16 md:-mt-24 lg:-mt-32 relative z-20">
          {/* 👤 Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 p-8 md:p-10 lg:p-12 rounded-3xl mb-8 lg:mb-12 shadow-2xl text-center relative overflow-visible"
          >
            {/* Avatar positioned halfway off the card */}
            <div className="flex justify-center -mt-20 md:-mt-24 lg:-mt-28 mb-6 relative z-30">
              <Avatar src={provider.profileImage} size="xl" className={`w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 shadow-black shadow-2xl ${isSuperPro ? 'border-[6px] border-purple-500' : isTopRated ? 'border-[6px] border-yellow-500' : 'border-[6px] border-gray-700'}`} />
              <div className={`absolute bottom-4 right-4 md:bottom-6 md:right-6 w-8 h-8 md:w-10 md:h-10 border-[6px] border-gray-900 rounded-full ${provider.availability ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            </div>

            {/* Badges centered above name */}
            <div className="flex justify-center flex-wrap gap-3 mb-4">
              {isTopRated && (
                <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs md:text-sm px-4 py-1.5 rounded-full font-bold shadow-md uppercase tracking-wider inline-block">
                  🏆 Top Rated
                </span>
              )}
              {isSuperPro && (
                <span className="bg-purple-500/20 border border-purple-500/50 text-purple-400 text-xs md:text-sm px-4 py-1.5 rounded-full font-bold shadow-md uppercase tracking-wider inline-block">
                  ⚡ Super Pro
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 tracking-tight flex justify-center items-center gap-2">
              {provider.name}
            </h1>
            <p className="text-base md:text-lg lg:text-xl font-bold text-blue-400 mb-4 uppercase tracking-widest">
              {provider.category}
            </p>

            <div className="flex justify-center items-center gap-5 md:gap-6 text-sm md:text-base lg:text-lg text-gray-300 mb-6">
              <span className="flex items-center gap-1.5 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">⭐ <span className="font-bold text-white">{provider.rating}</span> <span className="text-gray-400">({provider.reviews})</span></span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-200 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">✅ {provider.jobsCompleted} <span className="text-gray-400 font-normal">jobs</span></span>
              <span className="flex items-center gap-1.5 font-medium text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">📍 {provider.location.split(',')[0]}</span>
            </div>

            <div className="inline-block px-8 py-3 md:py-4 bg-gray-950 rounded-full text-2xl md:text-3xl font-extrabold text-green-400 border-2 border-gray-800 shadow-inner">
              ₹{provider.price} <span className="text-sm md:text-base text-gray-500 font-semibold uppercase tracking-widest ml-1">/ job</span>
            </div>
          </motion.div>

          {/* 📄 About */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 p-6 md:p-8 lg:p-10 rounded-3xl mb-8 lg:mb-12 shadow-lg"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4 lg:mb-6 text-gray-100 tracking-wide border-b border-gray-800 pb-3">
              About
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-4xl">
              {provider.about}
            </p>
          </motion.div>

          {/* 📸 Portfolio Gallery */}
          {provider.portfolio && provider.portfolio.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 lg:mb-12"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 lg:mb-6 text-gray-100 tracking-wide px-2 border-b border-gray-800 pb-3">
                Portfolio
              </h2>
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar">
                {provider.portfolio.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Portfolio ${idx}`} 
                    className="h-40 md:h-56 lg:h-64 w-60 md:w-80 lg:w-96 object-cover rounded-2xl shadow-md border border-gray-700 snap-center shrink-0 hover:scale-[1.02] transition-transform cursor-pointer" 
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
            className="bg-gray-900 border border-gray-800 p-6 md:p-8 lg:p-10 rounded-3xl mb-12 lg:mb-16 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4 lg:mb-6 border-b border-gray-800 pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-3 tracking-wide">
                📍 Provider Location
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              </h2>
            </div>
            <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-gray-800 relative z-10 bg-gray-800 shadow-inner">
              {/* Google Maps iFrame based on Provider's location string */}
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(provider.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                title="Provider Location Map"
              ></iframe>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center uppercase tracking-wide font-medium">Tracking via verified address</p>
          </motion.div>
        </div>

        {/* 🚀 Fixed Bottom ACTION BUTTONS */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex justify-center z-50">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] flex gap-3 sm:px-6 lg:px-8">
            
            <a href="tel:9876543210" className="w-1/4">
               <Button variant="outline" className="w-full">
                 📞
               </Button>
            </a>

            <div className="w-1/4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/chat", { state: { partner: provider } })}>
                💬
              </Button>
            </div>

            <div className="w-2/4">
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