import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { providers } from "../data/mockData";
import Avatar from "../components/Avatar";
import ServiceCard from "../components/ServiceCard";

function MapView() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [selectedPin, setSelectedPin] = useState(null);

  // Generate pseudo-random coordinates for our mock providers to scatter them on a map
  const mapPins = providers.map((provider, i) => {
    // Randomish positions between 15% and 85% to keep them visible
    const top = 15 + ((i * 37) % 70); 
    const left = 15 + ((i * 53) % 70);
    return { ...provider, top: `${top}%`, left: `${left}%` };
  });

  return (
    <div className="fixed inset-0 bg-gray-950 overflow-hidden flex flex-col text-white">
      {/* Header Overlay */}
      <div className="absolute top-0 w-full z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto bg-gray-900/80 backdrop-blur-md border border-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-gray-800 transition"
        >
          ←
        </button>
        <div className="pointer-events-auto bg-gray-900/80 backdrop-blur-md border border-gray-700 px-4 py-2 rounded-full text-sm font-semibold text-blue-400 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          Live Radar
        </div>
      </div>

      {/* Interactive Map Area (Framer Motion Grid) */}
      <div className="relative flex-1 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] bg-blue-950/20"
           style={{ backgroundSize: '150px' }}
      >
        {/* Pulsating Center (User Location) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <div className="w-4 h-4 bg-blue-500 rounded-full z-10 relative">
            <span className="absolute -inset-4 bg-blue-500/30 rounded-full animate-ping"></span>
            <span className="absolute -inset-8 border border-blue-500/20 rounded-full animate-ping" style={{ animationDelay: '500ms' }}></span>
          </div>
          <span className="absolute top-6 whitespace-nowrap text-xs font-bold text-blue-400 bg-black/50 px-2 py-0.5 rounded shadow-lg">You</span>
        </div>

        {/* Scattered Providers */}
        {mapPins.map((pin) => (
          <motion.div
            key={pin.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 * pin.id }}
            className={`absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 ${selectedPin?.id === pin.id ? 'scale-125 z-30' : ''}`}
            style={{ top: pin.top, left: pin.left }}
            onClick={() => setSelectedPin(pin)}
          >
            <div className="relative flex flex-col items-center">
              <div className="relative">
                 <Avatar src={pin.profileImage} size="sm" className={`border-2 ${selectedPin?.id === pin.id ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'border-gray-700'} shadow-xl bg-gray-900`} />
                 {/* Rating badge on pin */}
                 <div className="absolute -bottom-1 -right-2 bg-gray-900 border border-gray-700 text-[9px] px-1 rounded-sm font-bold shadow-md">
                   ⭐{pin.rating}
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Provider Pop-up Card */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="absolute bottom-0 w-full z-30 p-4 pb-8 bg-gradient-to-t from-gray-950 via-gray-900 to-transparent"
          >
             <div className="flex justify-center flex-col items-center relative gap-2 mt-4">
               {/* Close button */}
               <button 
                 onClick={() => setSelectedPin(null)}
                 className="absolute -top-10 right-4 bg-gray-800 border border-gray-700 w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-gray-700"
               >
                 ✕
               </button>
               <div className="w-full max-w-md">
                 <ServiceCard 
                    provider={selectedPin} 
                    onClick={() => navigate("/details", { state: { provider: selectedPin } })} 
                 />
                 <button 
                   onClick={() => navigate("/details", { state: { provider: selectedPin } })}
                   className="w-full mt-2 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold shadow-lg transition"
                 >
                   View Profile & Book
                 </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MapView;