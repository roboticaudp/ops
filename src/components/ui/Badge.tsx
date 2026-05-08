'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-bold transition-colors shrink-0",
  {
    variants: {
      variant: {
        blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        green: "border-green-500/20 bg-green-500/10 text-green-400",
        yellow: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        red: "border-red-500/20 bg-red-500/10 text-red-400",
        zinc: "border-zinc-800 bg-zinc-900 text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'zinc';
}

function Badge({ className, variant, color, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant: variant || color }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
