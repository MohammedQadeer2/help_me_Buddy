import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Global Auth

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-24 md:pb-32 pt-6 md:pt-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">

        {/* 🔝 Header */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => navigate("/provider-profile")}
              className="hover:opacity-80 transition transform hover:scale-105 rounded-full overflow-hidden border-4 border-gray-700 shadow-xl"
            >
              <Avatar src={user?.profileImage} size="xl" className="w-16 h-16 md:w-20 md:h-20" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard</h1>
              <p className="text-base md:text-lg text-gray-400 mt-1 font-medium">Welcome back, {user?.name || "Pro"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm md:text-base font-extrabold hover:bg-red-600 hover:border-red-500 transition shadow-lg uppercase tracking-wider"
          >
            Logout
          </button>
        </div>

        {/* 🟢 Availability Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 md:p-8 lg:p-10 rounded-3xl mb-10 md:mb-12 flex justify-between items-center shadow-2xl transition-colors duration-500 border-2 ${
            online ? "bg-green-900/20 border-green-800/50" : "bg-gray-900/50 border-gray-800"
          }`}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${online ? "bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "bg-gray-500 shadow-inner"}`}></div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-wide">{online ? "You are Online" : "You are Offline"}</h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-400 mt-1 font-medium">{online ? "Receiving new job requests" : "Not visible to new clients"}</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setOnline(!online)}
            className={`relative inline-flex h-10 w-20 md:h-12 md:w-24 items-center rounded-full transition-colors shadow-inner border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              online ? "bg-green-500 focus:ring-green-500" : "bg-gray-600 focus:ring-gray-600"
            }`}
          >
            <span
              className={`inline-block h-8 w-8 md:h-10 md:w-10 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                online ? "translate-x-10 md:translate-x-12" : "translate-x-1"
              }`}
            />
          </button>
        </motion.div>

        {/* 💰 Earnings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 flex-1">
          <div className="bg-gray-900/80 backdrop-blur border-2 border-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-gray-700 transition h-full flex flex-col justify-center">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition duration-500"></div>
            <p className="text-sm md:text-lg text-gray-400 mb-2 font-bold uppercase tracking-widest relative z-10">Today's Earnings</p>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-400 tracking-tight drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] relative z-10">₹0</h3>
            <p className="text-sm md:text-base text-green-600 mt-3 font-semibold bg-green-500/10 w-max px-4 py-1.5 rounded-full border border-green-500/20 relative z-10">↑ 0% from yesterday</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur border-2 border-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-gray-700 transition h-full flex flex-col justify-center">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition duration-500"></div>
            <p className="text-sm md:text-lg text-gray-400 mb-2 font-bold uppercase tracking-widest relative z-10">Total Earnings</p>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-400 tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] relative z-10">₹18,500</h3>
            <p className="text-sm md:text-base text-blue-500 mt-3 font-semibold bg-blue-500/10 w-max px-4 py-1.5 rounded-full border border-blue-500/20 relative z-10">{142 + history.length - 2} Jobs completed</p>
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 lg:p-10 mb-10 md:mb-12 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 md:mb-8 pb-5 border-b border-gray-800 gap-4">
               <div>
                 <h2 className="text-xl md:text-2xl font-extrabold text-gray-200 flex items-center gap-3">💰 My Wallet</h2>
                 <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Platform Payments System</p>
               </div>
               <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base px-6 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition uppercase tracking-wider w-full md:w-auto">Withdraw Funds</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
               <div className="bg-gray-800/50 p-5 md:p-6 rounded-2xl border border-gray-700/50 shadow-inner">
                 <p className="text-sm md:text-base text-gray-400 font-bold uppercase mb-2 tracking-widest">Available Balance</p>
                 <p className="text-3xl md:text-4xl font-extrabold text-green-400">₹{wallet.balance}</p>
                 <p className="text-xs md:text-sm text-gray-500 mt-2 font-medium">Platform held & ready</p>
               </div>
               <div className="bg-gray-800/50 p-5 md:p-6 rounded-2xl border border-gray-700/50 shadow-inner">
                 <p className="text-sm md:text-base text-gray-400 font-bold uppercase mb-2 tracking-widest">Total Earnings</p>
                 <p className="text-2xl md:text-3xl font-extrabold text-white">₹{wallet.totalEarnings}</p>
                 <p className="text-xs md:text-sm text-gray-500 mt-2 font-medium">Including Cash Orders</p>
               </div>
               <div className="bg-gray-800/50 p-5 md:p-6 rounded-2xl border border-gray-700/50 shadow-inner">
                 <p className="text-sm md:text-base text-red-400/80 font-bold uppercase mb-2 tracking-widest">Commission Paid</p>
                 <p className="text-xl md:text-2xl font-bold text-red-400/80">₹{wallet.totalCommissionPaid}</p>
                 <p className="text-xs md:text-sm text-gray-500 mt-2 font-medium">15% platform fee</p>
               </div>
               <div className="bg-gray-800/50 p-5 md:p-6 rounded-2xl border border-gray-700/50 shadow-inner">
                 <p className="text-sm md:text-base text-gray-400 font-bold uppercase mb-2 tracking-widest">Total Jobs</p>
                 <p className="text-xl md:text-2xl font-bold text-blue-400">{wallet.totalOrders}</p>
                 <p className="text-xs md:text-sm text-gray-500 mt-2 font-medium">Completed successfully</p>
               </div>
            </div>
          </motion.div>
        )}

        {/* �📥 Incoming Requests Header with Toggle */}
        {!activeJob && (
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-200">Live Requests</h2>
                <span className="text-sm md:text-base bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/30 font-bold tracking-wide">
                  {requests.length} New
                </span>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 shadow-inner">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`text-sm md:text-base font-bold px-5 py-2 md:py-2.5 rounded-lg transition ${viewMode === "list" ? "bg-gray-800 text-white shadow-md" : "text-gray-500 hover:text-gray-300"}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`text-sm md:text-base font-bold px-5 py-2 md:py-2.5 rounded-lg transition flex items-center gap-2 ${viewMode === "map" ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Radar 📡
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
            className="w-full h-[400px] md:h-[500px] bg-gray-900 border border-gray-800 rounded-3xl mb-10 md:mb-12 relative overflow-hidden flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] bg-blue-950/10 shadow-xl"
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
          <div className="space-y-5 md:space-y-6 mb-10 md:mb-12">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-900 border border-blue-900/30 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20"
                >
                  <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-blue-500"></div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg md:text-xl font-extrabold text-gray-100 pr-4">{req.problem}</h3>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-xl md:text-2xl font-extrabold text-green-400 drop-shadow-md">₹{req.price}</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1.5 uppercase font-medium tracking-wide">
                        {req.paymentMethod === 'online' ? "Platform" : "Cash"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm md:text-base text-gray-400 mt-4 md:mt-5 space-y-2 md:space-y-3 font-medium">
                    <p className="flex items-center">📦 <span className="ml-2 w-16 text-gray-500">Order:</span> <span className="font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded-md text-xs md:text-sm">{req.orderId}</span></p>
                    <p className="flex items-center">👤 <span className="ml-2 w-16 text-gray-500">From:</span> <span className="text-gray-200">{req.user}</span></p>
                    <p className="flex items-center">📍 <span className="ml-2 w-16 text-gray-500">Loc:</span> <span className="text-gray-300">{req.location}</span></p>
                  </div>

                  <div className="flex gap-4 md:gap-5 mt-6 md:mt-8">
                    <button 
                      onClick={() => handleAccept(req)}
                      className="flex-1 py-3 md:py-4 bg-green-600 hover:bg-green-500 rounded-2xl text-sm md:text-base font-bold transition shadow-lg shadow-green-600/30 text-white uppercase tracking-wider"
                    >
                      Accept Job
                    </button>
                    <button 
                      onClick={() => handleDecline(req.id)}
                      className="flex-[0.5] py-3 md:py-4 bg-gray-800 hover:bg-red-600 hover:text-white text-gray-300 rounded-2xl text-sm md:text-base font-bold transition border border-gray-700 hover:border-red-500 hover:shadow-lg hover:shadow-red-600/30 uppercase tracking-wider"
                    >
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {requests.length === 0 && (
              <div className="text-center py-10 bg-gray-900/50 border border-gray-800 rounded-2xl border-dashed">
                <span className="text-4xl">☕</span>
                <p className="text-gray-400 mt-3 font-medium">No new requests right now.</p>
                <p className="text-xs text-gray-500">Stay online to get notified of nearby jobs.</p>
              </div>
            )}
          </div>
        )}

        {/* 📜 Job History & Payouts */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-gray-300">Recent Completed Jobs</h2>

          <div className="space-y-3">
            {history.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-200">{job.service}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <p className="text-xs text-gray-500">📅 {job.date}</p>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-800 border border-gray-700 px-1 py-0.5 rounded tracking-wide uppercase">
                      {job.paymentMethod === 'online' ? '💳 WALLET' : '💵 CASH'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-md font-bold text-green-400">+₹{job.earning}</p>
                  <p className="text-[10px] text-red-500/80 font-bold mt-0.5 flex justify-end gap-1">
                    <span className="text-gray-500 font-normal">Fee:</span> -₹{job.commission}
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