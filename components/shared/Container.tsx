import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "main";
}

export function Container({
  className,
  as: Tag = "div",
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
