import dynamic from "next/dynamic";

export const previewRegistry: Record<string, React.ComponentType> = {
  "aurora-glass": dynamic(() => import("./aurora-glass"), { ssr: false }),
  "midnight-saas": dynamic(() => import("./midnight-saas"), { ssr: false }),
  "bento-flow": dynamic(() => import("./bento-flow"), { ssr: false }),
  "neo-brutalist": dynamic(() => import("./neo-brutalist"), { ssr: false }),
  "minimal-apple": dynamic(() => import("./minimal-apple"), { ssr: false }),
  "ai-nebula": dynamic(() => import("./ai-nebula"), { ssr: false }),
  "luxury-black": dynamic(() => import("./luxury-black"), { ssr: false }),
  "gradient-orbit": dynamic(() => import("./gradient-orbit"), { ssr: false }),
  "developer-dark": dynamic(() => import("./developer-dark"), { ssr: false }),
  "3d-future": dynamic(() => import("./3d-future"), { ssr: false }),
};
