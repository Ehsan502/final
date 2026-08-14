import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, BookOpen, Flag, TrendingUp, Ban, Trash2, Search } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { SkeletonRow } from "../components/Skeleton.jsx";

const COLORS = ["#00C2A8", "#FFB020", "#8B5CF6", "#F43F5E", "#3B82F6", "#10B981", "#F59E0B"];

const StatBox = ({ label, value, icon: Icon }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon size={19} />
    </div>
    <div>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-light dark:text-muted-dark">{label}</p>
    </div>
  </div>
);

const Admin = () => {
  const [tab, setTab] = useState("overview");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTab = async (activeTab) => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const res = await api.get("/admin/analytics");
        setAnalytics(res.data);
      } else if (activeTab === "users") {
        const res = await api.get("/admin/users", { params: search ? { search } : {} });
        setUsers(res.data);
      } else if (activeTab === "skills") {
        const res = await api.get("/admin/skills");
        setSkills(res.data);
      } else if (activeTab === "reports") {
        const res = await api.get("/admin/reports");
        setReports(res.data);
      }
    } catch (err) {
      toast.error("Could not load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const toggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      toast.success("User status updated");
      loadTab("users");
    } catch (err) {
      toast.error("Could not update user");
    }
  };

  const removeUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User removed");
      loadTab("users");
    } catch (err) {
      toast.error("Could not remove user");
    }
  };

  const removeSkill = async (id) => {
    try {
      await api.delete(`/admin/skills/${id}`);
      toast.success("Skill removed");
      loadTab("skills");
    } catch (err) {
      toast.error("Could not remove skill");
    }
  };

  const updateReport = async (id, status) => {
    try {
      await api.put(`/admin/reports/${id}`, { status });
      toast.success("Report updated");
      loadTab("reports");
    } catch (err) {
      toast.error("Could not update report");
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "users", label: "Users", icon: Users },
    { key: "skills", label: "Skills", icon: BookOpen },
    { key: "reports", label: "Reports", icon: Flag },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-light dark:text-muted-dark">Manage users, skills, and reports.</p>
        </div>
      </div>

      <div className="mb-8 flex w-fit gap-1 rounded-xl bg-black/5 dark:bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-base-dark" : "text-muted-light dark:text-muted-dark"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : (
        <>
          {tab === "overview" && analytics && (
            <div className="flex flex-col gap-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatBox label="Total Users" value={analytics.totalUsers} icon={Users} />
                <StatBox label="Total Skills" value={analytics.totalSkills} icon={BookOpen} />
                <StatBox label="Completed Swaps" value={analytics.completedSwaps} icon={TrendingUp} />
                <StatBox label="Pending Reports" value={analytics.pendingReports} icon={Flag} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card p-6">
                  <h3 className="mb-4 font-display font-semibold">Skills by Category</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={analytics.categoryBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={(d) => d._id}>
                        {analytics.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card p-6">
                  <h3 className="mb-4 font-display font-semibold">Swap Status Breakdown</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={analytics.swapStatusBreakdown}>
                      <XAxis dataKey="_id" stroke="#9AA1B1" fontSize={12} />
                      <YAxis stroke="#9AA1B1" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C2A8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div>
              <div className="relative mb-5 max-w-sm">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadTab("users")}
                  placeholder="Search users..."
                  className="input-field pl-11"
                />
              </div>
              <div className="flex flex-col gap-3">
                {users.map((u) => (
                  <motion.div key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex items-center justify-between p-5">
                    <div>
                      <p className="font-medium">{u.name} {u.role === "admin" && <span className="badge bg-primary/10 text-primary ml-2">admin</span>}</p>
                      <p className="text-sm text-muted-light dark:text-muted-dark">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${u.isBlocked ? "bg-rose-500/10 text-rose-400" : "bg-primary/10 text-primary"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                      {u.role !== "admin" && (
                        <>
                          <button onClick={() => toggleBlock(u._id)} className="btn-secondary !px-3 !py-1.5 text-xs">
                            <Ban size={13} /> {u.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button onClick={() => removeUser(u._id)} className="text-muted-light dark:text-muted-dark hover:text-rose-500">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {tab === "skills" && (
            <div className="flex flex-col gap-3">
              {skills.map((s) => (
                <motion.div key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex items-center justify-between p-5">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-muted-light dark:text-muted-dark">{s.category} • by {s.user?.name}</p>
                  </div>
                  <button onClick={() => removeSkill(s._id)} className="text-muted-light dark:text-muted-dark hover:text-rose-500">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "reports" && (
            <div className="flex flex-col gap-3">
              {reports.length === 0 ? (
                <p className="text-center text-sm text-muted-light dark:text-muted-dark py-10">No reports filed.</p>
              ) : (
                reports.map((r) => (
                  <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {r.targetType === "user" ? `User: ${r.targetUser?.name}` : `Skill: ${r.targetSkill?.title}`}
                      </p>
                      <p className="text-sm text-muted-light dark:text-muted-dark">{r.reason}</p>
                      <p className="text-xs text-muted-light dark:text-muted-dark">Reported by {r.reportedBy?.name}</p>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => updateReport(r._id, e.target.value)}
                      className="input-field w-fit"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
