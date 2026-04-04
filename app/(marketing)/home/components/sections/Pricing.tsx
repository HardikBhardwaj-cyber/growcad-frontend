"use client";

import { useState } from "react";
import Magnetic from "../motion/Magnetic";

const studentTiers = [150, 250, 500, 750, 1000];

const plans = [
  {
    name: "Basic",
    price: 9,
    highlight: false,
  },
  {
    name: "Academic",
    price: 15,
    highlight: true,
  },
  {
    name: "Advanced",
    price: 25,
    highlight: false,
  },
];

// 🔥 FEATURE MATRIX (FROM YOUR NOTEBOOK)
const features = [
  {
    title: "Student & Batch Management",
    basic: true,
    academic: true,
    advanced: true,
  },
  {
    title: "Smart Attendance",
    basic: true,
    academic: true,
    advanced: true,
  },
  {
    title: "SMS Alerts",
    basic: true,
    academic: true,
    advanced: true,
  },
  {
    title: "WhatsApp Notifications",
    basic: false,
    academic: true,
    advanced: true,
  },
  {
    title: "Fee Management",
    basic: true,
    academic: true,
    advanced: true,
  },
  {
    title: "Auto Test Creation",
    basic: false,
    academic: true,
    advanced: true,
  },
  {
    title: "Live Classes",
    basic: false,
    academic: true,
    advanced: true,
  },
  {
    title: "Study Material",
    basic: true,
    academic: true,
    advanced: true,
  },
  {
    title: "Recorded Lectures",
    basic: false,
    academic: false,
    advanced: true,
  },
  {
    title: "AI Doubt Solving",
    basic: false,
    academic: false,
    advanced: true,
  },
  {
    title: "Custom Email + Domain",
    basic: false,
    academic: "Email",
    advanced: "Email + Domain",
  },
  {
    title: "Performance Reports",
    basic: "Basic",
    academic: "Standard",
    advanced: "Advanced",
  },
];

export default function Pricing() {
  const [students, setStudents] = useState(250);
  const [showTable, setShowTable] = useState(false);

  return (
    <section className="py-32 relative">

      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* 🔥 HEADER */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold">
            Pricing that scales with you
          </h2>
          <p className="text-white/60">
            Pay per student. Grow without limits.
          </p>
        </div>

        {/* 🔥 STUDENT SELECTOR */}
        <div className="flex justify-center">
          <select
            value={students}
            onChange={(e) => setStudents(Number(e.target.value))}
            className="px-6 py-3 bg-black border border-white/20 rounded-xl"
          >
            {studentTiers.map((s) => (
              <option key={s} value={s}>
                {s} Students
              </option>
            ))}
          </select>
        </div>

        {/* 🔥 CARDS */}
        <div className="grid md:grid-cols-3 gap-10">

          {plans.map((plan, i) => {
            const total = plan.price * students;

            return (
              <div
                key={i}
                className={`
                  p-8 rounded-2xl border relative
                  ${plan.highlight
                    ? "border-purple-500 scale-105 bg-white/10"
                    : "border-white/10 bg-white/5"}
                `}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 px-3 py-1 text-xs rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-semibold">{plan.name}</h3>

                <div className="text-5xl font-bold my-6">
                  ₹{total}
                  <span className="text-sm text-white/50">
                    {" "} /month
                  </span>
                </div>

                <p className="text-white/60 text-sm mb-6">
                  ₹{plan.price} per student
                </p>

                <Magnetic>
                  <button className="w-full py-3 btn-primary">
                    Get Started
                  </button>
                </Magnetic>
              </div>
            );
          })}
        </div>

        {/* 🔥 TOGGLE FEATURE TABLE */}
        <div className="text-center">
          <button
            onClick={() => setShowTable(!showTable)}
            className="text-purple-400"
          >
            {showTable ? "Hide Full Comparison" : "Compare All Features"}
          </button>
        </div>

        {/* 🔥 FEATURE TABLE */}
        {showTable && (
          <div className="overflow-x-auto mt-10">
            <table className="w-full text-left border border-white/10 rounded-xl overflow-hidden">

              <thead className="bg-white/5">
                <tr>
                  <th className="p-4">Features</th>
                  <th className="p-4">Basic</th>
                  <th className="p-4">Academic</th>
                  <th className="p-4">Advanced</th>
                </tr>
              </thead>

              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-4 text-white/80">{f.title}</td>

                    <td className="p-4">
                      {typeof f.basic === "boolean"
                        ? f.basic ? "✔" : "—"
                        : f.basic}
                    </td>

                    <td className="p-4">
                      {typeof f.academic === "boolean"
                        ? f.academic ? "✔" : "—"
                        : f.academic}
                    </td>

                    <td className="p-4">
                      {typeof f.advanced === "boolean"
                        ? f.advanced ? "✔" : "—"
                        : f.advanced}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </section>
  );
}