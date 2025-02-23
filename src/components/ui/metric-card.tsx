
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

const MetricCard = ({
  title,
  value,
  description,
  icon,
  className,
  trend,
}: MetricCardProps) => {
  return (
    <Card className={cn("p-6 animate-fadeIn", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <span
            className={cn("text-sm font-medium", {
              "text-success-500": trend === "up",
              "text-destructive": trend === "down",
              "text-muted-foreground": trend === "neutral",
            })}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </Card>
  );
};

export default MetricCard;
