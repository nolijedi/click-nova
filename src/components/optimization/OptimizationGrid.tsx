import { OptimizationCard } from './OptimizationCard';
import { optimizationCommands } from '@/data/commands';
import { useGame } from '@/contexts/GameContext';
import { executeCommand } from '@/api/system';
import { toast } from 'sonner';

export function OptimizationGrid() {
  const { addXp, completeAchievement } = useGame();

  const handleExecute = async (command: string, id: string, xp: number) => {
    console.log(`[DEBUG] OptimizationGrid.handleExecute called with:`, { command, id, xp });
    try {
      const result = await executeCommand(command);
      console.log(`[DEBUG] Command execution result:`, result);
      
      // Add XP and complete achievement
      addXp(xp);
      completeAchievement(id);
      
      // Show success animation
      const element = document.getElementById(id);
      if (element) {
        element.classList.add('animate-success');
        setTimeout(() => {
          element.classList.remove('animate-success');
        }, 1000);
      }

      return result;
    } catch (error) {
      console.error('[DEBUG] Failed to execute command:', error);
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
    </div>
  );
}
