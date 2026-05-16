import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createProvider } from "../api/providerApi";
import { getServiceCategories } from "../api/serviceApi";
import Button from "../components/Button";

function ProviderOnboarding() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: "",
    pricePerHour: "",
    description: "",
    location: "",
    isAvailable: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create provider profile for this user
      await createProvider({
        ...formData,
        pricePerHour: Number(formData.pricePerHour || 0),
      });

      const updatedUser = {
        ...user,
        roles: Array.from(new Set([...(user?.roles || ["user"]), "provider"])),
        isProvider: true,
      };

      // Switch to provider mode after onboarding
      login(updatedUser, "provider");
      navigate("/provider-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);

      try {
        // Load available categories for the dropdown
        const res = await getServiceCategories();
        setCategories(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 flex items-center justify-center text-white p-6">
      <div className="w-full max-w-xl bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Provider Onboarding</h1>
          <p className="text-sm text-gray-400 mt-1">Complete your professional profile to activate Provider Mode.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Category</label>
            <select
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-xs text-gray-500 mt-2">Loading categories...</p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Price Per Hour</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 350"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.pricePerHour}
              onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Description</label>
            <textarea
              rows="3"
              placeholder="Tell clients about your skills"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Location</label>
            <input
              type="text"
              placeholder="City or service area"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              id="isAvailable"
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            />
            <label htmlFor="isAvailable">I am available to take jobs</label>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-base font-bold" disabled={loading}>
            {loading ? "Submitting..." : "Activate Provider Mode"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProviderOnboarding;
