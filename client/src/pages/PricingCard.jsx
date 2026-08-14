import React, { useState, useEffect } from "react";
import { Check, Zap, ShieldCheck, Crown, Sparkles, Volume2, ExternalLink, X, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LocalAdBanner = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [adDismissed, setAdDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (adDismissed || timeLeft <= 0 || isHovered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, adDismissed, isHovered]);

  const handleClaim = () => {
    toast.success("Promo Code 'SKILL30' applied! Check out Pro Plan.");
  };

  const handleReplay = () => {
    setTimeLeft(10);
    setAdDismissed(false);
  };

  if (adDismissed || timeLeft <= 0) {
    return (
      <div className="mb-8 flex justify-end">
        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full transition-all"
        >
          <RefreshCw size={12} /> Re-play Sponsored Ad
        </button>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative mb-10 overflow-hidden rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-5 text-white shadow-2xl backdrop-blur-md transition-all hover:border-accent"
    >
      {/* Background Subtle Animated Grid / Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl"></div>
      <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/30">
            Sponsored Ad
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Volume2 size={12} /> SkillSwap Partners
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-accent">
            Ad ends in: <span className="text-white font-bold">{timeLeft}s</span>
          </span>
          <button
            onClick={() => setAdDismissed(true)}
            className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-gray-300 hover:bg-white/20 hover:text-white transition-all"
          >
            Skip <X size={12} />
          </button>
        </div>
      </div>

      {/* Main Ad Content */}
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-lg font-bold text-white tracking-wide">
              🚀 Master Frontend Development with React Pro
            </h4>
            <Sparkles size={16} className="text-yellow-400 animate-bounce" />
          </div>
          <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
            Boost your portfolio! Exchange 1-on-1 coding mentorship sessions with top verified developers on SkillSwap today.
          </p>
        </div>

        <button
          onClick={handleClaim}
          className="flex items-center gap-2 rounded-xl bg-accent hover:bg-accent/90 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-lg hover:shadow-accent/40 transition-all transform hover:-translate-y-0.5 flex-shrink-0"
        >
          Claim 30% Off Pro <ExternalLink size={14} />
        </button>
      </div>

      {/* 10-Second Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
        <div
          className="h-full bg-gradient-to-r from-accent via-primary to-accent transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const PricingCard = () => {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Flexible Plans
        </span>
        <h2 className="text-3xl font-display font-bold mt-2 text-ink-light dark:text-ink-dark">
          Choose Your SkillSwap Plan
        </h2>
        <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">
          Start for free or upgrade to Pro to unlock unlimited learning opportunities.
        </p>
      </div>

      {/* 🌟 LOCAL SPONSORED AD BANNER */}
      <LocalAdBanner />

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* FREE PLAN */}
        <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-black/20 transition-all">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Zap size={20} />
            <span>Basic Plan</span>
          </div>
          <h3 className="text-2xl font-bold mt-2 text-ink-light dark:text-ink-dark">Free Starter</h3>
          <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1">
            Perfect for casual learners and beginners.
          </p>

          <div className="my-6">
            <span className="text-4xl font-extrabold text-ink-light dark:text-ink-dark">PKR 0</span>
            <span className="text-xs text-ink-light/50 dark:text-ink-dark/50"> / month</span>
          </div>

          <ul className="space-y-3 text-sm text-ink-light/80 dark:text-ink-dark/80 mb-6">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary flex-shrink-0" /> 3 Swap Requests per month
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary flex-shrink-0" /> Access to Public Explore Page
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary flex-shrink-0" /> Basic Chat & Scheduling
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary flex-shrink-0" /> Standard Digital Completion Badge
            </li>
          </ul>

          <Link to="/explore" className="btn-secondary w-full text-center block !py-2.5">
            Get Started Free
          </Link>
        </div>

        {/* PRO / PAID PLAN */}
        <div className="relative p-6 rounded-3xl bg-gradient-to-b from-primary/10 via-background to-background border-2 border-primary shadow-xl">
          {/* Badge */}
          <div className="absolute -top-3.5 right-6 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles size={12} /> MOST POPULAR
          </div>

          <div className="flex items-center gap-2 text-primary font-bold">
            <Crown size={20} />
            <span>Pro Member</span>
          </div>
          <h3 className="text-2xl font-bold mt-2 text-ink-light dark:text-ink-dark">SkillSwap Pro</h3>
          <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1">
            For serious skill swappers and mentors.
          </p>

          <div className="my-6">
            <span className="text-4xl font-extrabold text-primary">PKR 999</span>
            <span className="text-xs text-ink-light/50 dark:text-ink-dark/50"> / month</span>
          </div>

          <ul className="space-y-3 text-sm text-ink-light/80 dark:text-ink-dark/80 mb-6">
            <li className="flex items-center gap-2 font-medium">
              <Check size={16} className="text-primary flex-shrink-0" /> <strong>Unlimited</strong> Swap Requests
            </li>
            <li className="flex items-center gap-2 font-medium">
              <ShieldCheck size={16} className="text-primary flex-shrink-0" /> Verified Blue Tick Badge on Profile
            </li>
            <li className="flex items-center gap-2 font-medium">
              <Check size={16} className="text-primary flex-shrink-0" /> Top Priority in Explore Search Results
            </li>
            <li className="flex items-center gap-2 font-medium">
              <Check size={16} className="text-primary flex-shrink-0" /> Official QR-Verified Certificates
            </li>
            <li className="flex items-center gap-2 font-medium">
              <Check size={16} className="text-primary flex-shrink-0" /> Direct Instant Messaging Support
            </li>
          </ul>

          <button className="btn-primary w-full text-center block !py-2.5 font-bold shadow-lg">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;