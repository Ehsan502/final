import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles, ExternalLink, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

// 🌟 AD MODAL OVERLAY COMPONENT
const AdModalOverlay = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  const handleClaim = () => {
    toast.success("Promo Code 'SKILL30' Applied!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/40 bg-background/95 p-6 text-foreground shadow-2xl glass">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-[11px] font-bold text-primary uppercase tracking-wider">
              Featured Promotion
            </span>
            <span className="text-xs text-muted-light dark:text-muted-dark font-mono">Ad ({timeLeft}s)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-black/5 dark:bg-white/10 p-1.5 text-muted-light dark:text-muted-dark hover:text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Ad Body Content */}
        <div className="space-y-4 my-2">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Sparkles className="text-amber-400 animate-bounce" size={24} />
            <h3>Upgrade to SkillSwap Pro</h3>
          </div>

          <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
            Unlock exclusive features! Get the <span className="text-primary font-bold">Verified Badge</span>, unlimited skill swap requests, and priority ranking on the Leaderboard.
          </p>

          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-primary">Limited Time Offer</p>
              <p className="text-xl font-extrabold mt-0.5">30% OFF Pro Plan</p>
            </div>
            <button
              type="button"
              onClick={handleClaim}
              className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1.5 active:scale-95"
            >
              Claim Discount <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Timer Progress Bar */}
        <div className="mt-6 pt-2">
          <div className="flex justify-between text-[11px] text-muted-light dark:text-muted-dark mb-1 font-mono">
            <span>Auto closes in</span>
            <span>{timeLeft} seconds</span>
          </div>
          <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(true);

  const handleCloseAd = useCallback(() => {
    setShowAd(false);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      
      // Hard redirect to prevent router loops
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16 relative">
      
      {/* 🌟 Ad Overlay */}
      {showAd && <AdModalOverlay onClose={handleCloseAd} />}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo size={40} />
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-light dark:text-muted-dark">Sign in to continue swapping skills</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full flex items-center justify-center gap-2">
            {loading ? "Signing in..." : "Sign In"} <ArrowRight size={17} />
          </button>
        </form>

        {/* Re-open Ad Option for Demo */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAd(true)}
            className="text-xs text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={12} /> View Special Offer
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-light dark:text-muted-dark">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;