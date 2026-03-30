"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Basic",
    price: "₹15 / student",
    desc: "Run your institute",
  },
  {
    name: "Academic",
    price: "₹25 / student",
    desc: "Upgrade teaching system",
    highlight: true,
  },
  {
    name: "Advanced",
    price: "₹99 / student",
    desc: "Scale & earn more",
  },
];

export default function Pricing() {
  return (
    <section className="py-24 px-6 text-center">
      
      {/* 🔥 HEADING */}
      <h2 className="text-4xl font-bold gradient-text">
        Pricing that grows with you
      </h2>

      <p className="text-slate-400 mt-4">
        Pay only for the students you manage.
      </p>

      {/* 💀 PLAN GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`glass p-6 rounded-2xl transition-all ${
              p.highlight ? "glow border border-purple-500/40" : ""
            }`}
          >
            <h3 className="text-xl font-bold">
              {p.name}
            </h3>

            <p className="text-3xl mt-2 font-semibold">
              {p.price}
            </p>

            <p className="text-slate-400 mt-2">
              {p.desc}
            </p>

            <Button variant="gradient" className="mt-6 w-full">
              Choose Plan
            </Button>
          </motion.div>
        ))}
      </div>

      {/* 🔥 CUSTOM PLAN SECTION */}
      <div className="mt-20 glass p-8 rounded-2xl max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold">
          Customize your plan
        </h3>

        <p className="text-slate-400 mt-2">
          Add WhatsApp, AI tools, and automation based on your needs.
        </p>

        <Button variant="secondary" className="mt-6">
          Build Custom Plan
        </Button>
      </div>
    </section>
  );
}