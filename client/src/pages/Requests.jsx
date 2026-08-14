import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Clock, MessageSquare, Star, CalendarClock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import ReviewModal from "../components/ReviewModal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SkeletonRow } from "../components/Skeleton.jsx";

const statusStyles = {
  pending: "bg-accent/10 text-accent",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-rose-500/10 text-rose-400",
  completed: "bg-purple-500/10 text-purple-400",
  cancelled: "bg-black/10 dark:bg-white/10 text-muted-light dark:text-muted-dark",
};

const RequestCard = ({ req, type, onUpdate, onReview }) => {
  const person = type === "incoming" ? req.requester : req.receiver;
  const alreadyReviewed = type === "incoming" ? req.reviewedByReceiver : req.reviewedByRequester;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
          {person?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-medium">{person?.name}</p>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            {type === "incoming" ? "wants" : "requested"} <span className="font-medium text-ink-light dark:text-ink-dark">{req.skillRequested?.title}</span>
          </p>
          <p className="mt-1 text-xs text-muted-light dark:text-muted-dark">Offering: {req.skillOffered}</p>
          {req.message && <p className="mt-1 text-xs italic text-muted-light dark:text-muted-dark">"{req.message}"</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${statusStyles[req.status]}`}>{req.status}</span>

        <Link to={`/chat?user=${person?._id}`} className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-muted-light dark:text-muted-dark hover:text-primary transition-colors">
          <MessageSquare size={15} />
        </Link>

        {type === "incoming" && req.status === "pending" && (
          <div className="flex gap-2">
            <button onClick={() => onUpdate(req._id, "accepted")} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-base-dark transition-colors">
              <Check size={16} />
            </button>
            <button onClick={() => onUpdate(req._id, "rejected")} className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        {req.status === "accepted" && (
          <>
            <button onClick={() => onUpdate(req._id, "completed")} className="btn-secondary !px-3 !py-1.5 text-xs">
              Mark Complete
            </button>
            <Link to="/schedule" className="btn-secondary !px-3 !py-1.5 text-xs">
              <CalendarClock size={13} /> Schedule
            </Link>
          </>
        )}
        {req.status === "completed" && !alreadyReviewed && (
          <button onClick={() => onReview(req)} className="btn-primary !px-3 !py-1.5 text-xs">
            <Star size={13} /> Leave Review
          </button>
        )}
        {req.status === "completed" && (
          <Link to="/certificates" className="btn-secondary !px-3 !py-1.5 text-xs">
            Certificate
          </Link>
        )}
        {type === "outgoing" && req.status === "pending" && (
          <button onClick={() => onUpdate(req._id, "cancelled")} className="btn-secondary !px-3 !py-1.5 text-xs">
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
};

const Requests = () => {
  const [data, setData] = useState({ incoming: [], outgoing: [] });
  const [tab, setTab] = useState("incoming");
  const [loading, setLoading] = useState(true);
  const [reviewSwap, setReviewSwap] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/swaps/mine");
      setData(res.data);
    } catch (err) {
      toast.error("Could not load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/swaps/${id}`, { status });
      toast.success(`Request ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="flex flex-col gap-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      </div>
    );
  }

  const list = data[tab];

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold">Swap Requests</h1>
      <p className="mt-1 mb-8 text-muted-light dark:text-muted-dark">Manage your incoming and outgoing swap requests.</p>

      <div className="mb-8 flex w-fit gap-1 rounded-xl bg-black/5 dark:bg-white/5 p-1">
        {["incoming", "outgoing"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-primary text-base-dark" : "text-muted-light dark:text-muted-dark"
            }`}
          >
            {t} ({data[t]?.length || 0})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Clock} title={`No ${tab} requests`} description="Browse Explore to find skills and send your first swap request." />
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((req) => (
            <RequestCard key={req._id} req={req} type={tab} onUpdate={handleUpdate} onReview={setReviewSwap} />
          ))}
        </div>
      )}

      {reviewSwap && (
        <ReviewModal swap={reviewSwap} onClose={() => setReviewSwap(null)} onSuccess={load} />
      )}
    </div>
  );
};

export default Requests;
