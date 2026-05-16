import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProviderDashboard from "./providerDashboard";
import { categories } from "../data/mockData";
import { getProviders } from "../api/providerApi";
import CategoryCard from "../components/CategoryCard";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import ModeSwitcher from "../components/ModeSwitcher";
import { CategoryCardSkeleton, ServiceCardSkeleton, Skeleton } from "../components/Skeleton";

function Home() {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();
  const { user, roles, activeMode, switchMode, logout } = useAuth(); // Now pulls natively from Context!
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bestMatch, setBestMatch] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulate network request for data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProviders();
        setProviders(res.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🧠 Natural Language Search Logic
  const handleSmartSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setBestMatch(null);
      setSuggestions([]);
      setAiData(null);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch("https://help-me-buddy-backend.onrender.com/api/ai/smart-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      // Show the AI's logic (category, keywords)
      if (data.ai) {
        setAiData(data.ai);
      } else {
        setAiData(null);
      }

      // If no provider found
      if (!data.bestMatch) {
        setBestMatch(null);
        setSuggestions([]);
        return;
      }

      // Convert backend structure → frontend structure
      setBestMatch({
        ...data.bestMatch,
        name: data.bestMatch.userId?.name,
        price: data.bestMatch.pricePerHour,
        category: data.bestMatch.category?.name,
      });

      if (data.suggestions) {
        setSuggestions(
          data.suggestions.map((p) => ({
            ...p,
            name: p.userId?.name,
            price: p.pricePerHour,
            category: p.category?.name,
          }))
        );
      } else {
        setSuggestions([]);
      }

    } catch (error) {
      console.error("AI Search Error:", error);
      setBestMatch(null);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };



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
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="h-screen absolute md:sticky top-0 left-0 bg-gray-900 border-r border-gray-800 shadow-2xl z-[60] flex flex-col shrink-0 overflow-hidden"
          >
            <div className="w-[280px] flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center px-6 py-6 border-b border-gray-800 shrink-0">
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
              <div className="flex flex-col gap-0.5 flex-grow overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mt-4 mb-2 ml-2">Menu</div>

                <button onClick={() => { setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  <span className="font-medium text-sm">Home</span>
                </button>

                <button onClick={() => { setIsSidebarOpen(false); navigate("/profile"); }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="font-medium text-sm">My Profile</span>
                </button>

                <button onClick={() => { setIsSidebarOpen(false); navigate("/services"); }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  <span className="font-medium text-sm">Your Bookings</span>
                </button>

                <button onClick={() => { setIsSidebarOpen(false); document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  <span className="font-medium text-sm">Categories</span>
                </button>

                <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2 ml-2">App & Features</div>

                <button onClick={() => { setIsSidebarOpen(false); navigate("/profile"); }} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <span className="font-medium text-sm">Wallet & Payments</span>
                </button>

                <button onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  <span className="font-medium text-sm">Saved Providers</span>
                </button>

                <button onClick={() => setIsSidebarOpen(false)} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="font-medium text-sm">Notifications</span>
                  </div>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
                </button>

                <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2 ml-2">Support</div>

                <button onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span className="font-medium text-sm">Help & Support</span>
                </button>

                <button onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition text-left text-gray-200">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-medium text-sm">Settings & Privacy</span>
                </button>
              </div>

              {/* Sidebar Footer (Logout) */}
              <div className="border-t border-gray-800 p-3 shrink-0">
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="flex w-full items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left"
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
      <div className="flex-1 overflow-y-auto h-screen relative flex justify-center scrollbar-hide w-full bg-gray-950">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 transition-all duration-300">

          {/* ðŸ” Navbar */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ModeSwitcher roles={roles} activeMode={activeMode} onSwitch={switchMode} />
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 transition"
              >
                <Avatar src={user?.profileImage} size="sm" />
                <span>Profile</span>
              </button>
            </div>
          </div>

          {/* Smart Problem Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-8 shadow-lg flex flex-col gap-3 relative overflow-hidden"
          >
            <div className="relative z-10 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}

                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSmartSearch(searchQuery);
                  }
                }}

                placeholder="Describe your problem... (e.g. Water is leaking from the sink)"
                className="w-full p-3 pr-12 text-sm md:text-base rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-inner"
              />
              <button
                onClick={() => handleSmartSearch(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full text-white transition-colors flex items-center justify-center shadow-md"
                title="Search"
              >
                <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>

            {/* 🌟 AI Best Match Result Dropdown */}
            <AnimatePresence>
              {isSearching ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="pt-2 z-10 block"
                >
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-800 border border-gray-700 rounded-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-green-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-300 font-medium">Analyzing your problem using AI...</span>
                  </div>
                </motion.div>
              ) : (aiData || bestMatch) ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="pt-2 z-10 block"
                >
                  {aiData && (
                    <div className="mb-4 bg-gray-800 p-3 md:p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-300 text-sm md:text-base">
                        AI identified that you need a <span className="text-green-400 font-bold">{aiData.category}</span>.
                      </p>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                        Urgency: {aiData.urgency || "Normal"} | Keywords: {(aiData.keywords || []).join(", ")}
                      </p>
                    </div>
                  )}

                  {bestMatch ? (
                    <>
                      <div className="flex items-center gap-2 mb-3 mt-1 ml-1">
                        <span className="text-xl">★</span>
                        <span className="text-sm font-semibold text-green-400 bg-green-900/40 border border-green-800/50 px-3 py-1 rounded-md">
                          Best Match
                        </span>
                      </div>
                      <ServiceCard
                        provider={bestMatch}
                        onClick={() => navigate("/details", { state: { provider: bestMatch } })}
                        onBook={(p) => navigate("/booking", { state: { provider: p } })}
                      />

                      {suggestions.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <div className="flex items-center gap-2 mb-3 ml-1">
                            <span className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-widest">
                              Other Recommended Professionals
                            </span>
                          </div>
                          <div className="flex flex-col gap-3">
                            {suggestions.slice(1).map((sugg) => (
                              <ServiceCard
                                key={sugg._id}
                                provider={sugg}
                                onClick={() => navigate("/details", { state: { provider: sugg } })}
                                onBook={(p) => navigate("/booking", { state: { provider: p } })}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-yellow-400 p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                      No matching providers found for this category yet.
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* Top Services Title */}
          <div className="mb-4 pl-1">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-100">Top Services</h2>
          </div>

          {/* Categories using custom Component */}
          <motion.div
            id="categories-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-6 md:mb-10"
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
                    className="bg-gray-900 border border-dashed border-gray-700 p-2 sm:p-3 rounded-lg hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative overflow-hidden min-h-[75px] sm:min-h-[85px] shadow-sm group"
                  >
                    <div className="text-xl sm:text-2xl relative z-10 opacity-70">+</div>
                    <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-400 relative z-10 text-center leading-tight">Many more</span>
                  </motion.div>
                )}

                {/* Optionally add a Collapse Button at the end if expanded */}
                {showAllCategories && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAllCategories(false)}
                    className="bg-gray-900 border border-dashed border-gray-700 p-2 sm:p-4 rounded-xl hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 sm:gap-2 relative overflow-hidden min-h-[85px] sm:min-h-[100px] shadow-sm group"
                  >
                    <div className="text-2xl sm:text-3xl relative z-10 opacity-70">-</div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-gray-400 relative z-10 text-center leading-tight">Show less</span>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          {/* ï¿½ How It Works / Flow Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 p-6 lg:p-8 rounded-2xl mb-8 shadow-2xl text-center relative overflow-hidden mt-8"
          >
            {/* Subtle Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-600/10 blur-3xl rounded-full pointer-events-none"></div>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-100 mb-2 tracking-tight">
              Intelligent Booking Flow
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience a seamless connection from the moment you face an issue to the time a professional solves it.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 relative z-10 px-2 md:px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-4 shadow-lg text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-200 mb-2 tracking-wide">1. Describe Issue</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed px-2">
                  Users simply describe their problem in plain English like <span className="italic text-gray-300">"my shower is leaking"</span>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative group">
                {/* Connector line for large screens */}
                <div className="hidden sm:block absolute top-8 md:top-10 -left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-10"></div>

                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-4 shadow-lg relative text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <span className="absolute -right-2 -top-2 text-xl animate-pulse drop-shadow-lg">*</span>
                  2
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-200 mb-2 tracking-wide">2. AI Matching</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed px-2">
                  Our system intelligently understands the issue and connects you with the right provider instantly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative group">
                {/* Connector line for large screens */}
                <div className="hidden sm:block absolute top-8 md:top-10 -left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-10"></div>

                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-4 shadow-lg text-green-400 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-200 mb-2 tracking-wide">3. Seamless Booking</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed px-2">
                  From problem - solution - booking, everything happens in a smooth, guided flow.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Emergency using Custom Button Component */}
          <div className="mt-8 flex justify-center pb-8">
            <Button variant="danger" onClick={() => navigate("/services")} className="px-8 py-3 md:w-auto md:px-10 md:py-4 md:text-base font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]">
              Emergency Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;