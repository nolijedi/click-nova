import { CheckCircle2 } from "lucide-react";

interface Improvement {
  id: string;
  text: string;
  completed: boolean;
}

interface ImprovementsListProps {
  improvements: Improvement[];
}

export function ImprovementsList({ improvements }: ImprovementsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-purple-400">Improvements Made</h2>
      <div className="space-y-2">
        {improvements.map((improvement) => (
          <div
            key={improvement.id}
            className="flex items-center gap-3 rounded-lg bg-purple-950/50 p-4 transition-colors hover:bg-purple-950/60"
          >
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span className="text-gray-200">{improvement.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
