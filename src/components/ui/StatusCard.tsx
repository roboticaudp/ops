'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const statusCardVariants = cva(
  "flex items-center gap-3 p-4 rounded-xl border transition-all",
  {
    variants: {
      variant: {
        red: "bg-red-950/20 border-red-900/30 [--icon:text-red-400] [--value:text-red-300] [--label:text-red-600]",
        amber: "bg-amber-950/20 border-amber-900/30 [--icon:text-amber-400] [--value:text-amber-300] [--label:text-amber-600]",
        zinc: "bg-zinc-900/40 border-zinc-800 [--icon:text-zinc-400] [--value:text-zinc-300] [--label:text-zinc-600]",
      },
    },
    defaultVariants: {
      variant: "zinc",
    },
  }
);

const getColorClass = (variant: string | null | undefined, type: 'icon' | 'value' | 'label') => {
  const colors = {
    red: { icon: 'text-red-400', value: 'text-red-300', label: 'text-red-600' },
    amber: { icon: 'text-amber-400', value: 'text-amber-300', label: 'text-amber-600' },
    zinc: { icon: 'text-zinc-400', value: 'text-zinc-300', label: 'text-zinc-600' },
  };
  const v = variant as 'red' | 'amber' | 'zinc' || 'zinc';
  return colors[v][type];
};

export interface StatusCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof statusCardVariants> {
  icon?: LucideIcon;
}

const StatusCardContext = React.createContext<{ variant?: string | null }>({});

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ className, variant, icon: Icon, children, ...props }, ref) => {
    return (
      <StatusCardContext.Provider value={{ variant }}>
        <div
          ref={ref}
          className={cn(statusCardVariants({ variant }), className)}
          {...props}
        >
          {Icon && <Icon size={18} className={cn("shrink-0", getColorClass(variant, 'icon'))} />}
          <div>
            {children}
          </div>
        </div>
      </StatusCardContext.Provider>
    );
  }
);
StatusCard.displayName = "StatusCard";

const StatusCardValue = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { variant } = React.useContext(StatusCardContext);
  return (
    <p
      className={cn("text-xl font-bold leading-none", getColorClass(variant, 'value'), className)}
      {...props}
    />
  );
};
StatusCardValue.displayName = "StatusCardValue";

const StatusCardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { variant } = React.useContext(StatusCardContext);
  return (
    <p
      className={cn("text-[10px] font-medium mt-1", getColorClass(variant, 'label'), className)}
      {...props}
    />
  );
};
StatusCardDescription.displayName = "StatusCardDescription";

export { StatusCard, StatusCardValue, StatusCardDescription, statusCardVariants };
