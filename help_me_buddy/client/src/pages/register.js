import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerUser(formData);
      const data = res.data;

      const userToStore = data._id ? data : { ...formData, id: data._id || "HMB-" + Math.floor(Math.random() * 9000), isVerified: true, roles: ["user"], isProvider: false };

      login(userToStore, "hiring");
      navigate("/");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Registration failed");
      
      const fallbackUser = {
        name: formData.name || "Test User",
        email: formData.email,
        roles: ["user"],
        isProvider: false,
        id: "HMB-FALLBACK",
      };
      
      login(fallbackUser, "hiring");
      navigate("/login"); // Redirect to login for fallback to avoid auto-login confusion
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 text-white p-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl overflow-hidden relative p-8">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Help Me Buddy
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Create an account to get started.
            </p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium tracking-wide"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium tracking-wide"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </motion.div>

          <Button type="submit" variant="primary" className="mt-4 py-4 text-lg font-bold shadow-lg shadow-blue-500/20" disabled={loading}>
            {loading ? "Processing..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
