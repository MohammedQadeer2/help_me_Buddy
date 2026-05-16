import { motion } from "framer-motion";

export default function CategoryCard({ category, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-2 sm:p-3 rounded-lg hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 sm:gap-1.5 relative overflow-hidden min-h-[75px] sm:min-h-[85px] shadow-sm group"
    >
      {/* Optional faint background image */}
      {category.image && (
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay group-hover:opacity-20 transition-opacity"
          style={{ backgroundImage: `url(${category.image})` }}
        />
      )}

      <div className="text-xl sm:text-2xl relative z-10 drop-shadow-sm">{category.icon}</div>
      <span className="text-[10px] sm:text-xs font-semibold text-gray-300 relative z-10 tracking-wide text-center px-1 leading-tight">{category.name}</span>
    </motion.div>
  );
}