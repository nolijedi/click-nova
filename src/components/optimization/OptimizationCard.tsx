import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, LucideIcon, CheckCircle2, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OptimizationCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  command: string;
  type: 'cmd' | 'powershell' | 'bios';
  gradientFrom: string;
  gradientTo: string;
  isComplete: boolean;
  onExecute: (setOutput: (output: string) => void) => Promise<void>;
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
  isComplete,
  onExecute
}: OptimizationCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [output, setOutput] = useState<string>('');
  const [showOutput, setShowOutput] = useState(false);

  const handleClick = async () => {
    try {
      setIsRunning(true);
      setScanProgress(0);
      setOutput('');
      
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

      await onExecute(setOutput);
      clearInterval(interval);
      setScanProgress(100);
      setShowOutput(true);
    } catch (error) {
      console.error('Failed to execute optimization:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowOutput(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative p-4 rounded-xl transition-all duration-300",
        "bg-black/40 border border-white/10 backdrop-blur-sm",
        "hover:bg-gradient-to-br hover:from-black/60 hover:to-black/40",
        isComplete && "border-green-500/30 shadow-lg shadow-green-500/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`,
          "shadow-lg shadow-cyan-500/20"
        )}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">
            {title}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-white/70 truncate">
                  {description}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          {output && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              onClick={() => setShowOutput(!showOutput)}
            >
              {showOutput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleClick}
            disabled={isRunning || isComplete}
            className={cn(
              "bg-gradient-to-r relative min-w-[100px] h-8",
              `from-${gradientFrom} to-${gradientTo}`,
              "hover:opacity-90 transition-all duration-300",
              "border border-white/10 shadow-lg",
              `shadow-${gradientFrom}/20`,
              isComplete && "opacity-50"
            )}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                {Math.round(scanProgress)}%
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Done
              </>
            ) : (
              "Optimize"
            )}
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showOutput && output && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="relative">
              <div className="absolute left-2 top-2">
                <Terminal className="w-4 h-4 text-white/50" />
              </div>
              <pre className="bg-black/50 rounded-lg p-4 pl-8 text-xs font-mono text-white/70 overflow-x-auto max-h-40">
                {output}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isRunning && (
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${scanProgress}%` }}
        />
      )}
    </motion.div>
  );
}
