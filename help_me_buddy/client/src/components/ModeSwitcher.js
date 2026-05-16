import { useNavigate } from "react-router-dom";

function ModeSwitcher({ roles = [], activeMode, onSwitch }) {
  const navigate = useNavigate();
  const hasProvider = roles.includes("provider");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
        <button
          type="button"
          onClick={() => onSwitch("hiring")}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
            activeMode === "hiring" ? "bg-emerald-500 text-white" : "text-slate-300"
          }`}
        >
          Hiring Services
        </button>
        <button
          type="button"
          onClick={() => hasProvider && onSwitch("provider")}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
            activeMode === "provider" ? "bg-cyan-500 text-white" : "text-slate-300"
          } ${!hasProvider ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Working as Provider
        </button>
      </div>

      {!hasProvider && (
        <button
          type="button"
          onClick={() => navigate("/provider-onboarding")}
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-white/5 border border-white/10 text-cyan-200 hover:bg-white/10 transition"
        >
          Activate Provider Mode
        </button>
      )}
    </div>
  );
}

export default ModeSwitcher;
