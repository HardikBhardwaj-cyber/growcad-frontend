"use client";

import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl font-bold gradient-text">
        Start Growing Today 🚀
      </h2>

      <div className="mt-6">
        <Button variant="gradient">
          Create Your Institute
        </Button>
      </div>
    </section>
  );
}