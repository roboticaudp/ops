import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("transition-colors", {
  variants: {
    as: {
      h1: "font-bold uppercase text-6xl md:text-8xl leading-tight tracking-tighter",
      h2: "font-semibold uppercase text-4xl md:text-5xl leading-tight tracking-tighter",
      h3: "font-medium uppercase text-2xl leading-tight tracking-tighter",
      h4: "font-medium uppercase text-xl leading-tight tracking-tighter",
      p: "text-lg leading-relaxed",
    },
    color: {
      default: "text-foreground",
      primary: "text-blue-500",
      white: "text-white",
      muted: "text-zinc-500",
    },
    emphasis: {
      full: "opacity-100",
      high: "opacity-[0.87]",
      medium: "opacity-60",
      disabled: "opacity-[0.38]",
    },
  },
  defaultVariants: {
    color: "default",
    emphasis: "high",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
  Omit<VariantProps<typeof typographyVariants>, "as" | "color" | "emphasis"> {
  as: "p" | "h1" | "h2" | "h3" | "h4";
  color?: "default" | "primary" | "white" | "muted";
  emphasis?: "full" | "high" | "medium" | "disabled";
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Tag, color, emphasis, ...props }, ref) => {
    return (
      <Tag
        className={cn(
          typographyVariants({
            as: Tag,
            color,
            emphasis,
            className,
          })
        )}
        ref={ref as any}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
