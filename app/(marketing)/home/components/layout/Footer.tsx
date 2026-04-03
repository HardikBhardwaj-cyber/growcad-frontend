export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 mt-32">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold">GROWCAD</h2>
          <p className="text-white/60 mt-3">
            Growth OS for coaching institutes.
          </p>
        </div>

        {/* LINKS */}
        <div className="space-y-2 text-white/70">
          <p>Features</p>
          <p>Pricing</p>
          <p>Contact</p>
        </div>

        {/* CTA */}
        <div>
          <p className="text-white/70 mb-3">
            Start growing today 🚀
          </p>
          <button className="px-6 py-3 bg-white text-black rounded-lg">
            Get Started
          </button>
        </div>

      </div>
    </footer>
  );
}