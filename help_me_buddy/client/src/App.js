import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Code Splitting / Lazy Loading applied to all views for production scalability
const Login = React.lazy(() => import("./pages/login"));
const Home = React.lazy(() => import("./pages/Home"));
const Services = React.lazy(() => import("./pages/services"));
const Details = React.lazy(() => import("./pages/details"));
const Booking = React.lazy(() => import("./pages/booking"));
const Profile = React.lazy(() => import("./pages/profile"));
const ProProfile = React.lazy(() => import("./pages/providerProfile"));
const Settings = React.lazy(() => import("./pages/settings"));
const Chat = React.lazy(() => import("./pages/chat"));
const MapView = React.lazy(() => import("./pages/map"));
const Register = React.lazy(() => import("./pages/register"));
const ProviderDashboard = React.lazy(() => import("./pages/providerDashboard"));
const ProviderOnboarding = React.lazy(() => import("./pages/providerOnboarding"));

// Modern fallback loader for route transitions
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

// Protected Route Component to prevent unauthorized access
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Provider Only Route
const ProviderRoute = ({ children }) => {
  const { user, roles, activeMode } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes("provider") || activeMode !== "provider") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const HiringRoute = ({ children }) => {
  const { user, activeMode } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (activeMode !== "hiring") {
    return <Navigate to="/provider-dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public/Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Must be logged in) */}
            <Route path="/" element={<HiringRoute><Home /></HiringRoute>} />
            <Route path="/services" element={<HiringRoute><Services /></HiringRoute>} />
            <Route path="/details" element={<HiringRoute><Details /></HiringRoute>} />
            <Route path="/booking" element={<HiringRoute><Booking /></HiringRoute>} />
            <Route path="/profile" element={<HiringRoute><Profile /></HiringRoute>} />
            <Route path="/settings" element={<HiringRoute><Settings /></HiringRoute>} />
            <Route path="/chat" element={<HiringRoute><Chat /></HiringRoute>} />
            <Route path="/map" element={<HiringRoute><MapView /></HiringRoute>} />

            {/* Provider Onboarding (User Mode) */}
            <Route path="/provider-onboarding" element={<ProtectedRoute><ProviderOnboarding /></ProtectedRoute>} />

            {/* Provider Only Routes */}
            <Route path="/provider-dashboard" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
            <Route path="/provider-profile" element={<ProviderRoute><ProProfile /></ProviderRoute>} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
