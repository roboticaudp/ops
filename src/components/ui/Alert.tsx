'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Typography, type TypographyProps } from "@/components/ui";

const alertVariants = cva(
  "px-3 py-2 rounded-lg border text-xs transition-all w-full",
  {
    variants: {
      variant: {
        info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        error: "bg-red-500/10 border-red-500/20 text-red-400",
        success: "bg-green-500/10 border-green-500/20 text-green-400",
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
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {title && (
          <AlertTitle>{title}</AlertTitle>
        )}
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography
      ref={ref as any}
      as="p"
      emphasis="full"
      className={cn("text-xs font-bold mb-1", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref as any}
      className={cn("text-xs [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
