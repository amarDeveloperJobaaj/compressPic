/**
 * AI Mock Interview route layout.
 *
 * Reuses the global site shell (Header, Footer, theme, MotionProvider) from
 * the root layout — no parallel design system. The landing page is indexable;
 * tool pages (setup / room / report) declare their own noindex metadata.
 */
export default function AiMockInterviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
