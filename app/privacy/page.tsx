import type { Metadata } from "next";
import { PageTransition } from "@/components/shared/PageTransition";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CompressPix Privacy Policy — Your images never leave your device.",
};

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-text-muted">Last updated: January 2026</p>

        <div className="mt-12 space-y-8 leading-relaxed text-text-secondary">
          <section>
            <h2 className="text-xl font-semibold text-text-primary">Our Commitment to Privacy</h2>
            <p className="mt-3">
              At CompressPix, we take your privacy seriously. Our service is built around a
              fundamental principle: your images should never leave your device. This document
              outlines our privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Data Collection</h2>
            <p className="mt-3">
              CompressPix is designed to operate without collecting any personal data or images.
              Since all image processing happens locally in your browser:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>We do not upload your images to any server</li>
              <li>We do not store your images</li>
              <li>We do not have access to your images</li>
              <li>We do not require user accounts or registration</li>
              <li>We do not use cookies for tracking purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Analytics</h2>
            <p className="mt-3">
              We may use basic analytics to understand aggregate usage patterns (e.g., page views,
              browser types). This data is anonymized and cannot be used to identify individual
              users. No image data is ever included in analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Third-Party Services</h2>
            <p className="mt-3">
              CompressPix does not integrate with any third-party services that would have access
              to your images. The entire compression process runs locally within your browser using
              web standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Contact</h2>
            <p className="mt-3">
              If you have questions about this privacy policy, please contact us at{" "}
              <a href="mailto:hello@compresspix.com" className="text-primary hover:underline">
                hello@compresspix.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
