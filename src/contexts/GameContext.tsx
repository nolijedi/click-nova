import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

interface GameContextType {
  level: number;
  xp: number;
  maxXp: number;
  achievements: Achievement[];
  addXp: (amount: number) => void;
  completeAchievement: (id: string) => void;
}

const achievements: Achievement[] = [
  {
    id: 'disk_cleanup',
    title: 'Disk Cleaner',
    description: 'Clean up system files for the first time',
    xp: 100,
    completed: false
  },
  {
    id: 'network_master',
    title: 'Network Master',
    description: 'Optimize network settings',
    xp: 150,
    completed: false
  },
  {
    id: 'power_optimizer',
    title: 'Power Optimizer',
    description: 'Configure power settings',
    xp: 120,
    completed: false
  },
  {
    id: 'system_guardian',
    title: 'System Guardian',
    description: 'Run system file check',
    xp: 200,
    completed: false
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

const XP_PER_LEVEL = 100;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [maxXp, setMaxXp] = useState(1000);
  const [userAchievements, setUserAchievements] = useState(achievements);

  const addXp = (amount: number) => {
    console.log(`[DEBUG] Adding ${amount} XP`);
    setXp((current) => {
      const newXp = current + amount;
      if (newXp >= maxXp) {
        const remainingXp = newXp - maxXp;
        setLevel((lvl) => {
          const newLevel = lvl + 1;
          console.log(`[DEBUG] Level up! ${lvl} -> ${newLevel}`);
          toast.success(`Level Up! You are now level ${newLevel}! 🎉`, {
            duration: 5000,
          });
          return newLevel;
        });
        setMaxXp((current) => Math.floor(current * 1.5));
        return remainingXp;
      }
      return newXp;
    });
  };

  const completeAchievement = (id: string) => {
    console.log(`[DEBUG] Completing achievement: ${id}`);
    setUserAchievements((current) =>
      current.map((achievement) => {
        if (achievement.id === id && !achievement.completed) {
          toast.success(`Achievement Unlocked: ${achievement.title}! 🏆`, {
            duration: 5000,
          });
          addXp(achievement.xp);
          return { ...achievement, completed: true };
        }
        return achievement;
      })
    );
  };

  const value = {
    level,
    xp,
    maxXp,
    achievements: userAchievements,
    addXp,
    completeAchievement,
  };

  console.log('[DEBUG] Game Context State:', value);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
