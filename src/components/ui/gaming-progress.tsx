import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm",
  {
    variants: {
      size: {
        default: "h-4",
        sm: "h-2",
        lg: "h-6"
      },
      variant: {
        default: "border border-white/10",
        neon: "border-2 border-[#4361EE] shadow-[0_0_15px_rgba(67,97,238,0.5)]",
        danger: "border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

const fillVariants = cva(
  "h-full transition-all ease-in-out duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/30 backdrop-blur-md",
        neon: "bg-gradient-to-r from-[#4361EE] to-[#8B5CF6]",
        danger: "bg-gradient-to-r from-red-500 to-orange-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface GamingProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  showValue?: boolean;
  animate?: boolean;
}

export function GamingProgress({
  value,
  max = 100,
  className,
  size,
  variant,
  showValue,
  animate = true,
  ...props
}: GamingProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(progressVariants({ size, variant }), className)}
      {...props}
    >
      <div
        className={cn(
          fillVariants({ variant }),
          animate && "animate-pulse",
          "relative"
        )}
        style={{ width: `${percentage}%` }}
      >
        {showValue && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow-lg">
            {percentage.toFixed(1)}%
          </span>
        )}
        <div className="absolute top-0 right-0 h-full w-1 bg-white/30 blur-sm" />
      </div>
    </div>
  );
}
