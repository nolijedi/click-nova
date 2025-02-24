import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Star, LucideIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isComplete, setIsComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState<number>(0);

  const handleExecute = async () => {
    try {
      setIsRunning(true);
      setScanProgress(0);
      
      // Simulate scan progress
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      await onExecute();
      
      clearInterval(interval);
      setScanProgress(100);
      setIsComplete(true);
      setShowXpGain(true);
      
      setTimeout(() => {
        setShowXpGain(false);
      }, 2000);
      
      toast.success(`${title} completed successfully!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Failed to execute ${title}: ${errorMessage}`);
      setIsComplete(false);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        id={id}
        className={cn(
          "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          "after:absolute after:inset-0 after:z-10 after:opacity-0 after:transition-opacity after:duration-300",
          isComplete ? "border-green-500/50" : "border-white/10 hover:border-cyan-500/50",
          "animate-success:after:opacity-100"
        )}
      >
        <AnimatePresence>
          {showXpGain && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-4 right-4 flex items-center gap-1 text-yellow-400 z-20"
            >
              <Star className="h-4 w-4" />
              <span className="font-bold">+{xp} XP</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }}
        />

        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg transition-colors duration-300",
              isComplete ? "bg-green-500/20" : `bg-${gradientFrom}/10`
            )}>
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
            {isRunning && (
              <div className="relative h-1 bg-black/20 rounded overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}

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
                  "transition-all duration-300",
                  isComplete
                    ? "bg-green-500 hover:bg-green-600"
                    : cn(
                        "bg-gradient-to-r",
                        `from-${gradientFrom}`,
                        `to-${gradientTo}`,
                        "hover:opacity-90"
                      )
                )}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Scanning...
                  </>
                ) : isComplete ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Optimized!
                  </>
                ) : (
                  'Optimize Now'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
