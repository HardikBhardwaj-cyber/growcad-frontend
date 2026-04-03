"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ReactNode } from "react";

export default function Splash({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-99999 bg-black flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-3xl font-bold gradient-text"
          >
            GROWCAD
          </motion.div>
        </motion.div>
      )}

      {!loading && children}
    </>
  );
}