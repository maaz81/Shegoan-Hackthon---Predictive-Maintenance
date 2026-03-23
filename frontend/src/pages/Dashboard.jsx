import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Activity, Cpu, AlertTriangle, Zap,
  Radio, TrendingUp, Bot, RefreshCcw
} from "lucide-react";

// Tiny animated bar chart (Bright Version)
const MiniBarChart = ({ data, color, isHovered }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-full px-2">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm chart-bar transition-all duration-300 relative group"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.05, duration: 0.6 }}
          style={{
            height: `${(v / max) * 100}%`,
            background: isHovered ? `linear-gradient(180deg, ${color}, #e2e8f0)` : `linear-gradient(180deg, #94a3b8, #e2e8f0)`,
          }}
        >
          {/* Tooltip on hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
            Val: {v}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Circular progress ring (Bright Version)
const RingGauge = ({ value, max = 100, color, label, size = 80 }) => {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const progress = circ - (value / max) * circ;
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <motion.circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-sm text-slate-700 title-font">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 tracking-wider">
        {label}
      </span>
    </motion.div>
  );
};

// Live ticker line (Bright Version)
const TickerLine = ({ label, value, color, status }) => (
  <motion.div
    whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
    className="flex items-center justify-between py-2.5 px-2 rounded-lg transition-all cursor-pointer border-b border-slate-100 group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full shadow-sm`} style={{ background: color }} />
      <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">{label}</span>
      {status && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold border border-slate-200">
          {status}
        </span>
      )}
    </div>
    <span className="text-xs font-bold font-mono" style={{ color }}>{value}</span>
  </motion.div>
);

const Dashboard = () => {
  const [chartData, setChartData] = useState([65, 78, 55, 90, 70, 82, 60, 95, 73, 88, 64, 79]);
  const [isChartHovered, setIsChartHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const next = [...prev.slice(1), Math.floor(40 + Math.random() * 55)];
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-slate-50"
    >
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto w-full max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-500 tracking-widest px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
                MODULE :: CORE
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              PREDICTIVE MAINTENANCE
              <span className="text-blue-600 title-font">HUB</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
              <RefreshCcw size={14} className="text-blue-400 animate-spin-slow" />
              Real-time diagnostics and AI-powered insights
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm cursor-pointer"
          >
            <Radio size={18} className="text-emerald-600 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700 tracking-wide">LIVE VIEW</span>
          </motion.div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card title="Total Machines" value="12" change="+2%" icon={Cpu} color="blue" subtitle="04 offline" />
          <Card title="Active Alerts" value="3" change="-1%" icon={AlertTriangle} color="yellow" subtitle="02 critical" />
          <Card title="Critical Issues" value="1" change="+0.5%" icon={Zap} color="red" subtitle="Immediate action" />
          <Card title="Uptime Score" value="94%" change="+3%" icon={Activity} color="green" subtitle="Last 30 days" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">

          {/* Machine Health Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 neon-card p-6"
            onMouseEnter={() => setIsChartHovered(true)}
            onMouseLeave={() => setIsChartHovered(false)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Machine Health Analytics</h2>
                <p className="text-xs font-medium text-slate-400 mt-1">12-hour historical performance aggregate</p>
              </div>
              <div className="flex gap-2">
                <button className="clean-btn active">12H</button>
                <button className="clean-btn">24H</button>
                <button className="clean-btn">7D</button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 mt-4 bg-slate-50/50 rounded-xl p-2 border border-slate-100">
              <MiniBarChart data={chartData} color="#3b82f6" isHovered={isChartHovered} />
            </div>

            {/* X labels */}
            <div className="flex justify-between mt-3 px-2">
              {["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"].map(l => (
                <span key={l} className="text-[10px] font-bold text-slate-400">{l}</span>
              ))}
            </div>
          </motion.div>

          {/* Ring Gauges Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="neon-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">KPI Metrics</h2>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 px-2 py-1 rounded">Avg</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <RingGauge value={87} color="#06b6d4" label="TEMPERATURE" />
              <RingGauge value={62} color="#10b981" label="VIBRATION" />
              <RingGauge value={91} color="#f59e0b" label="PRESSURE" />
              <RingGauge value={44} color="#ef4444" label="WEAR LEVEL" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">

          {/* Machine Status Live */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="neon-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Telemetry</h2>
              <div className="pulse-dot blue" />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-2 shadow-inner">
              <TickerLine label="Assembly Line Alpha" value="84.2°C" color="#ef4444" status="HOT" />
              <TickerLine label="Motor Unit B" value="2.7 mm/s" color="#f59e0b" status="WARN" />
              <TickerLine label="Coolant System" value="4.1 bar" color="#10b981" />
              <TickerLine label="Conveyor Main" value="12.4 A" color="#3b82f6" />
              <TickerLine label="Exhaust Turbines" value="1440 RPM" color="#3b82f6" />
            </div>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="neon-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Alerts</h2>
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">
                1 NEW
              </span>
            </div>
            <div className="space-y-3">
              {[
                { msg: "Overheating detected", tag: "MACH-A", level: "critical", time: "02m ago" },
                { msg: "Vibration spike", tag: "MACH-B", level: "warning", time: "15m ago" },
                { msg: "Pressure nominal", tag: "MACH-C", level: "info", time: "1h ago" },
              ].map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className={`p-3 rounded-xl cursor-pointer shadow-sm border ${
                    a.level === "critical" ? "bg-red-50 border-red-200" : 
                    a.level === "warning" ? "bg-amber-50 border-amber-200" : 
                    "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border bg-white ${
                        a.level === "critical" ? "text-red-600 border-red-200" : 
                        a.level === "warning" ? "text-amber-600 border-amber-200" : 
                        "text-blue-600 border-blue-200"
                      }`}>
                        {a.tag}
                      </span>
                      <p className={`text-xs font-bold ${
                        a.level === "critical" ? "text-red-700" : 
                        a.level === "warning" ? "text-amber-700" : 
                        "text-blue-700"
                      }`}>
                        {a.msg}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                      {a.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="neon-card p-6 relative overflow-hidden group cursor-pointer border-purple-200 bg-gradient-to-br from-white to-purple-50"
          >
            {/* Purple glow gradient */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 bg-purple-400 blur-3xl group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                <Bot size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-purple-800 uppercase tracking-widest">AI Insight</h2>
                <p className="text-[10px] font-bold text-purple-500">CONFIDENCE: 94.7%</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-white shadow-sm backdrop-blur-sm relative z-10">
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Abnormal vibration pattern detected in <strong className="text-slate-900 bg-red-100 px-1 rounded">Machine A</strong>.
                Bearing failure probability: <strong className="text-amber-600">78%</strong> within 5 days.
                <br /><br />
                <span className="text-blue-600 font-bold hover:underline">Click to view recommended maintenance schedule. →</span>
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 relative z-10">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Model v3.1 · Updated just now
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;