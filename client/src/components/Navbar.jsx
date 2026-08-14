import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Compass,
  User as UserIcon,
  MessageSquare,
  Trophy,
  ShieldCheck,
  CalendarClock,
  Award,
  GitPullRequest,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import NotificationBell from "./NotificationBell.jsx";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors flex items-center gap-1.5 ${
      isActive
        ? "text-primary font-semibold"
        : "text-ink-light/70 dark:text-ink-dark/70 hover:text-primary"
    }`;

  // Centralized navigation configuration
  const navItems = [
    { label: "Explore", path: "/explore", icon: Compass, public: true },
    { label: "Leaderboard", path: "/leaderboard", icon: Trophy, public: true },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, protected: true },
    { label: "Requests", path: "/requests", icon: GitPullRequest, protected: true },
    { label: "Chat", path: "/chat", icon: MessageSquare, protected: true },
    { label: "Schedule", path: "/schedule", icon: CalendarClock, protected: true },
    { label: "Certificates", path: "/certificates", icon: Award, protected: true },
    { label: "Profile", path: "/profile", icon: UserIcon, protected: true },
    { label: "Admin", path: "/admin", icon: ShieldCheck, adminOnly: true },
  ];

  // Filter links based on authentication and roles
  const visibleLinks = navItems.filter((item) => {
    if (item.public) return true;
    if (!user) return false;
    if (item.adminOnly) return user.role === "admin";
    return true;
  });

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Logo />
          SkillSwap
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 xl:flex">
          {visibleLinks.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={linkClass}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && <NotificationBell />}

          {user ? (
            <button
              onClick={handleLogout}
              className="hidden xl:inline-flex btn-secondary !px-4 !py-2 text-sm items-center gap-1.5"
            >
              <LogOut size={15} /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden xl:inline-flex btn-primary !px-4 !py-2 text-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-1 text-ink-light dark:text-ink-dark"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-black/5 dark:border-white/5 xl:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {visibleLinks.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}

              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center block"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;