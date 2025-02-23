
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface OptimizeButtonProps {
  className?: string;
}

export const OptimizeButton = ({ className }: OptimizeButtonProps) => {
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = async () => {
    setOptimizing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Optimizing system performance...",
        success: "System successfully optimized!",
        error: "Failed to optimize system",
      }
    );
    setTimeout(() => {
      setOptimizing(false);
    }, 2000);
  };

  return (
    <Button
      className={cn(
        "relative bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-500",
        className
      )}
      size="lg"
      onClick={handleOptimize}
      disabled={optimizing}
    >
      {optimizing ? "Optimizing..." : "Optimize Now"}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl" />
    </Button>
  );
};
