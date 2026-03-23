import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Activity, Cpu, AlertTriangle, Wrench,
  Zap, Radio, TrendingUp, Bot
} from "lucide-react";

// Tiny animated bar chart (no external lib needed)
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-full">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm chart-bar"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.05, duration: 0.6 }}
          style={{
            height: `${(v / max) * 100}%`,
            background: `linear-gradient(180deg, ${color}, ${color}44)`,
            boxShadow: `0 0 6px ${color}88`,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
};

// Circular progress ring
const RingGauge = ({ value, max = 100, color, label, size = 80 }) => {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const progress = circ - (value / max) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="13" fontFamily="'Orbitron',monospace" fontWeight="700">
          {value}%
        </text>
      </svg>
      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: "rgba(0,245,255,0.5)", letterSpacing: "1px" }}>
        {label}
      </span>
    </div>
  );
};

// Live ticker line
const TickerLine = ({ label, value, color }) => (
  <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(0,245,255,0.06)" }}>
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "rgba(160,200,220,0.7)" }}>{label}</span>
    </div>
    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color }}>{value}</span>
  </div>
);

const Dashboard = () => {
  const [chartData, setChartData] = useState([65, 78, 55, 90, 70, 82, 60, 95, 73, 88, 64, 79]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const next = [...prev.slice(1), Math.floor(40 + Math.random() * 55)];
        return next;
      });
      setTick(t => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen robot-grid-bg"
    >
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="pulse-dot cyan" style={{ background: "#00f5ff", boxShadow: "0 0 8px #00f5ff" }} />
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "3px" }}>
                // COMMAND CENTER
              </p>
            </div>
            <h1
              className="font-black tracking-wider"
              style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.6rem", color: "#e0f0ff", letterSpacing: "3px" }}
            >
              PREDICTIVE MAINTENANCE <span style={{ color: "#00f5ff", textShadow: "0 0 16px rgba(0,245,255,0.7)" }}>HUB</span>
            </h1>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "rgba(0,245,255,0.5)", marginTop: "4px" }}>
              Real-time diagnostics · AI-powered predictions · System telemetry
            </p>
          </div>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.2)" }}
          >
            <Radio size={14} style={{ color: "#00ff88", filter: "drop-shadow(0 0 4px #00ff88)" }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "#00ff88" }}>LIVE MONITORING</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card title="Total Machines" value="12" change="+2%" icon={Cpu} color="cyan" subtitle="04 offline" />
          <Card title="Active Alerts" value="3" change="-1%" icon={AlertTriangle} color="yellow" subtitle="02 critical" />
          <Card title="Critical Issues" value="1" change="+0.5%" icon={Zap} color="red" subtitle="Immediate action" />
          <Card title="Uptime Score" value="94%" change="+3%" icon={Activity} color="green" subtitle="Last 30 days" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-5">

          {/* Machine Health Chart — span 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 neon-card corner-bracket p-6 scan-effect"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px" }}>
                  // HEALTH TELEMETRY
                </p>
                <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: "#e0f0ff", fontSize: "15px", marginTop: "2px" }}>
                  Machine Health Overview
                </h2>
              </div>
              <div className="hex-badge">REALTIME</div>
            </div>

            {/* Chart */}
            <div className="h-40">
              <MiniBarChart data={chartData} color="#00f5ff" />
            </div>

            {/* X labels */}
            <div className="flex justify-between mt-2">
              {["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"].map(l => (
                <span key={l} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "rgba(0,245,255,0.35)" }}>{l}</span>
              ))}
            </div>
          </motion.div>

          {/* Ring Gauges Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="neon-card corner-bracket p-6"
          >
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px", marginBottom: "16px" }}>
              // PERFORMANCE RINGS
            </p>
            <div className="grid grid-cols-2 gap-4">
              <RingGauge value={87} color="#00f5ff" label="TEMP" />
              <RingGauge value={62} color="#00ff88" label="VIBR" />
              <RingGauge value={91} color="#ffcc00" label="PRES" />
              <RingGauge value={44} color="#ff2244" label="WEAR" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-5">

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="neon-card corner-bracket p-6"
          >
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px", marginBottom: "14px" }}>
              // RECENT ALERTS
            </p>
            <div className="space-y-3">
              {[
                { msg: "Machine A: Overheating detected", level: "critical", time: "02m ago" },
                { msg: "Machine B: Vibration spike", level: "warning", time: "15m ago" },
                { msg: "Machine C: Pressure nominal", level: "info", time: "1h ago" },
              ].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`p-3 rounded-lg alert-${a.level}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "12px", fontWeight: 600 }}
                       className={a.level === "critical" ? "neon-red-text" : a.level === "warning" ? "neon-yellow-text" : "neon-text-sm"}>
                      {a.msg}
                    </p>
                    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: "rgba(0,245,255,0.4)", whiteSpace: "nowrap" }}>
                      {a.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Machine Status Live */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="neon-card corner-bracket p-6"
          >
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px", marginBottom: "14px" }}>
              // MACHINE FEED
            </p>
            <div>
              <TickerLine label="MACH-A :: Temp" value="84.2°C" color="#ff2244" />
              <TickerLine label="MACH-B :: Vibr" value="2.7 mm/s" color="#ffcc00" />
              <TickerLine label="MACH-C :: Pres" value="4.1 bar" color="#00ff88" />
              <TickerLine label="MACH-D :: Curr" value="12.4 A" color="#00f5ff" />
              <TickerLine label="MACH-E :: RPM" value="1440" color="#00f5ff" />
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            className="neon-card corner-bracket p-6 relative overflow-hidden"
            style={{ borderColor: "rgba(191,0,255,0.3)" }}
          >
            {/* Purple glow */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-3xl"
                 style={{ background: "#bf00ff" }} />

            <div className="flex items-center gap-2 mb-3">
              <Bot size={16} style={{ color: "#bf00ff", filter: "drop-shadow(0 0 6px #bf00ff)" }} />
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(191,0,255,0.7)", letterSpacing: "2px" }}>
                // AI INSIGHT
              </p>
            </div>

            <div
              className="px-3 py-2 rounded-lg mb-3"
              style={{ background: "rgba(191,0,255,0.08)", border: "1px solid rgba(191,0,255,0.2)" }}
            >
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "rgba(191,0,255,0.6)", marginBottom: "6px" }}>
                PREDICTION_CONFIDENCE: 94.7%
              </p>
              <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "13px", fontWeight: 500, color: "#e0d0ff", lineHeight: 1.6 }}>
                Abnormal vibration pattern detected in <span style={{ color: "#ff2244" }}>Machine A</span>.
                Bearing failure probability: <span style={{ color: "#ffcc00" }}>78%</span> within 5 days.
                Immediate maintenance recommended.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp size={12} style={{ color: "#00ff88" }} />
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "#00ff88" }}>
                MODEL v3.1 · UPDATED 2m AGO
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;