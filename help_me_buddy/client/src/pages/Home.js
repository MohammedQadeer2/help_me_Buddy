import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProviderDashboard from "./providerDashboard";
import { categories, providers } from "../data/mockData";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { CategoryCardSkeleton, ServiceCardSkeleton, Skeleton } from "../components/Skeleton";

function Home() {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth(); // Now pulls natively from Context!
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bestMatch, setBestMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulate network request for data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 second loading screen simulation
    return () => clearTimeout(timer);
  }, []);

  // ðŸ§  Natural Language Search Logic
  const handleSmartSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setBestMatch(null);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Keyword dictionary mapping natural problems to our service categories
    // This allows users to type sentences like "My bathroom pipe is leaking" and map it to Plumber
    const problemMap = {
      "Plumber": ["water", "leak", "dripping", "pipe", "sink", "tap", "drain", "flush", "plumbing"],
      "Electrician": ["wire", "light", "fan", "switch", "power", "shock", "electricity", "short circuit", "current"],
      "AC Repair": ["ac", "cooling", "air conditioner", "freeze", "compressor", "heat", "hot", "ac not working"],
      "Cleaning": ["clean", "dust", "mop", "sweep", "mess", "dirty", "stain", "washing"],
      "Salon": ["hair", "cut", "makeup", "style", "facial", "massage", "salon", "beauty"],
      "Carpentry": ["wood", "door", "furniture", "table", "chair", "cabinet", "broken", "carpenter"]
    };

    let matchedCategory = null;
    let maxScore = 0;

    // Score the query against our dictionary keywords
    Object.keys(problemMap).forEach((category) => {
      let score = 0;
      problemMap[category].forEach((keyword) => {
        if (lowerQuery.includes(keyword)) score += 1;
      });

      if (score > maxScore) {
        maxScore = score;
        matchedCategory = category;
      }
    });

    // If we found a matching category, find the highest rated provider for it
    if (matchedCategory) {
      const topProvider = providers
        .filter((p) => p.category === matchedCategory)
        .sort((a, b) => b.rating - a.rating)[0];

      setBestMatch(topProvider);
    } else {
      setBestMatch(null);
    }
  };

  if (role === "provider") {
    return <ProviderDashboard />;
  }

  // Determine how many categories to show
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex overflow-hidden text-white w-full relative">
      {/* --- ðŸš€ Shrinkable Sidebar Panel --- */}
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="h-screen absolute md:sticky top-0 left-0 bg-gray-900 border-r border-gray-800 shadow-2xl z-[60] flex flex-col shrink-0 overflow-hidden"
          >
            <div className="w-72 flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center px-6 py-6 border-b border-gray-800">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                  Help Me Buddy
                </h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Sidebar Links */}
                <div className="flex flex-col gap-1 flex-grow overflow-y-auto px-4 py-4 scrollbar-hide">
                  <div className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest mt-6 mb-4 ml-2">Menu</div>
                  
                  <button onClick={() => { setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="font-medium text-sm">Home</span>
                  </button>

                  <button onClick={() => { setIsSidebarOpen(false); navigate("/profile"); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="font-medium text-sm">My Profile</span>
                  </button>

                  <button onClick={() => { setIsSidebarOpen(false); navigate("/services"); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    <span className="font-medium text-sm">Your Bookings</span>
                  </button>

                  <button onClick={() => { setIsSidebarOpen(false); document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    <span className="font-medium text-sm">Categories</span>
                  </button>

                  <div className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4 ml-2">App & Features</div>

                  <button onClick={() => { setIsSidebarOpen(false); navigate("/profile"); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    <span className="font-medium text-sm">Wallet & Payments</span>
                  </button>

                  <button onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="font-medium text-sm">Saved Providers</span>
                  </button>
                  
                  <button onClick={() => setIsSidebarOpen(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <div className="flex items-center gap-4">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <span className="font-medium text-sm">Notifications</span>
                    </div>
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                  </button>

                  <div className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4 ml-2">Support</div>

                  <button onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <span className="font-medium text-sm">Help & Support</span>
                  </button>

                  <button onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 transition text-left text-gray-200">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="font-medium text-sm">Settings & Privacy</span>
                  </button>
                </div>

                {/* Sidebar Footer (Logout) */}
                <div className="border-t border-gray-800 p-4">
                  <button 
                    onClick={() => { logout(); navigate("/"); }} 
                    className="flex w-full items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-left"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-screen relative flex justify-center scrollbar-hide">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">

          {/* ðŸ” Navbar */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-300 hover:text-white transition p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold tracking-wide">
                Help Me Buddy
              </h1>
              <p className="text-sm text-gray-400">Welcome back, {user?.name || "User"}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 transition"
          >
            <Avatar src={user?.profileImage} size="sm" />
            <span>Profile</span>
          </button>
        </div>

        {/* Smart Problem Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-5 lg:p-6 rounded-2xl mb-10 shadow-lg flex flex-col gap-3 relative overflow-hidden"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSmartSearch(e.target.value)}
            placeholder="Describe your problem... (e.g. Water is leaking from the sink)"
            className="w-full p-4 md:p-5 text-base md:text-lg rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all z-10 shadow-inner"
          />

          {/* ðŸŒŸ AI Best Match Result Dropdown */}
          <AnimatePresence>
            {bestMatch && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="pt-2 z-10"
              >
                <div className="flex items-center gap-2 mb-3 mt-1 ml-1">
                  <span className="text-xl">★</span>
                  <span className="text-sm font-semibold text-green-400 bg-green-900/40 border border-green-800/50 px-3 py-1 rounded-md">
                    Top Match for your problem
                  </span>
                </div>
                {/* Re-use our trusted ServiceCard, tapping goes straight to details */}
                <ServiceCard 
                  provider={bestMatch} 
                  onClick={() => navigate("/details", { state: { provider: bestMatch } })} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Top Services Title */}
        <div className="mb-5 md:mb-6 pl-1">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-100">Top Services</h2>
        </div>

        {/* Categories using custom Component */}
        <motion.div
          id="categories-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-6 md:mb-10"
        >
          {loading ? (
            // Skeleton State for Categories
            [...Array(6)].map((_, i) => <CategoryCardSkeleton key={`cat-skel-${i}`} />)
          ) : (
            <>
              {displayedCategories.map((cat) => (
                <CategoryCard 
                  key={cat.id} 
                  category={cat} 
                  onClick={() => navigate("/services", { state: { categoryStr: cat.name } })}
                />
              ))}

              {/* Expand Button inside Grid */}
              {!showAllCategories && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllCategories(true)}
                  className="bg-gray-900 border border-dashed border-gray-700 p-4 md:p-6 rounded-[1.25rem] sm:rounded-3xl hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 sm:gap-3 relative overflow-hidden min-h-[105px] sm:min-h-[130px] md:min-h-[150px] shadow-sm group"
                >
                  <div className="text-4xl md:text-5xl relative z-10 opacity-70">+</div>
                  <span className="text-[12px] sm:text-sm md:text-base font-bold tracking-wide text-gray-400 relative z-10 text-center leading-tight">Many more</span>
                </motion.div>
              )}

              {/* Optionally add a Collapse Button at the end if expanded */}
              {showAllCategories && (
                 <motion.div
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setShowAllCategories(false)}
                 className="bg-gray-900 border border-dashed border-gray-700 p-4 md:p-6 rounded-[1.25rem] sm:rounded-3xl hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 sm:gap-3 relative overflow-hidden min-h-[105px] sm:min-h-[130px] md:min-h-[150px] shadow-sm group"
               >
                 <div className="text-4xl md:text-5xl relative z-10 opacity-70">-</div>
                 <span className="text-[12px] sm:text-sm md:text-base font-bold tracking-wide text-gray-400 relative z-10 text-center leading-tight">Show less</span>
               </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* ï¿½ How It Works / Flow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-8 lg:p-12 rounded-3xl mb-12 shadow-2xl text-center relative overflow-hidden mt-12"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-600/10 blur-3xl rounded-full pointer-events-none"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-4 tracking-tight">
            Intelligent Booking Flow
          </h2>
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience a seamless connection from the moment you face an issue to the time a professional solves it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 relative z-10 px-4 md:px-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-6 shadow-lg text-blue-400 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-200 mb-3 tracking-wide">1. Describe Issue</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed px-2">
                Users simply describe their problem in plain English like <span className="italic text-gray-300">"my shower is leaking"</span>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative group">
              {/* Connector line for large screens */}
              <div className="hidden sm:block absolute top-10 md:top-12 -left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-10"></div>
              
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-6 shadow-lg relative text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <span className="absolute -right-3 -top-3 text-2xl animate-pulse drop-shadow-lg">*</span>
                2
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-200 mb-3 tracking-wide">2. AI Matching</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed px-2">
                Our system intelligently understands the issue and connects you with the right provider instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative group">
              {/* Connector line for large screens */}
              <div className="hidden sm:block absolute top-10 md:top-12 -left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-10"></div>
              
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-6 shadow-lg text-green-400 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-200 mb-3 tracking-wide">3. Seamless Booking</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed px-2">
                From problem - solution - booking, everything happens in a smooth, guided flow.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency using Custom Button Component */}
        <div className="mt-12 md:mt-16 lg:mt-20 mb-16 md:mb-24 lg:mb-32 flex justify-center pb-8">
          <Button variant="danger" onClick={() => navigate("/services")} className="md:w-auto md:px-12 md:py-5 lg:px-16 lg:py-6 md:text-lg lg:text-xl font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]">
            Emergency Help
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;

