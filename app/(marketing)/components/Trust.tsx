export default function Trust() {
  return (
    <section className="py-24 text-center px-6">
      
      <h2 className="text-3xl font-bold gradient-text">
        Built for Real Coaching Institutes
      </h2>

      <p className="text-slate-400 mt-4 max-w-xl mx-auto">
        Offline. Hybrid. Online. Growcad works everywhere.
      </p>

      {/* 🔥 TRUST POINTS */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        
        <div className="glass p-6 rounded-xl">
          <h4 className="font-semibold">Offline Ready</h4>
          <p className="text-slate-400 text-sm mt-2">
            Works for traditional coaching institutes
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h4 className="font-semibold">Hybrid System</h4>
          <p className="text-slate-400 text-sm mt-2">
            Combine offline + online seamlessly
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h4 className="font-semibold">Fully Online</h4>
          <p className="text-slate-400 text-sm mt-2">
            Run your institute digitally at scale
          </p>
        </div>

      </div>
    </section>
  );
}