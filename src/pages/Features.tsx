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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Features
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-lg border border-white/10 bg-black/40 hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
