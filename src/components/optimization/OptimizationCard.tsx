import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Star, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OptimizationCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  command: string;
  type: 'cmd' | 'powershell' | 'bios';
  gradientFrom: string;
  gradientTo: string;
  xp: number;
  onExecute: () => Promise<void>;
}

export function OptimizationCard({
  id,
  title,
  description,
  icon: Icon,
  command,
  type,
  gradientFrom,
  gradientTo,
  xp,
  onExecute
}: OptimizationCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showXpGain, setShowXpGain] = useState(false);

  const handleExecute = async () => {
    console.log(`[DEBUG] Starting execution of command: ${command}`);
    try {
      setIsRunning(true);
      console.log(`[DEBUG] Calling onExecute for command: ${command}`);
      await onExecute();
      console.log(`[DEBUG] Command executed successfully: ${command}`);
      
      // Show XP gain animation
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 2000);
      
      toast.success(`${title} completed successfully!`);
    } catch (error) {
      console.error(`[DEBUG] Command execution failed:`, error);
      toast.error(`Failed to execute ${title}: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card 
      id={id}
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        "after:absolute after:inset-0 after:z-10 after:opacity-0 after:transition-opacity after:duration-300",
        "after:bg-gradient-to-r after:from-green-500/20 after:to-emerald-500/20",
        "animate-success:after:opacity-100"
      )}
    >
      {/* XP Gain Animation */}
      {showXpGain && (
        <div className="absolute -top-4 right-4 flex items-center gap-1 text-yellow-400 animate-float-up">
          <Star className="h-4 w-4" />
          <span className="font-bold">+{xp} XP</span>
        </div>
      )}

      {/* Background gradient effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-${gradientFrom}/10`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="truncate">{title}</span>
              <div className="flex items-center gap-1 text-yellow-400 text-xs ml-2 shrink-0">
                <Star className="h-3 w-3" />
                <span>{xp}</span>
              </div>
            </CardTitle>
            <CardDescription className="text-xs line-clamp-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          <code className="text-xs text-muted-foreground font-mono bg-black/20 p-1.5 rounded block truncate">
            {command}
          </code>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {type}
            </span>
            <Button
              size="sm"
              onClick={handleExecute}
              disabled={isRunning}
              className={cn(
                "relative overflow-hidden text-xs py-1 h-7",
                "bg-gradient-to-r",
                `from-${gradientFrom}`,
                `to-${gradientTo}`,
                "hover:opacity-90",
                "transition-all",
                "duration-300"
              )}
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Running...
                </>
              ) : (
                'Execute'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
