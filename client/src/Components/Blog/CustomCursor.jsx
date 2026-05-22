import { motion } from "framer-motion";

export default function CustomCursor({ text, x, y }) {
  if (!text) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[999] pointer-events-none"
      style={{ x, y }}
    >
      <div className=" w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-sm font-medium">
        {text}
      </div>
    </motion.div>
  );
}
