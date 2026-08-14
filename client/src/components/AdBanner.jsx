import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ExternalLink, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const AdBanner = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [adDismissed, setAdDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (adDismissed || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, adDismissed]);

  const handleClaim = () => {
    toast.success("Redirecting to Pricing Plans!");
    navigate("/pricing"); // 🚀 User ko Pricing Page par bhej dega
  };

  if (adDismissed || timeLeft <= 0) {
    return (
      <div className="mb-4 text-center">
        <button
          type="button"
          onClick={() => { setTimeLeft(10); setAdDismissed(false); }}
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 transition-all"
        >
          <RefreshCw size={12} /> Show Special Offer Ad
        </button>
      </div>
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900 p-4 text-white shadow-2xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[11px]">
        <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-emerald-400 font-bold uppercase tracking-wider">
          Sponsored Offer
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-400 font-bold">{timeLeft}s</span>
          <button
            type="button"
            onClick={() => setAdDismissed(true)}
            className="hover:text-white text-gray-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
            🚀 Upgrade to SkillSwap Pro <Sparkles size={12} className="text-yellow-400 animate-pulse" />
          </h4>
          <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
            Get 30% off Pro Plan. Unlock verified badge & unlimited requests!
          </p>
        </div>

        <button
          type="button"
          onClick={handleClaim}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2 text-[11px] flex items-center gap-1 flex-shrink-0 transition-all shadow-lg"
        >
          View Plans <ExternalLink size={10} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
        <div
          className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AdBanner;