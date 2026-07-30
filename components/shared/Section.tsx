import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  containerProps?: Omit<React.ComponentPropsWithoutRef<typeof Container>, "children">;
}

export function Section({
  className,
  containerProps,
  as: Tag = "section",
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        className
      )}
      {...props}
    >
      <Container {...containerProps}>
        {children}
      </Container>
    </Tag>
  );
}
