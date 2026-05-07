'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        blue: "border-blue-900/30 bg-blue-900/20 text-blue-400",
        green: "border-green-900/30 bg-green-900/20 text-green-400",
        yellow: "border-yellow-900/30 bg-yellow-900/20 text-yellow-400",
        red: "border-red-900/30 bg-red-900/20 text-red-400",
        zinc: "border-zinc-800 bg-zinc-900 text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'zinc';
}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant: variant || color }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
