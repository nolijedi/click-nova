import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const features = [
  'Advanced system optimization',
  'Real-time performance monitoring',
  'Custom optimization profiles',
  'Priority customer support',
  'Automatic updates',
  'No ads or limitations'
];

export default function Purchase() {
  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Upgrade to Pro
      </motion.h1>
      
      <motion.div 
        className="max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-6 rounded-lg border border-white/10 bg-black/40 space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Click Nova Pro</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold">$29.99</span>
              <span className="text-white/70">one-time payment</span>
            </div>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Purchase Now
            </Button>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="font-medium mb-4">Everything in Free, plus:</h4>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
