export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-32">

      {/* 🔥 TOP CTA STRIP */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold">
            Ready to scale your institute?
          </h3>
          <p className="text-white/60 mt-1">
            Automate, manage, and grow — all in one place.
          </p>
        </div>

        <button className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:scale-105 transition">
          Get Started
        </button>
      </div>

      {/* 🔥 MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold tracking-wide">GROWCAD</h2>
          <p className="text-white/60 mt-3 max-w-xs">
            Growth OS built for coaching institutes to streamline operations and scale faster.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <p className="text-white/40 text-sm mb-4">Product</p>
          <div className="space-y-2 text-white/70">
            <p className="hover:text-white transition cursor-pointer">Features</p>
            <p className="hover:text-white transition cursor-pointer">Pricing</p>
            <p className="hover:text-white transition cursor-pointer">Dashboard</p>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <p className="text-white/40 text-sm mb-4">Company</p>
          <div className="space-y-2 text-white/70">
            <p className="hover:text-white transition cursor-pointer">About</p>
            <p className="hover:text-white transition cursor-pointer">Contact</p>
            <p className="hover:text-white transition cursor-pointer">Careers</p>
          </div>
        </div>

        {/* LEGAL */}
        <div>
          <p className="text-white/40 text-sm mb-4">Legal</p>
          <div className="space-y-2 text-white/70">
            <p className="hover:text-white transition cursor-pointer">Privacy Policy</p>
            <p className="hover:text-white transition cursor-pointer">Terms of Service</p>
          </div>
        </div>

      </div>

      {/* 🔥 BOTTOM BAR */}
      <div className="border-t border-white/10 py-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Growcad. All rights reserved.
      </div>

    </footer>
  );
}