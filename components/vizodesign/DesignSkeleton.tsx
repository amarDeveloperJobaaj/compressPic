import { cn } from "@/lib/utils";

interface DesignSkeletonProps {
  className?: string;
}

export function DesignSkeleton({ className }: DesignSkeletonProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface overflow-hidden animate-pulse", className)}>
      <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
