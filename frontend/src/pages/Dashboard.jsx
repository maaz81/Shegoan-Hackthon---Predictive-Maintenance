import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Activity, Cpu, AlertTriangle, Zap,
  Radio, TrendingUp, Bot, RefreshCcw,
  CheckCircle, Loader2, WifiOff
} from "lucide-react";

const API_BASE = "http://localhost:8000";

// ─── Mini animated bar chart ─────────────────────────────────────────────────
const MiniBarChart = ({ data, color, isHovered }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 h-full px-2">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-300 relative group"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.05, duration: 0.6 }}
          style={{
            height: `${(v / max) * 100}%`,
            background: isHovered
              ? `linear-gradient(180deg, ${color}, #e2e8f0)`
              : `linear-gradient(180deg, #94a3b8, #e2e8f0)`,
          }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
            {v}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Ring gauge ──────────────────────────────────────────────────────────────
const RingGauge = ({ value, max = 100, color, label, size = 80 }) => {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const safe = Math.min(Math.max(value, 0), max);
  const progress = circ - (safe / max) * circ;
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
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-sm text-slate-700">{Math.round(safe)}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 tracking-wider">{label}</span>
    </motion.div>
  );
};

// ─── Risk badge ───────────────────────────────────────────────────────────────
const RiskBadge = ({ risk }) => {
  const cfg = {
    High: { bg: "bg-red-100", border: "border-red-300", text: "text-red-700", dot: "#ef4444" },
    Medium: { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700", dot: "#f59e0b" },
    Low: { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-700", dot: "#10b981" },
  }[risk] ?? { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600", dot: "#94a3b8" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {risk?.toUpperCase() ?? "—"}
    </span>
  );
};

// ─── Loading skeleton ────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [isChartHovered, setIsChartHovered] = useState(false);

  // Raw machines from /machines
  const [machines, setMachines] = useState([]);
  // Analysis results: { machine, response } per machine
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);   // 0–100
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(""); // "machines" | "analyzing"
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const highCount = results.filter(r => r.response?.machine_status === "High").length;
  const mediumCount = results.filter(r => r.response?.machine_status === "Medium").length;
  const totalAlerts = highCount + mediumCount;
  const avgConf = results.length
    ? Math.round((results.reduce((s, r) => s + (r.response?.confidence ?? 0), 0) / results.length) * 100)
    : 0;

  // Health chart: % of machines in each risk bucket over the result set
  const chartData = results.length
    ? results.map(r => {
      const s = r.response?.machine_status;
      return s === "Low" ? 80 : s === "Medium" ? 50 : 20;
    })
    : Array.from({ length: 12 }, () => Math.floor(40 + Math.random() * 55));

  // KPI gauges
  const tempValues = results.map(r => r.machine.temp);
  const vibrValues = results.map(r => r.machine.vibration);
  const rpmValues = results.map(r => r.machine.rpm);
  const avgTempPct = tempValues.length ? Math.min(Math.round((tempValues.reduce((a, b) => a + b, 0) / tempValues.length) / 1.5), 100) : 0;
  const avgVibrPct = vibrValues.length ? Math.min(Math.round((vibrValues.reduce((a, b) => a + b, 0) / vibrValues.length) * 33), 100) : 0;
  const avgRpmPct = rpmValues.length ? Math.min(Math.round((rpmValues.reduce((a, b) => a + b, 0) / rpmValues.length) / 40), 100) : 0;

  // Top result (highest risk) for AI panel
  const priority = { High: 3, Medium: 2, Low: 1 };
  const topResult = [...results].sort(
    (a, b) => (priority[b.response?.machine_status] ?? 0) - (priority[a.response?.machine_status] ?? 0)
  )[0];

  // ── Fetch all machines then analyze each ────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setProgress(0);

    try {
      // Step 1 — load machines from CSV via /machines
      setLoadingPhase("machines");
      const mRes = await fetch(`${API_BASE}/machines`);
      if (!mRes.ok) throw new Error(`/machines returned HTTP ${mRes.status}`);
      const { machines: machineList } = await mRes.json();
      setMachines(machineList);

      // Step 2 — analyze each machine one by one (sequential to not hammer API)
      setLoadingPhase("analyzing");
      const analyzed = [];
      for (let i = 0; i < machineList.length; i++) {
        const machine = machineList[i];
        try {
          const aRes = await fetch(`${API_BASE}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              log: machine.log,
              temp: machine.temp,
              vibration: machine.vibration,
              rpm: machine.rpm,
            }),
          });
          if (!aRes.ok) throw new Error(`HTTP ${aRes.status}`);
          const response = await aRes.json();
          analyzed.push({ machine, response });
        } catch {
          // If one machine fails, push a fallback so we don't stop everything
          analyzed.push({
            machine,
            response: {
              machine_status: "Low",
              rule_based: "Low",
              ml_prediction: "Low",
              issue: "Analysis failed",
              confidence: 0,
              recommended_action: "Retry analysis",
              explanation: "Could not reach API for this machine.",
            },
          });
        }

        // Update progress & results live as each comes in
        setProgress(Math.round(((i + 1) / machineList.length) * 100));
        setResults([...analyzed]);
      }

      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message ?? "Failed to connect to API");
    } finally {
      setLoading(false);
      setLoadingPhase("");
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const isDone = !loading && results.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-slate-50"
    >
      <Sidebar />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto w-full max-w-[1600px] mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-500 tracking-widest px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
                MODULE :: CORE
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              PREDICTIVE MAINTENANCE
              <span className="text-blue-600">HUB</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
              <RefreshCcw size={14} className="text-blue-400 animate-spin-slow" />
              Real-time diagnostics · {machines.length} machines from dataset
              {lastRefresh && (
                <span className="text-slate-400 text-[11px]">
                  · Last updated {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* API status */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold">
                    <Loader2 size={14} className="animate-spin" />
                    {loadingPhase === "machines" ? "LOADING CSV…" : `ANALYZING… ${progress}%`}
                  </div>
                  {loadingPhase === "analyzing" && (
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </motion.div>
              ) : error ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                  <WifiOff size={14} /> API OFFLINE
                </motion.div>
              ) : (
                <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle size={14} /> {results.length} MACHINES ANALYZED
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Radio size={18} className="text-emerald-600 animate-pulse" />
              <span className="text-sm font-bold text-emerald-700 tracking-wide">RE-ANALYZE</span>
            </motion.button>
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
            >
              <WifiOff size={16} />
              <span>
                Could not reach FastAPI at <code className="font-mono bg-red-100 px-1 rounded">{API_BASE}</code>.
                Make sure your server is running and <code className="font-mono bg-red-100 px-1 rounded">dataset.csv</code> is in the same folder.
              </span>
              <button onClick={fetchAll} className="ml-auto text-xs font-bold underline">Retry</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-6">
          <Card
            title="Total Machines"
            value={loading && machines.length === 0 ? "—" : String(machines.length)}
            change={`${[...new Set(machines.map(m => m.machine_type))].length} types`}
            icon={Cpu}
            color="blue"
            subtitle="From dataset.csv"
          />
          <Card
            title="Active Alerts"
            value={results.length === 0 ? "—" : String(totalAlerts)}
            change={`${highCount} critical · ${mediumCount} medium`}
            icon={AlertTriangle}
            color="yellow"
            subtitle="ML + Rule engine"
          />
          <Card
            title="Critical Issues"
            value={results.length === 0 ? "—" : String(highCount)}
            change={highCount > 0 ? "Immediate action needed" : "All clear"}
            icon={Zap}
            color="red"
            subtitle={highCount > 0 ? `${Math.round((highCount / results.length) * 100)}% of fleet` : "No critical alerts"}
          />
          <Card
            title="AI Confidence"
            value={results.length === 0 ? "—" : `${avgConf}%`}
            change="Combined score"
            icon={Activity}
            color="green"
            subtitle={`${results.length}/${machines.length} analyzed`}
          />
        </div>

        {/* ── Main Content Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-6">

          {/* Health Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            onMouseEnter={() => setIsChartHovered(true)}
            onMouseLeave={() => setIsChartHovered(false)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Machine Health Analytics</h2>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Health score per machine — {results.length} of {machines.length} analyzed
                </p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-xs text-blue-500 font-bold">
                  <Loader2 size={12} className="animate-spin" />
                  Live updating…
                </div>
              )}
            </div>
            <div className="h-48 mt-4 bg-slate-50/50 rounded-xl p-2 border border-slate-100">
              {chartData.length > 0
                ? <MiniBarChart data={chartData} color="#3b82f6" isHovered={isChartHovered} />
                : <div className="flex items-center justify-center h-full"><Loader2 size={24} className="animate-spin text-slate-300" /></div>
              }
            </div>
            <div className="flex items-center gap-4 mt-3 px-2">
              {[
                { color: "#10b981", label: "Low Risk" },
                { color: "#f59e0b", label: "Medium Risk" },
                { color: "#ef4444", label: "High Risk" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-[10px] font-bold text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* KPI Ring Gauges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">KPI Metrics</h2>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 px-2 py-1 rounded">
                {loading ? `${progress}%` : "Live"}
              </span>
            </div>
            {results.length === 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <RingGauge value={avgTempPct} color="#06b6d4" label="TEMPERATURE" />
                <RingGauge value={avgVibrPct} color="#10b981" label="VIBRATION" />
                <RingGauge value={avgRpmPct} color="#f59e0b" label="RPM" />
                <RingGauge value={avgConf} color="#ef4444" label="CONFIDENCE" />
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Bottom Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-6">

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-y-auto max-h-96"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Alerts</h2>
              {highCount > 0 && (
                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">
                  {highCount} CRITICAL
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Show only High + Medium machines in alerts */}
                {results
                  .filter(r => r.response?.machine_status !== "Low")
                  .slice(0, 8)
                  .map(({ machine, response }, i) => {
                    const level = response.machine_status;
                    const s = {
                      High: { card: "bg-red-50 border-red-200", text: "text-red-700" },
                      Medium: { card: "bg-amber-50 border-amber-200", text: "text-amber-700" },
                    }[level] ?? { card: "bg-slate-50 border-slate-200", text: "text-slate-700" };
                    return (
                      <motion.div
                        key={machine.machine_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                        className={`p-3 rounded-xl cursor-pointer shadow-sm border ${s.card}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border bg-white ${s.text}`}>
                              ID-{machine.machine_id}
                            </span>
                            <RiskBadge risk={level} />
                          </div>
                          <span className="text-[10px] text-slate-400">{machine.machine_type}</span>
                        </div>
                        <p className={`text-xs font-bold ${s.text}`}>{response.issue}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{response.recommended_action}</p>
                      </motion.div>
                    );
                  })}

                {results.filter(r => r.response?.machine_status !== "Low").length === 0 && (
                  <div className="text-center py-8 text-emerald-600">
                    <CheckCircle size={28} className="mx-auto mb-2" />
                    <p className="text-xs font-bold">All machines nominal</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="col-span-2 bg-white border border-purple-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group cursor-pointer"
            style={{ background: "linear-gradient(135deg, #ffffff 60%, #faf5ff)" }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-purple-400 blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
                <Bot size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-purple-800 uppercase tracking-widest">AI Insight</h2>
                <p className="text-[10px] font-bold text-purple-500">
                  {loading ? `Analyzing machine ${results.length + 1} of ${machines.length}…` : `CONFIDENCE: ${avgConf}%`}
                </p>
              </div>
              {topResult && !loading && (
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Top risk:</span>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {topResult.machine.machine_type} (ID-{topResult.machine.machine_id})
                  </span>
                  <RiskBadge risk={topResult.response?.machine_status} />
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-white shadow-sm backdrop-blur-sm relative z-10 min-h-[80px]">
              {results.length === 0 ? (
                <div className="flex items-center gap-3 text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Waiting for analysis results…</span>
                </div>
              ) : topResult?.response?.explanation ? (
                <motion.p
                  key={topResult.machine.machine_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm font-medium text-slate-700 leading-relaxed"
                >
                  {topResult.response.explanation}
                </motion.p>
              ) : (
                <p className="text-sm text-slate-400">No AI explanation returned.</p>
              )}
            </div>

            {!loading && topResult && (
              <div className="flex items-center gap-4 mt-4 relative z-10">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Rule Engine: <span className="text-slate-600">{topResult.response?.rule_based}</span>
                  &nbsp;·&nbsp; ML Model: <span className="text-slate-600">{topResult.response?.ml_prediction}</span>
                  &nbsp;·&nbsp; Final: <span className="text-purple-700">{topResult.response?.machine_status}</span>
                  &nbsp;·&nbsp; Fleet: <span className="text-slate-600">{results.length} machines processed</span>
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Full Results Table ────────────────────────────────────────────── */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                Full Fleet Analysis — {results.length} Machines
              </h2>
              {loading && (
                <span className="text-xs text-blue-500 font-bold flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Live updating…
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["ID", "Type", "Temp (°C)", "Vibration", "RPM", "Rule Risk", "ML Risk", "Final Status", "Action"].map(h => (
                      <th key={h} className="px-3 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(({ machine, response }, i) => {
                    const statusBg = {
                      High: "bg-red-50",
                      Medium: "bg-amber-50/50",
                      Low: "",
                    }[response.machine_status] ?? "";
                    return (
                      <motion.tr
                        key={machine.machine_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.01 * i }}
                        className={`border-b last:border-0 border-slate-50 hover:bg-slate-50/80 transition-colors ${statusBg}`}
                      >
                        <td className="px-3 py-3 font-bold text-cyan-600 text-sm">#{machine.machine_id}</td>
                        <td className="px-3 py-3 text-xs font-semibold text-slate-700">{machine.machine_type}</td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-600">{machine.temp.toFixed(1)}</td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-600">{machine.vibration.toFixed(2)}</td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-600">{machine.rpm.toFixed(0)}</td>
                        <td className="px-3 py-3"><RiskBadge risk={response.rule_based} /></td>
                        <td className="px-3 py-3"><RiskBadge risk={response.ml_prediction} /></td>
                        <td className="px-3 py-3"><RiskBadge risk={response.machine_status} /></td>
                        <td className="px-3 py-3 text-[11px] text-slate-600 max-w-[160px] truncate">{response.recommended_action}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default Dashboard;