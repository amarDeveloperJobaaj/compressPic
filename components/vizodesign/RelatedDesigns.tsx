import type { Design } from "@/lib/vizodesign/types";
import { DesignCard } from "./DesignCard";

interface RelatedDesignsProps {
  designs: Design[];
}

export function RelatedDesigns({ designs }: RelatedDesignsProps) {
  if (designs.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4 -mx-6 px-6">
      <div className="flex gap-5" style={{ minWidth: "min-content" }}>
        {designs.map((design) => (
          <div key={design.id} className="w-[320px] shrink-0">
            <DesignCard design={design} />
          </div>
        ))}
      </div>
    </div>
  );
}
