import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

// Modern fallback loader for route transitions
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/details" element={<Details />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/provider-profile" element={<ProProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
