import { OptimizationCard } from './OptimizationCard';
import { optimizationCommands } from '@/data/commands';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function OptimizationGrid() {
  const [completedOptimizations, setCompletedOptimizations] = useState<string[]>([]);
  const [isOptimizingAll, setIsOptimizingAll] = useState(false);

  const handleExecute = async (command: string, id: string, setOutput: (output: string) => void): Promise<void> => {
    try {
      // For PowerShell commands, wrap them in powershell.exe
      const finalCommand = command.startsWith('powershell') ? command : `powershell.exe -NoProfile -NonInteractive -Command "${command}"`;

      // Execute the command
      const response = await fetch('http://localhost:3001/api/system/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: finalCommand }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute command');
      }

      const data = await response.json();
      setOutput(data.output || 'Command executed successfully');
      setCompletedOptimizations(prev => [...prev, id]);
      
      toast.success('Optimization completed successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('[Error] Failed to execute command:', errorMessage);
      setOutput(`Error: ${errorMessage}`);
      toast.error('Failed to execute command. Please try again.');
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
        commands.map(cmd => ({ command: cmd.command, id: cmd.id }))
      );

      // Execute all commands in sequence
      for (const cmd of allCommands) {
        if (!completedOptimizations.includes(cmd.id)) {
          await handleExecute(cmd.command, cmd.id, () => {});
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(optimizationCommands).map(([category, commands]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-sm space-y-4"
          >
            <h2 className="text-xl font-bold capitalize bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {category} Optimization
            </h2>
            <div className="grid gap-3">
              {commands.map((cmd) => (
                <OptimizationCard
                  key={cmd.id}
                  id={cmd.id}
                  title={cmd.title}
                  description={cmd.description}
                  icon={cmd.icon}
                  command={cmd.command}
                  type={cmd.type}
                  gradientFrom={cmd.gradientFrom}
                  gradientTo={cmd.gradientTo}
                  isComplete={completedOptimizations.includes(cmd.id)}
                  onExecute={setOutput => handleExecute(cmd.command, cmd.id, setOutput)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
