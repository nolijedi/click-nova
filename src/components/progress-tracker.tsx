import React from 'react';
import { GamingProgress } from './ui/gaming-progress';
import { Trophy, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Achievement {
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface ProgressTrackerProps {
  achievements: Achievement[];
  totalProgress: number;
  level: number;
}

export function ProgressTracker({
  achievements,
  totalProgress,
  level
}: ProgressTrackerProps) {
  const completedCount = achievements.filter(a => a.completed).length;
  const levelProgress = totalProgress % 100;

  return (
    <Card className="bg-black/40 backdrop-blur-lg border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            System Master Level {level}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-lg font-bold text-yellow-500">
              {completedCount}/{achievements.length}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level Progress</span>
            <span>{levelProgress}%</span>
          </div>
          <GamingProgress
            value={levelProgress}
            variant="neon"
            size="lg"
            animate={levelProgress < 100}
          />
        </div>

        <div className="grid gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                achievement.completed
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  achievement.completed ? 'bg-green-500/30' : 'bg-white/10'
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
              {achievement.completed ? (
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 animate-pulse" />
              ) : (
                <Award className="h-5 w-5 text-white/30" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
