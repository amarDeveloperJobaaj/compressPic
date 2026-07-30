import type { Metadata } from "next";
import { Shield, Zap, Globe, Lock } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about CompressPix — the free, private, browser-based image compression tool.",
};

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "We believe your images are your data. That's why everything runs in your browser — nothing ever touches a server.",
  },
  {
    icon: Zap,
    title: "Performance Matters",
    description:
      "Built with modern web technologies to deliver fast, efficient compression without sacrificing quality.",
  },
  {
    icon: Globe,
    title: "Free for Everyone",
    description:
      "No sign-ups, no hidden costs, no usage limits. Quality image compression should be accessible to all.",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description:
      "Since no data leaves your device, there's nothing to intercept. Your privacy is inherent to our architecture.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            About CompressPix
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            CompressPix is a modern, browser-based image compression tool designed with one philosophy:
            your images should never leave your device.
          </p>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Our Mission</h2>
            <p className="leading-relaxed text-text-secondary">
              We built CompressPix to solve a simple problem: every online image compressor we found
              uploaded your images to a server. That meant your private photos, sensitive documents, and
              personal images were being stored somewhere out of your control.
            </p>
            <p className="leading-relaxed text-text-secondary">
              Our mission is to provide a fast, reliable, and completely private image compression
              experience that works entirely in your browser. No uploads. No servers. No tracking.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-text-primary">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">How It Works</h2>
            <p className="mt-4 leading-relaxed text-text-secondary">
              CompressPix uses the browser&apos;s built-in Canvas API and Web Workers to process images
              locally. When you upload an image, the compression algorithm adjusts quality settings to
              meet your target file size — all within the secure sandbox of your browser.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              This approach means zero data transfer, instant processing, and complete privacy.
              We don&apos;t see your images. We don&apos;t store your images. We can&apos;t access your images.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
