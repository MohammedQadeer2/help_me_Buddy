import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Verification Multi-Step State
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form Data State
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    otp: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "user",
    idType: "Aadhaar",
    idNumber: "",
    idFile: null,
    address: ""
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLogin = () => {
    // Generate Unique Identifier from Document Number (simulating a hash/UUID to prevent duplicates)
    const uniqueIdentityCode = `HMB-${formData.idType.substring(0, 3).toUpperCase()}-${(formData.idNumber || "0000").slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Final Step - Complete Onboarding
    login(formData.role, { 
      name: formData.name || "Verified User", 
      email: formData.phoneOrEmail, 
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      isVerified: true,
      uniqueId: uniqueIdentityCode
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 text-white p-4">

      {/* Card */}
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl overflow-hidden relative">
        
        {/* Progress Bar Header */}
        <div className="h-1.5 w-full bg-gray-800 absolute top-0 left-0">
          <motion.div 
            className="h-full bg-blue-500 rounded-r-full"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            {step > 1 ? (
              <button onClick={handleBack} className="text-gray-400 hover:text-white transition w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                ←
              </button>
            ) : <div className="w-8 h-8" />} {/* Spacer */}
            
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="min-h-[250px] relative">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Phone / OTP */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold tracking-wide">Welcome</h1>
                    <p className="text-sm text-gray-400 mt-2">Enter your phone number to continue</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Phone Number / Email</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium tracking-wide"
                      value={formData.phoneOrEmail}
                      onChange={(e) => setFormData({...formData, phoneOrEmail: e.target.value})}
                    />
                  </div>

                  {formData.phoneOrEmail.length > 5 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-green-400 font-bold uppercase">OTP Sent! Enter below:</label>
                        <span className="text-[10px] text-gray-500">Resend in 0:45</span>
                      </div>
                      <div className="flex gap-2 justify-center mt-2">
                        {[1,2,3,4].map((i) => (
                           <input 
                             key={i} 
                             type="text" 
                             maxLength={1} 
                             placeholder="0"
                             className="w-12 h-14 text-center text-xl font-bold bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                             onChange={(e) => {
                               if (e.target.value && i === 4) setFormData({...formData, otp: "1234"}); 
                             }}
                           />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <Button onClick={handleNext} variant="primary" className="mt-4 py-4 text-lg">
                    Verify & Continue →
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Basic Info & Role */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-5"
                >
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold">Personal Details</h2>
                    <p className="text-sm text-gray-400 mt-1">Let's set up your profile</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">I want to...</label>
                    <div className="flex gap-3 bg-gray-800 p-1.5 rounded-xl">
                      <button
                        onClick={() => setFormData({...formData, role: "user"})}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-all ${formData.role === "user" ? "bg-blue-600 text-white shadow-lg scale-[1.02]" : "text-gray-400 hover:bg-gray-700"}`}
                      >
                        <span className="text-xl mb-1">👤</span>
                        <span className="text-xs font-bold">Hire Help</span>
                      </button>
                      <button
                        onClick={() => setFormData({...formData, role: "provider"})}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-all ${formData.role === "provider" ? "bg-purple-600 text-white shadow-lg scale-[1.02]" : "text-gray-400 hover:bg-gray-700"}`}
                      >
                        <span className="text-xl mb-1">🛠️</span>
                        <span className="text-xs font-bold">Offer Work</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <Button onClick={handleNext} variant="primary" className="mt-2 py-4">Next Step →</Button>
                </motion.div>
              )}

              {/* STEP 3: Password Setup */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-center mb-2">
                    <span className="text-4xl inline-block mb-3">🔒</span>
                    <h2 className="text-2xl font-bold">Secure Account</h2>
                    <p className="text-sm text-gray-400 mt-1">Set a password for your account</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>

                  {formData.password && formData.password !== formData.confirmPassword && formData.confirmPassword && (
                     <p className="text-xs text-red-500 text-center">Passwords do not match.</p>
                  )}

                  <Button 
                    onClick={handleNext} 
                    variant="primary" 
                    className="mt-4 py-4"
                    disabled={!formData.password || formData.password !== formData.confirmPassword}
                  >
                    Set Password →
                  </Button>
                </motion.div>
              )}

              {/* STEP 4: Identity Verification (Aadhaar) */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-center mb-2">
                    <span className="text-4xl inline-block mb-3">🛡️</span>
                    <h2 className="text-2xl font-bold">Identity Verification</h2>
                    <p className="text-sm text-gray-400 mt-1">To maintain trust and safety</p>
                  </div>

                  <div className="mb-2">
                    <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Document Type</label>
                    <select
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 appearance-none"
                      value={formData.idType}
                      onChange={(e) => setFormData({...formData, idType: e.target.value, idNumber: ""})}
                    >
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Passbook">Bank Passbook</option>
                      <option value="VoterID">Voter ID</option>
                    </select>

                    <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">{formData.idType} Number</label>
                    <input
                      type="text"
                      maxLength={
                        formData.idType === "Aadhaar" ? 12 :
                        formData.idType === "PAN" ? 10 :
                        formData.idType === "VoterID" ? 10 : 18
                      }
                      placeholder={
                        formData.idType === "Aadhaar" ? "XXXX XXXX XXXX" :
                        formData.idType === "PAN" ? "ABCDE1234F" :
                        "Enter Document Number"
                      }
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                    />
                  </div>

                  <label className="border-2 border-dashed border-gray-700 bg-gray-900 rounded-xl p-6 text-center mt-2 cursor-pointer hover:bg-gray-800 transition hover:border-gray-500 group block relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({...formData, idFile: e.target.files[0]});
                        }
                      }}
                    />
                    <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition">🪪</div>
                    <p className="text-sm font-semibold text-blue-400">
                      {formData.idFile ? "File Selected" : "Tap to Upload ID Photo"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.idFile ? formData.idFile.name : "Front and back (JPG, PNG)"}
                    </p>
                  </label>

                  <Button onClick={handleNext} variant="primary" className="mt-4 py-4">Securely Verify →</Button>
                </motion.div>
              )}

              {/* STEP 5: Location & Finish */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-center mb-2">
                    <span className="text-4xl inline-block mb-3">📍</span>
                    <h2 className="text-2xl font-bold">Service Location</h2>
                    <p className="text-sm text-gray-400 mt-1">Where do you need/offer services?</p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-green-600/20 text-green-400 border border-green-500/50 py-3 rounded-xl font-bold hover:bg-green-600/30 transition">
                    <span className="animate-pulse">🎯</span> Auto-detect via GPS
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                    <div className="relative flex justify-center text-xs"><span className="bg-gray-900/80 px-2 text-gray-500 uppercase font-bold">OR TYPE MANUALLY</span></div>
                  </div>

                  <textarea
                    placeholder="Enter complete flat, street, and landmark..."
                    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>

                  <Button onClick={handleLogin} className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-lg font-bold">
                    🚀 Complete Setup
                  </Button>
                  <p className="text-[10px] text-center text-gray-500 mt-2">By continuing, you agree to our Terms, Privacy & KYC Policies.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;