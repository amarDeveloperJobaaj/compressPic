import type { Metadata } from "next";
import { PageTransition } from "@/components/shared/PageTransition";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Vizo Tool Terms of Service — Free, browser-based image compression.",
};

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-text-muted">Last updated: January 2026</p>

        <div className="mt-12 space-y-8 leading-relaxed text-text-secondary">
          <section>
            <h2 className="text-xl font-semibold text-text-primary">Acceptance of Terms</h2>
            <p className="mt-3">
              By using Vizo Tool, you agree to these terms of service. If you do not agree,
              please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Service Description</h2>
            <p className="mt-3">
              Vizo Tool provides a free, browser-based image compression tool. All processing
              occurs locally on your device. We do not store, transmit, or have access to your images.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Acceptable Use</h2>
            <p className="mt-3">You agree to use Vizo Tool only for lawful purposes and in accordance with these terms:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>You may use the service for personal and commercial purposes</li>
              <li>You may not use the service to compress illegal or harmful content</li>
              <li>You may not attempt to reverse-engineer or abuse the service</li>
              <li>You may not use automated scripts to overload the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Intellectual Property</h2>
            <p className="mt-3">
              Vizo Tool and its associated branding are the property of Vizo Tool. The service
              itself is provided as-is, and we retain the right to modify or discontinue it at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Limitation of Liability</h2>
            <p className="mt-3">
              Vizo Tool is provided &quot;as is&quot; without warranty of any kind. We are not liable for any
              damages arising from the use or inability to use this service. Since all processing is
              client-side, we cannot guarantee specific compression results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Changes to Terms</h2>
            <p className="mt-3">
              We reserve the right to update these terms at any time. Users will be notified of
              material changes via the website. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@vizotool.com" className="text-primary hover:underline">
                hello@vizotool.com
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
