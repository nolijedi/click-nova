import { OptimizationGrid } from '@/components/optimization/OptimizationGrid';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, LineChart, Settings, Lock, LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Performance Boost',
    description: 'Advanced optimization algorithms to enhance system speed and responsiveness.'
  },
  {
    icon: Shield,
    title: 'System Protection',
    description: 'Proactive monitoring and protection against system vulnerabilities.'
  },
  {
    icon: Cpu,
    title: 'Resource Management',
    description: 'Smart allocation and management of system resources for optimal performance.'
  },
  {
    icon: LineChart,
    title: 'Real-time Monitoring',
    description: 'Detailed insights into system performance with real-time analytics.'
  },
  {
    icon: Settings,
    title: 'Custom Optimization',
    description: 'Tailored optimization settings based on your system and usage patterns.'
  },
  {
    icon: Lock,
    title: 'Security Enhancement',
    description: 'Built-in security features to keep your system safe and protected.'
  }
];

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-glow"
        >
          System Optimization Suite
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/70 max-w-2xl mx-auto"
        >
          Enhance your system's performance with our advanced optimization tools.
          Streamline your PC for peak efficiency.
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-blue-500/10 rounded-3xl backdrop-blur-sm -z-10" />
        <OptimizationGrid />
      </div>
    </motion.div>
  );
}
