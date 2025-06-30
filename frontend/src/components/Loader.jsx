// components/Loader.js
import React from "react";
// import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 1 }}
    >
      FaceSecure
    </motion.div>
  );
};

export default Loader;