import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AvailabilityEditor = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: "Mon", startTime: "18:00", endTime: "20:00" });

  useEffect(() => {
    api
      .get("/availability/mine")
      .then((res) => setSlots(res.data.slots || []))
      .catch(() => toast.error("Could not load availability"))
      .finally(() => setLoading(false));
  }, []);

  const addSlot = () => {
    setSlots((prev) => [...prev, newSlot]);
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/availability/mine", { slots });
      toast.success("Availability updated!");
    } catch (err) {
      toast.error("Could not save availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-10 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={18} className="text-primary" />
        <h2 className="font-display text-lg font-semibold">Weekly Availability</h2>
      </div>

      {slots.length === 0 ? (
        <p className="mb-4 text-sm text-muted-light dark:text-muted-dark">No availability set. Add slots so others know when you're free.</p>
      ) : (
        <div className="mb-4 flex flex-col gap-2">
          {slots.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-black/5 dark:bg-white/5 px-4 py-2 text-sm">
              <span>{s.day} · {s.startTime} - {s.endTime}</span>
              <button onClick={() => removeSlot(i)} className="text-muted-light dark:text-muted-dark hover:text-rose-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <select value={newSlot.day} onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })} className="input-field w-fit">
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} className="input-field w-fit" />
        <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} className="input-field w-fit" />
        <button onClick={addSlot} className="btn-secondary !py-2.5 text-sm">
          <Plus size={15} /> Add
        </button>
        <button onClick={save} disabled={saving} className="btn-primary !py-2.5 text-sm">
          {saving ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </motion.div>
  );
};

export default AvailabilityEditor;
