import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, AlertTriangle, Wrench, Cpu, Wifi, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [systemLoad, setSystemLoad] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setSystemLoad(prev => {
        const delta = (Math.random() - 0.5) * 6;
        return Math.min(95, Math.max(40, prev + delta));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Alerts", icon: AlertTriangle, path: "/alerts" },
    { name: "Maintenance", icon: Wrench, path: "/maintenance" },
  ];

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div
      className="h-screen w-64 flex flex-col hex-pattern relative select-none"
      style={{
        background: "linear-gradient(180deg, #030f1e 0%, #020912 100%)",
        borderRight: "1px solid rgba(0, 245, 255, 0.15)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #00f5ff, transparent)", opacity: 0.5 }}
      />

      {/* Logo Area */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(0,245,255,0.4)",
                background: "rgba(0,245,255,0.05)",
              }}
            >
              <Cpu size={18} className="neon-text-sm" />
            </motion.div>
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88", animation: "pulse-ring 2s infinite" }}
            />
          </div>

          <div>
            <h1
              className="logo-flicker text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', monospace", color: "#00f5ff", textShadow: "0 0 12px rgba(0,245,255,0.8)" }}
            >
              PRED·AI
            </h1>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.5)", letterSpacing: "2px" }}>
              MAINTENANCE SYS v2.4
            </p>
          </div>
        </div>

        {/* System time */}
        <div
          className="mt-3 px-3 py-2 rounded-lg flex items-center justify-between"
          style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.1)" }}
        >
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "12px", color: "#00f5ff", opacity: 0.8 }}>
            {formatTime(time)}
          </span>
          <div className="flex items-center gap-1">
            <Wifi size={10} style={{ color: "#00ff88" }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#00ff88" }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4" style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)" }} />

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p
          className="px-3 mb-3 uppercase tracking-widest"
          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.4)" }}
        >
          // NAVIGATION
        </p>

        {menu.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group ${
                  isActive ? "sidebar-item-active" : ""
                }`}
                style={
                  !isActive
                    ? { color: "rgba(160,200,220,0.6)" }
                    : {}
                }
              >
                {/* Hover glow */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.1)" }}
                  />
                )}

                <Icon
                  size={17}
                  className="relative z-10 transition-all duration-300"
                  style={isActive ? { color: "#00f5ff", filter: "drop-shadow(0 0 4px #00f5ff)" } : {}}
                />
                <span
                  className="relative z-10 flex-1 transition-all duration-300 group-hover:text-white"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.5px" }}
                >
                  {item.name}
                </span>
                {isActive && (
                  <ChevronRight size={13} style={{ color: "#00f5ff", filter: "drop-shadow(0 0 3px #00f5ff)" }} />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom system stats */}
      <div className="p-4 m-4 rounded-xl" style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.12)" }}>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.5)", marginBottom: "10px", letterSpacing: "1.5px" }}>
          // SYS STATUS
        </p>

        {/* CPU Load */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "rgba(0,245,255,0.6)" }}>CPU</span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#00f5ff" }}>{systemLoad.toFixed(0)}%</span>
          </div>
          <div className="neon-progress-bar">
            <motion.div
              className="neon-progress-fill"
              animate={{ width: `${systemLoad}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Network */}
        <div>
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "rgba(0,245,255,0.6)" }}>NET</span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#00ff88" }}>STABLE</span>
          </div>
          <div className="neon-progress-bar">
            <div className="neon-progress-fill" style={{ width: "85%", background: "linear-gradient(90deg, #00ff44, #00ff88)", boxShadow: "0 0 8px #00ff88" }} />
          </div>
        </div>

        {/* Online indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className="pulse-dot green" />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#00ff88" }}>ALL SYSTEMS ONLINE</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;