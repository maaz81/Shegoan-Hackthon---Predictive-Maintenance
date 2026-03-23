import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";

// Mini sparkline
const Sparkline = ({ data, color }) => {
  const w = 120, h = 40;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
};

const machines = [
  { id: "MACH-A", temp: 84, vibr: 2.1, pressure: 3.8, current: 11.2, health: 72, status: "warning" },
  { id: "MACH-B", temp: 67, vibr: 3.2, pressure: 4.1, current: 12.8, health: 55, status: "critical" },
  { id: "MACH-C", temp: 55, vibr: 0.8, pressure: 4.3, current: 10.5, health: 94, status: "ok" },
  { id: "MACH-D", temp: 71, vibr: 1.4, pressure: 3.9, current: 13.1, health: 81, status: "ok" },
  { id: "MACH-E", temp: 90, vibr: 0.6, pressure: 2.7, current: 9.8,  health: 48, status: "critical" },
];

const statusStyle = {
  ok:       { color: "#00ff88", label: "NOMINAL" },
  warning:  { color: "#ffcc00", label: "WARNING" },
  critical: { color: "#ff2244", label: "CRITICAL" },
};

const Analytics = () => {
  const [liveData, setLiveData] = useState(
    machines.map(m => ({
      ...m,
      history: Array.from({ length: 10 }, () => Math.floor(m.health + (Math.random() - 0.5) * 12)),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev =>
        prev.map(m => ({
          ...m,
          temp: +(m.temp + (Math.random() - 0.5) * 2).toFixed(1),
          vibr: +(m.vibr + (Math.random() - 0.5) * 0.2).toFixed(2),
          history: [...m.history.slice(1), Math.floor(m.health + (Math.random() - 0.5) * 10)],
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen robot-grid-bg">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">

        {/* Header */}
        <div>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "3px", marginBottom: "4px" }}>
            // SENSOR ANALYTICS
          </p>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.5rem", color: "#e0f0ff", fontWeight: 800, letterSpacing: "3px" }}>
            MACHINE <span style={{ color: "#00f5ff", textShadow: "0 0 16px rgba(0,245,255,0.7)" }}>ANALYTICS</span>
          </h1>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "rgba(0,245,255,0.4)", marginTop: "4px" }}>
            Live telemetry · Health scores · Trend analysis
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "AVG HEALTH", value: "70%", color: "#00f5ff", icon: Activity },
            { label: "AVG TEMP",   value: "73°C",  color: "#ff2244", icon: Thermometer },
            { label: "AVG VIBR",   value: "1.6 mm/s", color: "#ffcc00", icon: BarChart3 },
            { label: "TREND",      value: "↑ +3%",    color: "#00ff88", icon: TrendingUp },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="neon-card corner-bracket p-4"
              style={{ borderColor: `${s.color}33` }}
            >
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: `${s.color}88`, letterSpacing: "1.5px" }}>{s.label}</p>
                <s.icon size={13} style={{ color: s.color, opacity: 0.7 }} />
              </div>
              <p style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.4rem", fontWeight: 800, color: s.color, textShadow: `0 0 12px ${s.color}66` }}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Machine Analytics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="neon-card corner-bracket p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px" }}>
              // TELEMETRY TABLE — REALTIME
            </p>
            <div className="hex-badge">AUTO-REFRESH</div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-7 pb-3 mb-1" style={{ borderBottom: "1px solid rgba(0,245,255,0.12)" }}>
            {["MACHINE", "STATUS", "TEMP", "VIBRATION", "PRESSURE", "HEALTH", "TREND"].map(h => (
              <span key={h} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: "rgba(0,245,255,0.4)", letterSpacing: "1.5px" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {liveData.map((m, i) => {
              const st = statusStyle[m.status];
              const healthColor = m.health > 80 ? "#00ff88" : m.health > 60 ? "#ffcc00" : "#ff2244";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="grid grid-cols-7 items-center py-3 px-2 rounded-lg transition-all duration-200"
                  style={{ borderBottom: "1px solid rgba(0,245,255,0.05)" }}
                  whileHover={{ background: "rgba(0,245,255,0.04)" }}
                >
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "12px", color: "#00f5ff" }}>
                    {m.id}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs w-fit"
                    style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30`, letterSpacing: "1px" }}
                  >
                    {st.label}
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "12px", color: m.temp > 80 ? "#ff2244" : "#e0f0ff" }}>
                    {m.temp.toFixed(1)}°C
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "12px", color: m.vibr > 2 ? "#ffcc00" : "#e0f0ff" }}>
                    {m.vibr.toFixed(2)} mm/s
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "12px", color: "#e0f0ff" }}>
                    {m.pressure.toFixed(1)} bar
                  </span>

                  {/* Health Bar */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="neon-progress-bar flex-1" style={{ height: "5px" }}>
                        <motion.div
                          className="neon-progress-fill"
                          animate={{ width: `${m.health}%` }}
                          transition={{ duration: 0.8 }}
                          style={{ background: `linear-gradient(90deg, ${healthColor}88, ${healthColor})`, boxShadow: `0 0 6px ${healthColor}` }}
                        />
                      </div>
                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: healthColor, minWidth: "30px" }}>
                        {m.health}%
                      </span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <Sparkline data={m.history} color={healthColor} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;