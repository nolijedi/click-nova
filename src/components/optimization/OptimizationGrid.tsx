import { OptimizationCard } from './OptimizationCard';
import { OptimizationCTA } from './OptimizationCTA';
import { optimizationCommands } from '@/data/commands';
import { useGame } from '@/contexts/GameContext';
import { executeCommand } from '@/api/system';
import { toast } from 'sonner';
import { useState } from 'react';

export function OptimizationGrid() {
  const { addXp, completeAchievement } = useGame();
  const [completedOptimizations, setCompletedOptimizations] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState<number>(0);

  const handleExecute = async (command: string, id: string, xp: number): Promise<void> => {
    try {
      const result = await executeCommand(command);
      
      // Add XP and complete achievement
      addXp(xp);
      setTotalXP(prev => prev + xp);
      completeAchievement(id);
      setCompletedOptimizations(prev => [...prev, id]);
      
      // Show success animation
      const element = document.getElementById(id);
      if (element) {
        element.classList.add('animate-success');
        setTimeout(() => {
          element.classList.remove('animate-success');
        }, 1000);
      }

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('[Error] Failed to execute command:', errorMessage);
      toast.error('Failed to execute command. Please try again.');
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(optimizationCommands).map(([category, commands]) => (
        <div key={category} className="space-y-2">
          <h2 className="text-xl font-bold capitalize bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {category} Optimization
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {commands.map((cmd) => (
              <OptimizationCard
                key={cmd.id}
                {...cmd}
                onExecute={() => handleExecute(cmd.command, cmd.id, cmd.xp)}
              />
            ))}
          </div>
        </div>
      ))}

      <OptimizationCTA 
        optimizedCount={completedOptimizations.length}
        totalXP={totalXP}
      />
    </div>
  );
}
