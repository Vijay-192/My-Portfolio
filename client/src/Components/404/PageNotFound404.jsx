import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function NotFound() {
  const [count, setCount] = useState(10);

  useEffect(() => {
    // countdown timer
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    // redirect after 10 sec
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-black text-white">

      {/* 404 Animated */}
      <motion.h1
        className="text-[10vw] md:text-[8vw] font-bold"
        style={{ color: "var(--edu-primary)" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        className="text-lg md:text-2xl mt-4 text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Page not found or has been moved.
      </motion.p>

      {/* Timer */}
      <motion.div
        className="mt-6 text-sm md:text-base text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Redirecting to home in{" "}
        <span style={{ color: "var(--edu-accent)", fontWeight: "bold" }}>
          {count}s
        </span>
      </motion.div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-lg font-semibold transition"
          style={{
            background: "var(--edu-btn)",
            color: "#fff",
          }}
        >
          Go Back
        </button>

        {/* Home Button */}
        <a
          href="/"
          className="px-6 py-3 rounded-lg font-semibold transition"
          style={{
            background: "var(--edu-accent)",
            color: "#000",
          }}
        >
          Home
        </a>
      </div>

    </div>
  );
}

export default NotFound;