import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Wrench, Calendar, Clock, CheckCircle, AlertCircle, Circle, ChevronRight } from "lucide-react";

const schedule = [
  { id: "WO-2401", machine: "Machine A", task: "Bearing replacement + lubrication", due: "Tomorrow", priority: "critical", tech: "TECH-03", duration: "4h", status: "pending" },
  { id: "WO-2402", machine: "Machine B", task: "Vibration sensor calibration", due: "In 3 days", priority: "warning", tech: "TECH-01", duration: "2h", status: "pending" },
  { id: "WO-2403", machine: "Machine C", task: "Scheduled oil change", due: "In 5 days", priority: "info", tech: "TECH-02", duration: "1h", status: "scheduled" },
  { id: "WO-2404", machine: "Machine D", task: "Filter inspection & replacement", due: "In 7 days", priority: "info", tech: "TECH-04", duration: "1.5h", status: "scheduled" },
  { id: "WO-2405", machine: "Machine E", task: "Full system diagnostic", due: "Overdue", priority: "critical", tech: "TECH-03", duration: "6h", status: "overdue" },
  { id: "WO-2406", machine: "Machine F", task: "Belt tension check", due: "Done", priority: "ok", tech: "TECH-01", duration: "0.5h", status: "done" },
];

const priorityCfg = {
  critical: { color: "#ff2244", glow: "rgba(255,34,68,0.2)", label: "CRITICAL" },
  warning:  { color: "#ffcc00", glow: "rgba(255,204,0,0.2)",  label: "HIGH" },
  info:     { color: "#00f5ff", glow: "rgba(0,245,255,0.15)", label: "ROUTINE" },
  ok:       { color: "#00ff88", glow: "rgba(0,255,136,0.15)", label: "DONE" },
};

const statusIcon = { pending: Circle, scheduled: Clock, overdue: AlertCircle, done: CheckCircle };
const statusColor = { pending: "#ffcc00", scheduled: "#00f5ff", overdue: "#ff2244", done: "#00ff88" };

const Maintenance = () => {
  const pending  = schedule.filter(s => s.status === "pending" || s.status === "overdue").length;
  const done     = schedule.filter(s => s.status === "done").length;
  const upcoming = schedule.filter(s => s.status === "scheduled").length;

  return (
    <div className="flex min-h-screen robot-grid-bg">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "3px", marginBottom: "4px" }}>
              // WORK ORDER MANAGEMENT
            </p>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.5rem", color: "#e0f0ff", fontWeight: 800, letterSpacing: "3px" }}>
              MAINTENANCE <span style={{ color: "#00f5ff", textShadow: "0 0 16px rgba(0,245,255,0.7)" }}>SCHEDULER</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
               style={{ background: "rgba(0,245,255,0.07)", border: "1px solid rgba(0,245,255,0.2)" }}>
            <Calendar size={14} style={{ color: "#00f5ff" }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "#00f5ff" }}>
              MARCH 2026
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Action Required", count: pending,  color: "#ff2244", icon: AlertCircle },
            { label: "Upcoming",        count: upcoming, color: "#ffcc00", icon: Clock },
            { label: "Completed",       count: done,     color: "#00ff88", icon: CheckCircle },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="neon-card corner-bracket p-5 flex items-center gap-4"
              style={{ borderColor: `${s.color}33` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}>
                <s.icon size={20} style={{ color: s.color, filter: `drop-shadow(0 0 6px ${s.color})` }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.8rem", fontWeight: 900, color: s.color, textShadow: `0 0 16px ${s.color}66` }}>
                  {s.count}
                </p>
                <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: `${s.color}88`, letterSpacing: "1px" }}>
                  {s.label.toUpperCase()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Work Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="neon-card corner-bracket p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px" }}>
              // WORK ORDERS
            </p>
            <div className="hex-badge">6 TOTAL</div>
          </div>

          <div className="space-y-3">
            {schedule.map((item, i) => {
              const pCfg = priorityCfg[item.priority];
              const StatusIcon = statusIcon[item.status];
              const sColor = statusColor[item.status];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: item.status === "overdue" ? "rgba(255,34,68,0.06)" : "rgba(0,245,255,0.03)",
                    border: `1px solid ${item.status === "overdue" ? "rgba(255,34,68,0.25)" : "rgba(0,245,255,0.1)"}`,
                  }}
                >
                  {/* Status icon */}
                  <StatusIcon size={18} style={{ color: sColor, filter: `drop-shadow(0 0 4px ${sColor})`, flexShrink: 0 }} />

                  {/* WO ID + machine */}
                  <div className="w-24 flex-shrink-0">
                    <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "#00f5ff", letterSpacing: "0.5px" }}>{item.id}</p>
                    <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "rgba(160,200,220,0.7)", marginTop: "1px" }}>{item.machine}</p>
                  </div>

                  {/* Task */}
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: "14px", color: "#c0d8e8" }}>{item.task}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.4)" }}>
                        ⏱ {item.duration}
                      </span>
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.4)" }}>
                        👤 {item.tech}
                      </span>
                    </div>
                  </div>

                  {/* Priority badge */}
                  <span
                    className="px-3 py-1 rounded text-xs flex-shrink-0"
                    style={{
                      fontFamily: "'Share Tech Mono',monospace",
                      fontSize: "9px",
                      background: `${pCfg.color}12`,
                      color: pCfg.color,
                      border: `1px solid ${pCfg.color}30`,
                      letterSpacing: "1.5px",
                    }}
                  >
                    {pCfg.label}
                  </span>

                  {/* Due */}
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono',monospace",
                      fontSize: "11px",
                      color: item.status === "overdue" ? "#ff2244" : "rgba(0,245,255,0.5)",
                      flexShrink: 0,
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    {item.due}
                  </span>

                  <ChevronRight size={14} style={{ color: "rgba(0,245,255,0.3)", flexShrink: 0 }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance;