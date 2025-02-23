
import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  timestamp: string;
  value: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  title: string;
  description?: string;
  className?: string;
}

const PerformanceChart = ({ data, title, description, className }: PerformanceChartProps) => {
  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4361EE" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4361EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                dx={-10}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-2">
                        <p className="text-sm font-medium">
                          {payload[0].payload.timestamp}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Value: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4361EE"
                strokeWidth={2}
                fill="url(#gradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceChart;
