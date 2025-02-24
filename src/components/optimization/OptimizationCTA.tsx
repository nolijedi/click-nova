import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, TrendingUp, Shield } from 'lucide-react';

interface OptimizationCTAProps {
  optimizedCount: number;
  totalXP: number;
}

export function OptimizationCTA({ optimizedCount, totalXP }: OptimizationCTAProps) {
  if (optimizedCount === 0) return null;

  const handleUpgradeClick = () => {
    window.location.href = '/upgrade';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-lg border border-cyan-500/50 bg-gradient-to-r from-black/40 to-black/60 backdrop-blur"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            Your System is Getting Stronger!
          </h3>
          
          <div className="space-y-3 text-white/80">
            <p className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              {optimizedCount} optimizations completed
            </p>
            <p className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              {totalXP} XP earned
            </p>
            <p className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              System protection enhanced
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className="mb-4">
            <div className="text-lg font-medium text-white/90">
              Want even more optimization power?
            </div>
            <div className="text-white/70">
              Upgrade to Click Nova Pro for advanced features!
            </div>
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/20"
            onClick={handleUpgradeClick}
          >
            Upgrade to Pro
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
