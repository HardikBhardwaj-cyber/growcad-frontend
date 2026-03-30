"use client";

import  Card  from "@/components/ui/card";

const stats = [
  {
    title: "Total Students",
    value: "1,240",
  },
  {
    title: "Fees Collected",
    value: "₹2,40,000",
  },
  {
    title: "Pending Fees",
    value: "₹80,000",
  },
  {
    title: "Attendance Today",
    value: "92%",
  },
];

export default function Stats() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i}>
          <p className="text-sm text-gray-400">{s.title}</p>
          <h2 className="text-2xl font-bold mt-2">{s.value}</h2>
        </Card>
      ))}
    </div>
  );
}