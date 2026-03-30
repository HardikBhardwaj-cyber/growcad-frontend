import { motion } from "framer-motion";

export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass p-5 rounded-2xl transition-all"
    >
      {children}
    </motion.div>
  );
}