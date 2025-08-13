import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* spinner */}
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
      />
    </motion.div>
  );
}
