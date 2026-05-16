import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import ModeSwitcher from "../components/ModeSwitcher";

function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, roles, activeMode, switchMode, logout } = useAuth(); // Global Auth

  const [online, setOnline] = useState(true);

  // Use state for requests so we can functionally "Accept" or "Reject" them from the UI screen
  const [requests, setRequests] = useState([
    { id: 1, problem: "Fan motor replacement & wiring", user: "Rahul Sharma", location: "123 MG Road, 2km away", price: 350, paymentMethod: "online", orderId: "HMB-ORD-A1B2C3" },
    { id: 2, problem: "Short circuit in kitchen board", user: "Amit Patel", location: "45 West Avenue, 5km away", price: 450, paymentMethod: "cash", orderId: "HMB-ORD-X9Y8Z7" },
  ]);
  
  const [history, setHistory] = useState([
    { id: 101, service: "AC Servicing", date: "2026-04-04", earning: 425, commission: 75, paymentMethod: "online", rating: 5 },
    { id: 102, service: "Switchboard Installation", date: "2026-04-02", earning: 170, commission: 30, paymentMethod: "cash", rating: 4 },
  ]);

  // Wallet State
  const [wallet, setWallet] = useState({
    balance: 425, // Only online payments are "held" by the platform and can be withdrawn
    totalEarnings: 595, // 425 (online) + 170 (cash)
    totalCommissionPaid: 105,
    pendingPayouts: 0,
    totalOrders: 2
  });

  // Active Job & Live Tracking State
  const [activeJob, setActiveJob] = useState(null);
  const [jobStatus, setJobStatus] = useState("idle"); // 'idle' | 'traveling' | 'working'
  const [workTimer, setWorkTimer] = useState(0);

  // Timer logic for when status is 'working'
  useEffect(() => {
    let interval;
    if (jobStatus === "working") {
      interval = setInterval(() => {
        setWorkTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [jobStatus]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDecline = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleAccept = (req) => {
    // Remove from live requests and set as Active Job
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setActiveJob(req);
    setJobStatus("traveling"); // Booked -> Accepted -> Traveling
    setWorkTimer(0);
    // Auto-update global availability mapping ideally happens here
  };

  const handleFinishJob = () => {
    const basePrice = activeJob.price;
    const commission = Math.round(basePrice * 0.15); // Platform fee calculation
    const earning = basePrice - commission;

    // Add to history
    setHistory([{ 
      id: Date.now(), 
      service: activeJob.problem, 
      date: "2026-04-05", 
      earning: earning, 
      commission: commission,
      paymentMethod: activeJob.paymentMethod,
      rating: 5 
    }, ...history]);

    // Update Wallet Dashboard
    setWallet(prev => ({
       balance: activeJob.paymentMethod === 'online' ? prev.balance + earning : prev.balance,
       totalEarnings: prev.totalEarnings + earning,
       totalCommissionPaid: prev.totalCommissionPaid + commission,
       pendingPayouts: activeJob.paymentMethod === 'online' ? prev.pendingPayouts + earning : prev.pendingPayouts,
       totalOrders: prev.totalOrders + 1
    }));

    setActiveJob(null);
    setJobStatus("idle");
    setWorkTimer(0);
  };


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex justify-center text-white pb-16 md:pb-20 pt-6 md:pt-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-blue-600/10 blur-[140px] rounded-full"></div>
      </div>
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-6xl px-6 sm:px-8 lg:px-10 py-5">

        {/* 🔝 Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => navigate("/provider-profile")}
              className="hover:opacity-90 transition transform hover:scale-105 rounded-full overflow-hidden border-4 border-white/10 shadow-xl"
            >
              <Avatar src={user?.profileImage} size="xl" className="w-16 h-16 md:w-20 md:h-20" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-md border border-cyan-400/30 text-cyan-300 bg-cyan-500/10">Pro Hub</span>
              </div>
              <p className="text-sm md:text-base text-slate-300/70 mt-1 font-medium">Welcome back, {user?.name || "Pro"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <ModeSwitcher roles={roles} activeMode={activeMode} onSwitch={switchMode} />
            <button
              onClick={handleLogout}
              className="px-4 md:px-5 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-md text-xs md:text-sm font-bold hover:bg-red-600 hover:border-red-500 transition uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 🟢 Availability Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 md:px-6 py-4 rounded-xl mb-7 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border ${
            online ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${online ? "bg-emerald-400" : "bg-slate-500"}`}></div>
            <div>
              <h2 className="text-sm md:text-base font-bold">{online ? "Online" : "Offline"}</h2>
              <p className="text-xs text-slate-300/70">{online ? "Accepting new requests" : "Hidden from new clients"}</p>
            </div>
          </div>

          <button
            onClick={() => setOnline(!online)}
            className={`relative inline-flex h-7 w-14 md:h-8 md:w-16 items-center rounded-full transition-colors border border-white/10 ${
              online ? "bg-emerald-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                online ? "translate-x-7 md:translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </motion.div>

        {/* 💰 Earnings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 flex-1">
          <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl shadow-md relative overflow-hidden transition h-full flex flex-col justify-center">
            <p className="text-[11px] md:text-xs text-slate-300/70 mb-1 font-semibold uppercase tracking-[0.2em]">Today's Earnings</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-300 tracking-tight">₹0</h3>
            <p className="text-[11px] md:text-xs text-emerald-300/80 mt-2 font-semibold bg-emerald-500/10 w-max px-2.5 py-0.5 rounded-md border border-emerald-500/20">↑ 0% from yesterday</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl shadow-md relative overflow-hidden transition h-full flex flex-col justify-center">
            <p className="text-[11px] md:text-xs text-slate-300/70 mb-1 font-semibold uppercase tracking-[0.2em]">Total Earnings</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-cyan-300 tracking-tight">₹18,500</h3>
            <p className="text-[11px] md:text-xs text-cyan-300/80 mt-2 font-semibold bg-cyan-500/10 w-max px-2.5 py-0.5 rounded-md border border-cyan-500/20">{142 + history.length - 2} Jobs completed</p>
          </div>
        </div>

        {/* 🔴 Active Job Status Module (Only visible if currently working) */}
        <AnimatePresence>
          {activeJob && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-10 md:mb-14 overflow-hidden"
            >
              <div className="bg-blue-900/20 border-2 border-blue-500/50 p-6 md:p-8 lg:p-10 rounded-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)] relative">
                 <div className="flex justify-between items-start mb-6 md:mb-8">
                   <div>
                     <h2 className="text-xl md:text-2xl font-bold text-blue-400 uppercase tracking-widest">Active Assignment</h2>
                     <p className="text-2xl md:text-3xl font-extrabold text-gray-100 mt-2">{activeJob.problem}</p>
                   </div>
                   <div className="text-right bg-blue-900/30 p-4 md:p-5 rounded-2xl border border-blue-500/30">
                     <p className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-widest">Payout</p>
                     <p className="text-2xl md:text-4xl font-extrabold text-green-400 mt-1">₹{activeJob.price}</p>
                   </div>
                 </div>
                 
                 {/* Live Tracking Map Frame */}
                 <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-800 rounded-3xl mb-6 md:mb-8 border border-gray-700 overflow-hidden relative shadow-inner">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(activeJob.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                      title="Customer Location"
                    ></iframe>
                    {/* Live Indicator Overlay */}
                    <div className="absolute top-4 left-4 bg-gray-950/90 backdrop-blur-md border border-gray-700 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold flex items-center gap-3 shadow-lg">
                       <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${jobStatus === 'working' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-blue-500 animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`}></span> 
                       {jobStatus === 'traveling' ? 'Traveling to Client' : 'Job Started (Live)'}
                    </div>
                 </div>

                 <div className="flex bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl items-center gap-5 md:gap-6 mb-6 shadow-md">
                    <Avatar size="lg" className="bg-gray-800 w-16 h-16 md:w-20 md:h-20" />
                    <div>
                      <p className="text-lg md:text-xl font-extrabold text-gray-200">{activeJob.user}</p>
                      <p className="text-sm md:text-base text-gray-400 flex items-center gap-2 mt-1 md:mt-2 font-medium">📍 {activeJob.location}</p>
                    </div>
                    <button className="ml-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-900/40 border border-green-800 flex items-center justify-center text-green-400 hover:bg-green-600 hover:text-white transition shadow-lg text-xl md:text-2xl hover:scale-110">
                      📞
                    </button>
                 </div>

                 <div className="flex bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl flex-col gap-4 text-base md:text-lg mb-8 md:mb-10 shadow-md">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700/50">
                       <span className="text-gray-400 font-medium">Order ID: <span className="text-blue-400 font-mono tracking-widest font-bold ml-2 bg-blue-900/20 px-2 py-1 rounded">{activeJob.orderId}</span></span>
                       <span className="text-gray-400 font-medium">Price: <span className="font-extrabold text-white text-xl md:text-2xl ml-2">₹{activeJob.price}</span></span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-gray-400 font-medium">Payment:</span>
                       {activeJob.paymentMethod === 'online' ? (
                          <span className="px-4 py-2 rounded-xl text-blue-400 bg-blue-900/30 border border-blue-800 text-sm md:text-base font-bold font-mono tracking-wider uppercase">Platform Holds</span>
                       ) : (
                          <span className="px-4 py-2 rounded-xl text-yellow-400 bg-yellow-900/30 border border-yellow-800 text-sm md:text-base font-bold font-mono tracking-wider uppercase">Cash (On Delivery)</span>
                       )}
                    </div>
                 </div>

                 {/* Work Status Actions */}
                 {jobStatus === "traveling" ? (
                   <button 
                     onClick={() => setJobStatus("working")}
                     className="w-full py-5 md:py-6 bg-green-600 hover:bg-green-500 rounded-2xl text-xl md:text-2xl font-extrabold text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] transition transform hover:scale-[1.02] flex items-center justify-center gap-3 uppercase tracking-wide border-2 border-green-500"
                   >
                     ✅ Reached Location — Start Work
                   </button>
                 ) : (
                   <div className="flex flex-col gap-4 md:gap-6">
                     <div className="bg-gray-900/90 border-2 border-gray-700/50 p-6 md:p-8 rounded-3xl flex items-center justify-between shadow-2xl mb-4 md:mb-6">
                        <div>
                          <p className="text-sm md:text-base text-red-500 font-extrabold uppercase tracking-widest mb-2">Live Work Timer</p>
                          <p className="text-sm md:text-base text-gray-400 font-medium">Tracking duration for client billing transparency</p>
                        </div>
                        <div className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-red-500 ml-4 animate-pulse tabular-nums drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                          {formatTime(workTimer)}
                        </div>
                     </div>
                     <button 
                       onClick={handleFinishJob}
                       className="w-full py-5 md:py-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-2xl text-xl md:text-2xl font-extrabold text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] transition transform hover:scale-[1.02] uppercase tracking-wide hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                     >
                       ⏹️ Finish Job & {activeJob.paymentMethod === 'online' ? 'Release Payment' : 'Collect Cash'}
                     </button>
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* � Wallet & Earnings Section */}
        {!activeJob && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 mb-9 md:mb-10 shadow-md">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 pb-4 border-b border-white/10 gap-4">
               <div>
                 <h2 className="text-lg md:text-xl font-extrabold text-slate-200 flex items-center gap-3">💰 My Wallet</h2>
                 <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium">Platform payments</p>
               </div>
               <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm px-5 py-2 rounded-md font-bold transition uppercase tracking-wider w-full md:w-auto">Withdraw Funds</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
               <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                 <p className="text-[11px] md:text-xs text-slate-400 font-semibold uppercase mb-1 tracking-[0.2em]">Available</p>
                 <p className="text-2xl md:text-3xl font-extrabold text-emerald-300">₹{wallet.balance}</p>
                 <p className="text-[11px] md:text-xs text-slate-500 mt-1 font-medium">Platform held</p>
               </div>
               <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                 <p className="text-[11px] md:text-xs text-slate-400 font-semibold uppercase mb-1 tracking-[0.2em]">Total</p>
                 <p className="text-xl md:text-2xl font-extrabold text-white">₹{wallet.totalEarnings}</p>
                 <p className="text-[11px] md:text-xs text-slate-500 mt-1 font-medium">Cash + online</p>
               </div>
               <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                 <p className="text-[11px] md:text-xs text-red-300/80 font-semibold uppercase mb-1 tracking-[0.2em]">Commission</p>
                 <p className="text-lg md:text-xl font-bold text-red-300/80">₹{wallet.totalCommissionPaid}</p>
                 <p className="text-[11px] md:text-xs text-slate-500 mt-1 font-medium">15% fee</p>
               </div>
               <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                 <p className="text-[11px] md:text-xs text-slate-400 font-semibold uppercase mb-1 tracking-[0.2em]">Orders</p>
                 <p className="text-lg md:text-xl font-bold text-cyan-300">{wallet.totalOrders}</p>
                 <p className="text-[11px] md:text-xs text-slate-500 mt-1 font-medium">Completed</p>
               </div>
            </div>
          </motion.div>
        )}

        {/* �📥 Incoming Requests Header with Toggle */}
        {!activeJob && (
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <h2 className="text-lg md:text-xl font-extrabold text-slate-200">Live Requests</h2>
                <span className="text-xs md:text-sm bg-blue-600/15 text-blue-300 px-3 py-1 rounded-md border border-blue-500/20 font-semibold tracking-wide">
                  {requests.length} New
                </span>
              </div>
              
              <div className="flex bg-white/5 border border-white/10 rounded-md p-1">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`text-xs md:text-sm font-semibold px-4 py-1.5 rounded transition ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`text-xs md:text-sm font-semibold px-4 py-1.5 rounded transition flex items-center gap-2 ${viewMode === "map" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Radar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🗺️ Radar View */}
        {viewMode === "map" && !activeJob && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[340px] md:h-[420px] bg-slate-900/60 border border-white/10 rounded-2xl mb-9 md:mb-10 relative overflow-hidden flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] bg-blue-950/10"
          >
            {/* Center Provider Outline */}
            <div className="absolute z-10 w-12 md:w-16 h-12 md:h-16 bg-green-500/20 border-[3px] border-green-500 rounded-full flex items-center justify-center">
              <span className="w-3 md:w-4 h-3 md:h-4 bg-green-400 rounded-full animate-ping"></span>
              <span className="absolute -bottom-8 md:-bottom-10 text-xs md:text-sm text-green-400 font-extrabold tracking-widest uppercase">YOU</span>
            </div>
            {/* Radar Sweeper */}
            <div className="absolute w-64 md:w-96 h-64 md:h-96 border-2 border-blue-500/30 rounded-full animate-[spin_3s_linear_infinite] pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-blue-500/20 rotate-45 transform origin-right"></div>
            </div>

            {/* Request Blips */}
            {requests.map((req, i) => (
              <div 
                key={req.id} 
                className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] flex items-center justify-center cursor-pointer hover:scale-150 transition-transform z-20 group"
                style={{ 
                  top: `${30 + (i * 30)}%`, 
                  left: `${20 + (i * 45)}%` 
                }}
              >
                 <div className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-50"></div>
                 {/* Toolout Card on hover of blip */}
                 <div className="hidden group-hover:flex absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-red-500/50 p-3 rounded-2xl flex-col items-center shadow-2xl w-40 z-30">
                   <span className="text-xs text-red-400 font-extrabold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center uppercase tracking-wider">New Job!</span>
                   <span className="text-sm md:text-base text-white font-bold text-center mt-2">₹{req.price}</span>
                 </div>
              </div>
            ))}
            
            {requests.length === 0 && (
              <div className="absolute z-20 text-gray-400 text-sm md:text-base font-bold bg-black/60 px-6 py-3 rounded-2xl backdrop-blur-md border border-gray-700 shadow-2xl tracking-wide">
                No active requests...
              </div>
            )}
          </motion.div>
        )}

        {/* 📋 List View */}
        {viewMode === "list" && !activeJob && (
          <div className="space-y-4 md:space-y-5 mb-9 md:mb-10">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl shadow-md relative overflow-hidden transition-all duration-300 hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-slate-100">{req.problem}</h3>
                      <p className="text-xs md:text-sm text-slate-400 mt-1">{req.user} • {req.location}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-lg md:text-xl font-extrabold text-emerald-300">₹{req.price}</p>
                      <p className="text-[11px] md:text-xs text-slate-400 mt-1 uppercase font-medium tracking-wide">
                        {req.paymentMethod === 'online' ? "Platform" : "Cash"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] md:text-xs text-slate-400 font-mono bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                      {req.orderId}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDecline(req.id)}
                        className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 hover:bg-red-600/80 text-slate-300 rounded-md text-xs md:text-sm font-semibold transition border border-white/10"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleAccept(req)}
                        className="px-4 md:px-5 py-1.5 md:py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md text-xs md:text-sm font-semibold transition text-white"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {requests.length === 0 && (
              <div className="text-center py-8 bg-white/5 border border-white/10 rounded-xl border-dashed">
                <span className="text-3xl">☕</span>
                <p className="text-slate-300 mt-2 font-medium">No new requests right now.</p>
                <p className="text-xs text-slate-400">Stay online to get notified of nearby jobs.</p>
              </div>
            )}
          </div>
        )}

        {/* 📜 Job History & Payouts */}
        <div>
          <h2 className="text-sm md:text-base font-semibold mb-4 text-slate-300">Recent Completed Jobs</h2>

          <div className="space-y-3">
            {history.map((job) => (
              <div
                key={job.id}
                className="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-200">{job.service}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <p className="text-xs text-slate-400">📅 {job.date}</p>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-1 py-0.5 rounded tracking-wide uppercase">
                      {job.paymentMethod === 'online' ? '💳 WALLET' : '💵 CASH'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-300">+₹{job.earning}</p>
                  <p className="text-[10px] text-red-300/80 font-bold mt-0.5 flex justify-end gap-1">
                    <span className="text-slate-400 font-normal">Fee:</span> -₹{job.commission}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProviderDashboard;