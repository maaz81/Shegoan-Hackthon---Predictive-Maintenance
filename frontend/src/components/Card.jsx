import { motion } from "framer-motion";

const Card = ({ title, value, change }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
    >
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {title}
      </p>

      <div className="flex items-end justify-between mt-3">
        <h2 className="text-3xl font-semibold">{value}</h2>
        <span className="text-green-400 text-sm">{change}</span>
      </div>
    </motion.div>
  );
};

export default Card;