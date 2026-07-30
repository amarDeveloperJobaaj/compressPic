import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]",
        secondary:
          "border border-border bg-surface text-text-secondary shadow-xs hover:border-text-muted hover:text-text-primary active:scale-[0.98]",
        ghost:
          "text-text-secondary hover:bg-primary-light hover:text-primary",
        outline:
          "border-2 border-primary/20 bg-transparent text-primary hover:border-primary hover:bg-primary-light/50",
        success:
          "bg-success text-white shadow-lg shadow-success/25 hover:bg-success/90 active:scale-[0.98]",
        danger:
          "bg-error text-white shadow-lg shadow-error/25 hover:bg-error/90 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
