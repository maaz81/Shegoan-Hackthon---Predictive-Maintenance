import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const Card = ({ title, value, change, icon: Icon, color = "cyan", subtitle }) => {
  const isPositive = change && !change.startsWith("-");

  const colorMap = {
    cyan: {
      glow: "rgba(0,245,255,0.15)",
      border: "rgba(0,245,255,0.3)",
      text: "#00f5ff",
      shadow: "rgba(0,245,255,0.2)",
    },
    red: {
      glow: "rgba(255,34,68,0.12)",
      border: "rgba(255,34,68,0.35)",
      text: "#ff2244",
      shadow: "rgba(255,34,68,0.2)",
    },
    green: {
      glow: "rgba(0,255,136,0.12)",
      border: "rgba(0,255,136,0.35)",
      text: "#00ff88",
      shadow: "rgba(0,255,136,0.2)",
    },
    yellow: {
      glow: "rgba(255,204,0,0.12)",
      border: "rgba(255,204,0,0.35)",
      text: "#ffcc00",
      shadow: "rgba(255,204,0,0.2)",
    },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative rounded-xl p-5 corner-bracket overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(135deg, rgba(7,21,37,0.97), rgba(3,12,22,0.95))`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 20px ${c.glow}, inset 0 0 20px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Top scan line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${c.text}, transparent)`, opacity: 0.5 }}
      />

      {/* Background hex grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${c.text}22 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: c.text }}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <p
            className="uppercase tracking-widest text-xs font-medium opacity-70"
            style={{ fontFamily: "'Share Tech Mono', monospace", color: c.text, letterSpacing: "2px" }}
          >
            {title}
          </p>
          {Icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${c.glow}`, border: `1px solid ${c.border}` }}
            >
              <Icon size={15} style={{ color: c.text, filter: `drop-shadow(0 0 4px ${c.text})` }} />
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <motion.h2
            className="font-black leading-none"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "2.4rem",
              color: c.text,
              textShadow: `0 0 20px ${c.shadow}, 0 0 40px ${c.shadow}`,
            }}
            animate={{ textShadow: [`0 0 20px ${c.shadow}`, `0 0 30px ${c.shadow}`, `0 0 20px ${c.shadow}`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {value}
          </motion.h2>

          {change && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{
                background: isPositive ? "rgba(0,255,136,0.1)" : "rgba(255,34,68,0.1)",
                border: `1px solid ${isPositive ? "rgba(0,255,136,0.3)" : "rgba(255,34,68,0.3)"}`,
              }}
            >
              {isPositive ? (
                <TrendingUp size={11} style={{ color: "#00ff88" }} />
              ) : (
                <TrendingDown size={11} style={{ color: "#ff2244" }} />
              )}
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "11px",
                  color: isPositive ? "#00ff88" : "#ff2244",
                }}
              >
                {change}
              </span>
            </div>
          )}
        </div>

        {subtitle && (
          <p
            className="mt-2 text-xs opacity-50"
            style={{ fontFamily: "'Share Tech Mono', monospace", color: c.text }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Card;