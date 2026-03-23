import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";

// Mini sparkline (Bright)
const Sparkline = ({ data, color }) => {
  const w = 100, h = 30;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const machines = [
  { id: "MACH-A", name: "Assembly Line Alpha", temp: 84, vibr: 2.1, pressure: 3.8, current: 11.2, health: 72, status: "warning" },
  { id: "MACH-B", name: "Motor Unit B", temp: 67, vibr: 3.2, pressure: 4.1, current: 12.8, health: 55, status: "critical" },
  { id: "MACH-C", name: "Coolant System", temp: 55, vibr: 0.8, pressure: 4.3, current: 10.5, health: 94, status: "ok" },
  { id: "MACH-D", name: "Conveyor Main", temp: 71, vibr: 1.4, pressure: 3.9, current: 13.1, health: 81, status: "ok" },
  { id: "MACH-E", name: "Exhaust Turbines", temp: 90, vibr: 0.6, pressure: 2.7, current: 9.8,  health: 48, status: "critical" },
];

const statusStyle = {
  ok:       { color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200", label: "NOMINAL" },
  warning:  { color: "#d97706", bg: "bg-amber-50", border: "border-amber-200", label: "WARNING" },
  critical: { color: "#dc2626", bg: "bg-red-50", border: "border-red-200", label: "CRITICAL" },
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto w-full max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold text-cyan-500 tracking-widest px-2 py-1 bg-cyan-50 rounded-md border border-cyan-100 mb-2 inline-block">
              MODULE :: SENSORS
            </span>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              MACHINE <span className="text-cyan-600 title-font">ANALYTICS</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Deep telemetry streams, historical trends, and health scores
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-200 shadow-sm"
          >
            <Activity size={16} className="text-cyan-600 animate-pulse" />
            <span className="text-[11px] font-bold text-cyan-700 tracking-widest">AUTO-REFRESH: ON</span>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: "FLEET HEALTH AVG", value: "70%", color: "text-cyan-600", bg: "bg-cyan-50", icon: Activity },
            { label: "AVG TEMP",   value: "73°C",  color: "text-red-500", bg: "bg-red-50", icon: Thermometer },
            { label: "AVG VIBRATION",   value: "1.6 mm/s", color: "text-amber-500", bg: "bg-amber-50", icon: BarChart3 },
            { label: "OVERALL TREND",      value: "↑ +3%",    color: "text-emerald-500", bg: "bg-emerald-50", icon: TrendingUp },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{s.label}</p>
                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <s.icon size={16} className={s.color} />
                </div>
              </div>
              <p className={`text-3xl font-black title-font ${s.color}`}>
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
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Realtime Telemetry Stream</h2>
            <div className="flex gap-2">
              <button className="clean-btn active">Live</button>
              <button className="clean-btn">History</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Device ID</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temp</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vibration</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trend (10m)</th>
                </tr>
              </thead>
              <tbody>
                {liveData.map((m, i) => {
                  const st = statusStyle[m.status];
                  const healthColor = m.health > 80 ? "#10b981" : m.health > 60 ? "#f59e0b" : "#ef4444";
                  return (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="border-b last:border-0 border-slate-50 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-cyan-600 tech-font">{m.id}</span>
                          <span className="text-[10px] font-medium text-slate-400">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${st.bg} ${st.border}`} style={{ color: st.color, letterSpacing: "1px" }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold font-mono ${m.temp > 80 ? "text-red-600 bg-red-50 px-2 py-0.5 rounded" : "text-slate-600"}`}>
                          {m.temp.toFixed(1)}°C
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold font-mono ${m.vibr > 2 ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded" : "text-slate-600"}`}>
                          {m.vibr.toFixed(2)} mm/s
                        </span>
                      </td>

                      {/* Health Bar */}
                      <td className="px-4 py-4 w-48">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full transition-all duration-1000"
                              animate={{ width: `${m.health}%` }}
                              style={{ backgroundColor: healthColor }}
                            />
                          </div>
                          <span className="text-xs font-bold w-8" style={{ color: healthColor }}>
                            {m.health}%
                          </span>
                        </div>
                      </td>

                      {/* Sparkline */}
                      <td className="px-4 py-4">
                        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                          <Sparkline data={m.history} color={healthColor} />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;