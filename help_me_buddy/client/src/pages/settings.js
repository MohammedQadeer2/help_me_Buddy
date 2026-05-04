import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assume we can update user context later if needed

  // Form states initialized with user data or empty strings
  const [name, setName] = useState(user?.name || "John Doe");
  const [email, setEmail] = useState(user?.email || "john@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123 Main Street, City Center");

  // Toggle states
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const handleSave = () => {
    // In a real app, this would dispatch an API call
    alert("Settings saved successfully!");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex justify-center text-white pb-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-6">

        {/* 🔙 Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        {/* 📝 Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6 shadow-sm"
        >
          <h2 className="text-md font-semibold text-gray-200 mb-4 border-b border-gray-800 pb-2">
            Personal Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-xs text-gray-400">Full Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-400">Email Address</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-400">Phone Number</label>
              <input
                type="tel"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-400">Default Address</label>
              <textarea
                rows="2"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>
          </div>
        </motion.div>

        {/* 🔔 Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-6 shadow-sm"
        >
          <h2 className="text-md font-semibold text-gray-200 mb-4 border-b border-gray-800 pb-2">
            Notification Preferences
          </h2>

          <div className="space-y-5">
            {/* Toggle Item */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive booking updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotif(!emailNotif)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotif ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotif ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">Push Notifications</p>
                <p className="text-xs text-gray-500">Get alerts on your device instantly</p>
              </div>
              <button
                onClick={() => setPushNotif(!pushNotif)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotif ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pushNotif ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">SMS Alerts</p>
                <p className="text-xs text-gray-500">Receive text messages for emergencies</p>
              </div>
              <button
                onClick={() => setSmsNotif(!smsNotif)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  smsNotif ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  smsNotif ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 🔒 Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-8 shadow-sm"
        >
          <h2 className="text-md font-semibold text-gray-200 mb-4 border-b border-gray-800 pb-2">
            Security & Payment
          </h2>
          <div className="space-y-3">
            <button className="w-full flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
              <span>🔑 Change Password</span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
              <span>💳 Manage Payment Methods</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </motion.div>

        {/* 🚀 Save Action */}
        <div className="mb-8">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        {/* ⚠️ Danger Zone */}
        <div className="border-t border-red-900/50 pt-6">
          <h2 className="text-sm border-l-4 border-red-600 pl-2 font-bold tracking-widest text-red-500 uppercase mb-4">
            Danger Zone
          </h2>
          <button className="w-full p-4 bg-red-950/30 border border-red-900 hover:bg-red-900/60 rounded-xl text-red-400 font-semibold text-sm transition">
            Delete Account Permanently
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;