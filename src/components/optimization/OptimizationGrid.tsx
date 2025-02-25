
import { OptimizationCard } from './OptimizationCard';
import { optimizationCommands } from '@/data/commands';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api/system';

export function OptimizationGrid() {
  const [completedOptimizations, setCompletedOptimizations] = useState<string[]>([]);
  const [isOptimizingAll, setIsOptimizingAll] = useState(false);

  const handleExecute = async (setOutput: (output: string) => void) => {
    try {
      const response = await fetch(`${API_BASE_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: 'Get-Process' }), // Default safe command
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to execute command');
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('[Error]', result.error);
        toast.error('Command failed: ' + result.error);
        setOutput(result.error);
      } else if (result.output) {
        console.log('[Output]', result.output);
        setOutput(result.output);
        const lines = result.output.split('\n');
        lines.forEach(line => {
          if (line.toLowerCase().includes('warning:')) {
            toast.warning(line);
          } else if (line.trim()) {
            toast.success(line);
          }
        });
      }

    } catch (error) {
      console.error('[Error] Failed to execute command:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage);
      setOutput(errorMessage);
      throw error;
    }
  };

  const handleOptimizeAll = async () => {
    if (isOptimizingAll) return;
    setIsOptimizingAll(true);

    try {
      toast.info('Starting Super Performance optimization...');
      
      // Get all commands
      const allCommands = Object.values(optimizationCommands).flatMap(commands => 
        commands.map(cmd => ({ command: cmd.command, type: cmd.type, id: cmd.id }))
      );

      // Execute all commands in sequence
      for (const cmd of allCommands) {
        if (!completedOptimizations.includes(cmd.id)) {
          await handleExecute((output) => {
            console.log(`Optimization output for ${cmd.id}:`, output);
          });
          setCompletedOptimizations(prev => [...prev, cmd.id]);
          // Small delay between commands
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast.success('Super Performance optimization completed!');
    } catch (error) {
      console.error('Failed to execute all optimizations:', error);
      toast.error('Failed to complete all optimizations');
    } finally {
      setIsOptimizingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Super Performance Mode
            </h2>
            <p className="text-white/70">
              One-click optimization to maximize your system's performance
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleOptimizeAll}
            disabled={isOptimizingAll}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg relative overflow-hidden group animate-pulse-slow"
          >
            <Zap className="w-5 h-5 mr-2" />
            {isOptimizingAll ? 'Optimizing...' : 'Optimize All'}
          </Button>
        </div>
      </motion.div>

      {Object.entries(optimizationCommands).map(([category, commands]) => (
        <div key={category} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commands.map((command) => (
              <OptimizationCard
                key={command.id}
                {...command}
                onExecute={handleExecute}
                isComplete={completedOptimizations.includes(command.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
