import { motion } from "framer-motion";

export default function Button({ children, onClick, variant = "primary", className = "", ...props }) {
  const baseStyle = "w-full py-3 rounded-xl transition font-semibold tracking-wide shadow-md flex justify-center items-center";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-transparent border border-gray-600 hover:bg-gray-700 text-white"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}