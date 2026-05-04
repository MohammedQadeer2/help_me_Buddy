import { motion } from "framer-motion";

export default function CategoryCard({ category, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 p-4 md:p-6 rounded-[1.25rem] sm:rounded-3xl hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 sm:gap-3 relative overflow-hidden min-h-[105px] sm:min-h-[130px] md:min-h-[150px] shadow-sm group"
    >
      {/* Optional faint background image */}
      {category.image && (
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay group-hover:opacity-20 transition-opacity"
          style={{ backgroundImage: `url($)` }}
        />
      )}

      <div className="text-[2.1rem] sm:text-4xl md:text-5xl relative z-10 drop-shadow-sm">{category.icon}</div>
      <span className="text-[12px] sm:text-sm md:text-base font-bold text-gray-300 relative z-10 tracking-wide text-center px-1 leading-tight mt-1">{category.name}</span>
    </motion.div>
  );
}