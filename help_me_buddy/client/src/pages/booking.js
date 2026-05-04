import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Avatar from "../components/Avatar";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [issue, setIssue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [onlineSubMethod, setOnlineSubMethod] = useState("upi");
  const [upiProvider, setUpiProvider] = useState("phonepe");
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });
  const [confirmed, setConfirmed] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-semibold mb-4">No Provider Selected</h2>
        <Button variant="outline" onClick={() => navigate("/home")} className="max-w-xs">
          Go Back Home
        </Button>
      </div>
    );
  }

  const handleBooking = () => {
    if (!date || !time || !address || !issue) {
      alert("Please fill in all details (Date, Time, Address, and Issue)");
      return;
    }

    if (paymentMethod === "online") {
      if (onlineSubMethod === "upi" && !paymentDetails.upiId) {
        alert("Please enter your active UPI ID to proceed with secure payment.");
        return;
      }
      if (onlineSubMethod === "card" && (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCvv)) {
        alert("Please fill in all card details (Card Number, Expiry, and CVV) for payment.");
        return;
      }
    }

    const orderId = `HMB-ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const basePrice = provider.price;
    const commission = Math.round(basePrice * 0.15); // 15% Platform Commission
    const tax = Math.round(basePrice * 0.05); // 5% GST
    const totalAmount = basePrice + tax; // User pays base + tax

    setOrderInfo({
      orderId,
      status: "Booked", // Booked => Accepted => In Progress => Completed
      paymentMethod,
      basePrice,
      commission,
      tax,
      totalAmount,
      providerEarning: basePrice - commission,
      date,
      time
    });

    setConfirmed(true);

    setTimeout(() => {
      navigate("/home");
    }, 4500); // give them time to read the receipt
  };

  const calculateTotal = () => {
    const basePrice = provider.price || 0;
    const tax = Math.round(basePrice * 0.05);
    return basePrice + tax;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold ml-4">Book Service</h1>
        </div>

        {!confirmed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 🧑‍🔧 Provider Summary */}
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl mb-6 flex items-center gap-4 shadow-sm">
              <Avatar src={provider.profileImage} size="lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{provider.name}</h3>
                <p className="text-sm text-blue-400">{provider.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">₹{provider.price}</p>
                <p className="text-xs text-gray-500">per job</p>
              </div>
            </div>

            {/* 📝 Booking Form */}
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-6 space-y-4 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-gray-200 border-b border-gray-800 pb-3 mb-6 tracking-wide">
                Service Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6">
                <div>
                  <label className="block mb-2 text-sm md:text-base font-bold text-gray-400 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    className="w-full p-4 lg:p-5 rounded-xl bg-gray-800 border border-gray-700 text-base md:text-lg lg:text-xl outline-none focus:ring-2 focus:ring-blue-500/50 text-white shadow-inner transition-all hover:bg-gray-800/80 cursor-pointer"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm md:text-base font-bold text-gray-400 uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    className="w-full p-4 lg:p-5 rounded-xl bg-gray-800 border border-gray-700 text-base md:text-lg lg:text-xl outline-none focus:ring-2 focus:ring-blue-500/50 text-white shadow-inner transition-all hover:bg-gray-800/80 cursor-pointer"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm md:text-base font-bold text-gray-400 uppercase tracking-wider">Service Address</label>
                <input
                  type="text"
                  placeholder="Enter full address..."
                  className="w-full p-4 lg:p-5 rounded-xl bg-gray-800 border border-gray-700 text-base md:text-lg lg:text-xl outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-500/50 shadow-inner transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-400">Describe the Issue</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Fan is making a clicking noise and won't spin..."
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 text-xs text-gray-400">Payment Option</label>
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setPaymentMethod("online")}
                    className={`flex-1 py-3 rounded-lg border transition text-sm font-semibold text-center ${paymentMethod === 'online' ? 'bg-blue-600/20 border-blue-500 text-blue-400 max-h-14' : 'bg-gray-800 border-gray-700 text-gray-400 opacity-70 max-h-14'}`}
                  >
                    💳 Pay Online
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex-1 py-3 rounded-lg border transition text-sm font-semibold text-center ${paymentMethod === 'cash' ? 'bg-green-600/20 border-green-500 text-green-400 max-h-14' : 'bg-gray-800 border-gray-700 text-gray-400 opacity-70 max-h-14'}`}
                  >
                    💵 Cash
                  </button>
                </div>

                {/* Extended Details for Online Payments */}
                {paymentMethod === "online" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-gray-900 border border-gray-700 p-4 rounded-xl mt-2 overflow-hidden block">
                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-2">Select Secure Payment Method</label>
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => setOnlineSubMethod("upi")} className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${onlineSubMethod === "upi" ? "bg-white text-gray-900 border-white" : "bg-gray-800 text-gray-400 border-gray-700"}`}>UPI</button>
                      <button onClick={() => setOnlineSubMethod("card")} className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${onlineSubMethod === "card" ? "bg-white text-gray-900 border-white" : "bg-gray-800 text-gray-400 border-gray-700"}`}>Credit / Debit Card</button>
                    </div>

                    {onlineSubMethod === "upi" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div>
                           <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">Popular UPI Apps</label>
                           <div className="grid grid-cols-4 gap-2">
                             {[
                               { id: 'phonepe', src: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
                               { id: 'gpay', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
                               { id: 'paytm', src: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
                               { id: 'bhim', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg' }
                             ].map(app => (
                               <button 
                                 key={app.id}
                                 onClick={() => setUpiProvider(app.id)}
                                 className={`py-2 rounded-lg border transition flex items-center justify-center bg-white ${upiProvider === app.id ? "ring-2 ring-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105 z-10 relative" : "border-gray-200 opacity-80 hover:opacity-100 hover:scale-105"}`}
                               >
                                 <img 
                                   src={app.src} 
                                   alt={app.id} 
                                   className="h-6 w-full object-contain px-1" 
                                 />
                               </button>
                             ))}
                           </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">Enter Your UPI ID</label>
                          <input 
                            type="text" 
                            placeholder="username@bank" 
                            value={paymentDetails.upiId}
                            onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                          />
                        </div>
                      </motion.div>
                    )}

                    {onlineSubMethod === "card" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div>
                          <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="XXXX XXXX XXXX XXXX" 
                            value={paymentDetails.cardNumber}
                            onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 font-mono tracking-widest"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">Expiry (MM/YY)</label>
                             <input 
                               type="text" 
                               placeholder="MM / YY" 
                               value={paymentDetails.cardExpiry}
                               onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})}
                               className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 font-mono tracking-widest"
                             />
                           </div>
                           <div>
                             <label className="block mb-1 text-[10px] text-gray-400 font-bold uppercase">CVV</label>
                             <input 
                               type="password" 
                               placeholder="•••" 
                               maxLength="3"
                               value={paymentDetails.cardCvv}
                               onChange={(e) => setPaymentDetails({...paymentDetails, cardCvv: e.target.value})}
                               className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 font-mono tracking-widest text-center"
                             />
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Price Preview */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 md:p-8 rounded-2xl mb-8 shadow-inner">
              <div className="flex justify-between text-base md:text-lg text-gray-400 mb-2"><span>Base Price:</span><span className="text-gray-200">₹{provider.price}</span></div>
              <div className="flex justify-between text-base md:text-lg text-gray-400 mb-2"><span>Tax (5%):</span><span className="text-gray-200">₹{Math.round(provider.price * 0.05)}</span></div>
              <div className="flex justify-between text-base md:text-lg text-gray-400 mb-3"><span>Platform Fee:</span><span className="text-sm md:text-base text-gray-500">(Paid by provider)</span></div>
              <div className="w-full border-t border-gray-700/50 my-4"></div>
              <div className="flex justify-between font-extrabold text-xl md:text-2xl lg:text-3xl mt-4"><span>Total You Pay:</span><span className="text-white bg-green-500/20 px-4 py-1 rounded-lg border border-green-500/30 text-green-400">₹{calculateTotal()}</span></div>
              <p className="text-sm md:text-base text-center mt-6 text-gray-500 font-medium bg-gray-900/40 p-3 rounded-xl border border-gray-800/50">
                {paymentMethod === "online" ? "🔒 Amount is securely held until you mark 'Completed'." : "⚠️ Pay directly to the provider on completion."}
              </p>
            </div>

            {/* 🚀 Confirm */}
            <Button onClick={handleBooking} variant="primary" className="py-5 lg:py-6 text-lg md:text-xl font-extrabold shadow-xl shadow-blue-500/20 w-full rounded-2xl tracking-wide uppercase hover:scale-[1.02]">
               Confirm Booking for ₹{calculateTotal()}
            </Button>
          </motion.div>
        ) : (
          /* 🎉 Success Animation */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 p-8 md:p-12 lg:p-16 rounded-3xl text-center shadow-2xl mt-8"
          >
            <div className="text-6xl md:text-7xl mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🎉</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-400 mb-2 tracking-tight">
              Booking Secured!
            </h2>
            <p className="text-base md:text-lg font-mono text-gray-400 bg-gray-800/80 p-3 rounded-xl mb-8 select-all border border-gray-700/50 inline-block px-6">Order ID: <span className="text-gray-300 font-bold tracking-widest">{orderInfo?.orderId}</span></p>

            <div className="text-left bg-gray-800/50 border border-gray-700 p-6 md:p-8 rounded-2xl mb-8 shadow-inner max-w-lg mx-auto">
               <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700/50">
                  <span className="text-gray-400 text-base font-semibold">Status</span>
                  <span className="text-blue-400 font-extrabold text-sm bg-blue-900/40 px-3 py-1 rounded-full border border-blue-800/50 uppercase tracking-widest">{orderInfo?.status}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-base font-semibold">Amount</span>
                  <span className="font-extrabold text-base text-gray-200">₹{orderInfo?.totalAmount} <span className="text-gray-500 font-normal text-sm ml-1">({orderInfo?.paymentMethod === 'online' ? 'Paid' : 'Cash on Delivery'})</span></span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-base font-semibold">Date & Time</span>
                  <span className="font-extrabold text-base text-gray-200 bg-gray-700/50 px-3 py-1 rounded-lg border border-gray-600/50">{orderInfo?.date} @ {orderInfo?.time}</span>
               </div>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">
              <span className="font-bold text-white">{provider.name}</span> will arrive on <span className="font-bold text-white">{date}</span> at <span className="font-bold text-white">{time}</span>.
            </p>
            <div className="inline-block px-6 py-3 bg-gray-800/50 rounded-xl text-sm md:text-base text-gray-400 font-bold tracking-widest uppercase text-center animate-pulse border border-gray-700/50">
              Redirecting...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Booking;