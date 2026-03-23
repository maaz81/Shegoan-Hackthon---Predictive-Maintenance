import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { AlertTriangle, Zap, Info, CheckCircle, Filter, Bell } from "lucide-react";
import { useState } from "react";

const alerts = [
  { id: "ALT-001", machine: "Machine A", msg: "Core temperature exceeded 90°C threshold", level: "critical", time: "02m ago", sensor: "TEMP_SENSOR_01" },
  { id: "ALT-002", machine: "Machine B", msg: "Vibration amplitude spike: 3.2 mm/s", level: "warning", time: "15m ago", sensor: "VIB_SENSOR_03" },
  { id: "ALT-003", machine: "Machine C", msg: "Pressure drop below safe operating range", level: "warning", time: "42m ago", sensor: "PRES_SENSOR_02" },
  { id: "ALT-004", machine: "Machine D", msg: "Bearing wear indicator at 78%", level: "critical", time: "1h ago", sensor: "WEAR_SENSOR_01" },
  { id: "ALT-005", machine: "Machine E", msg: "Scheduled maintenance due in 2 days", level: "info", time: "2h ago", sensor: "SYS_MONITOR" },
  { id: "ALT-006", machine: "Machine F", msg: "All parameters within normal range", level: "ok", time: "3h ago", sensor: "SYS_MONITOR" },
];

const levelConfig = {
  critical: { color: "#ff2244", bg: "rgba(255,34,68,0.08)", border: "rgba(255,34,68,0.3)", borderLeft: "#ff2244", icon: Zap, label: "CRITICAL" },
  warning:  { color: "#ffcc00", bg: "rgba(255,204,0,0.08)",  border: "rgba(255,204,0,0.3)",  borderLeft: "#ffcc00", icon: AlertTriangle, label: "WARNING" },
  info:     { color: "#00f5ff", bg: "rgba(0,245,255,0.06)",  border: "rgba(0,245,255,0.2)",  borderLeft: "#00f5ff", icon: Info, label: "INFO" },
  ok:       { color: "#00ff88", bg: "rgba(0,255,136,0.06)",  border: "rgba(0,255,136,0.2)",  borderLeft: "#00ff88", icon: CheckCircle, label: "NOMINAL" },
};

const Alerts = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.level === filter);

  const counts = {
    critical: alerts.filter(a => a.level === "critical").length,
    warning: alerts.filter(a => a.level === "warning").length,
    info: alerts.filter(a => a.level === "info").length,
  };

  return (
    <div className="flex min-h-screen robot-grid-bg">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "3px", marginBottom: "4px" }}>
              // ALERT MANAGEMENT
            </p>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.5rem", color: "#e0f0ff", fontWeight: 800, letterSpacing: "3px" }}>
              SYSTEM <span style={{ color: "#ff2244", textShadow: "0 0 16px rgba(255,34,68,0.6)" }}>ALERTS</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
               style={{ background: "rgba(255,34,68,0.07)", border: "1px solid rgba(255,34,68,0.2)" }}>
            <Bell size={14} style={{ color: "#ff2244" }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "#ff2244" }}>
              {counts.critical} CRITICAL ACTIVE
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Critical", count: counts.critical, color: "#ff2244", glow: "rgba(255,34,68,0.2)" },
            { label: "Warning",  count: counts.warning,  color: "#ffcc00", glow: "rgba(255,204,0,0.2)" },
            { label: "Info",     count: counts.info,     color: "#00f5ff", glow: "rgba(0,245,255,0.2)" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="neon-card corner-bracket p-5 text-center"
              style={{ borderColor: `${s.color}44` }}
            >
              <p style={{ fontFamily: "'Orbitron',monospace", fontSize: "2rem", fontWeight: 900, color: s.color, textShadow: `0 0 20px ${s.glow}` }}>
                {s.count}
              </p>
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: `${s.color}99`, letterSpacing: "2px" }}>
                {s.label.toUpperCase()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <Filter size={13} style={{ color: "rgba(0,245,255,0.5)" }} />
          {["all", "critical", "warning", "info", "ok"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="neon-btn"
              style={{
                background: filter === f ? "rgba(0,245,255,0.15)" : "rgba(0,245,255,0.04)",
                borderColor: filter === f ? "rgba(0,245,255,0.6)" : "rgba(0,245,255,0.2)",
                boxShadow: filter === f ? "0 0 12px rgba(0,245,255,0.2)" : "none",
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const cfg = levelConfig[a.level];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderLeft: `3px solid ${cfg.borderLeft}`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}33` }}>
                    <Icon size={15} style={{ color: cfg.color, filter: `drop-shadow(0 0 4px ${cfg.color})` }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: cfg.color, letterSpacing: "1px" }}>
                        [{a.id}]
                      </span>
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.4)" }}>
                        {a.machine}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30`, letterSpacing: "1px" }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: "14px", color: "#c0d8e8" }}>
                      {a.msg}
                    </p>
                    <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.3)", marginTop: "4px" }}>
                      SENSOR: {a.sensor}
                    </p>
                  </div>

                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "rgba(0,245,255,0.4)", flexShrink: 0 }}>
                    {a.time}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Alerts;