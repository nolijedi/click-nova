import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { Star } from "lucide-react";

export function XPBar() {
  const { level, xp, maxXp } = useGame();
  const progress = (xp / maxXp) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
          <span className="text-sm font-medium">Level {level}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {xp} / {maxXp} XP
        </span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-purple-950"
        indicatorClassName="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      />
    </div>
  );
}
