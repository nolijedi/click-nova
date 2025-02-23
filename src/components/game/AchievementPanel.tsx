import { useGame } from "@/contexts/GameContext";
import { Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function AchievementPanel() {
  const { achievements } = useGame();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-semibold">Achievements</h3>
      </div>
      <div className="grid gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              "p-3 rounded-lg border transition-all duration-300",
              achievement.completed
                ? "bg-green-500/10 border-green-500/20"
                : "bg-gray-500/10 border-gray-500/20 opacity-50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">{achievement.xp} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
