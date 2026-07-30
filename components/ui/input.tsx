import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors",
            "file:mr-3 file:rounded-lg file:border-0 file:bg-primary-light file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary",
            "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:border-error focus-visible:ring-error/20",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
