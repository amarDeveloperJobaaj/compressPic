import Link from "next/link";
import { ImageDown } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
          <ImageDown className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          404
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Oops, this page couldn&apos;t be compressed any further.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
        >
          Back to Home
        </Link>
      </div>
    </PageTransition>
  );
}
