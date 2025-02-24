import { motion } from 'framer-motion';

export default function Benchmarks() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Performance Benchmarks
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add benchmark cards here */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/40 hover:border-cyan-500/50 transition-all">
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-white/70">Benchmark data will be available shortly.</p>
        </div>
      </div>
    </div>
  );
}
