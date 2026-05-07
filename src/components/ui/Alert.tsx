'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui";

const alertVariants = cva(
  "p-3 rounded-lg border text-[11px] leading-snug space-y-1 transition-all",
  {
    variants: {
      variant: {
        info: "bg-blue-400/10 border-blue-400/20 text-blue-300",
        warning: "bg-amber-400/10 border-amber-400/20 text-amber-200/80",
        error: "bg-red-400/10 border-red-400/20 text-red-300",
        success: "bg-green-400/10 border-green-400/20 text-green-300",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {title && (
          <Typography as="p" className="text-xs">
            {title}
          </Typography>
        )}
        <Typography as="p" emphasis="medium" className="text-xs">
          {children}
        </Typography>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };
