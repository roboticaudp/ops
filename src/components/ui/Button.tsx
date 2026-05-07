import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-bold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-500",
        secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100",
        outline: "border border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
        danger: "bg-red-600 text-white hover:bg-red-500",
        ghost: "hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-200",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5",
        lg: "px-6 py-3",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
