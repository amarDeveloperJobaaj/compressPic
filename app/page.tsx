"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ImageDown, Shield, Zap, Download, Crop } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Compress and resize images in milliseconds. All processing happens instantly in your browser.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Your images never leave your device. No uploads, no servers, no tracking.",
  },
  {
    icon: Crop,
    title: "Crop & Resize",
    description: "Crop to passport, document, or social media sizes. Over 20 preset ratios to choose from.",
  },
  {
    icon: Download,
    title: "Free & Unlimited",
    description: "No sign-ups, no limits, no hidden costs. Compress, crop, and resize as much as you want.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload Image",
    description: "Drag & drop, click to upload, or paste an image from your clipboard.",
  },
  {
    number: "02",
    title: "Choose Size",
    description: "Select a target size — 50KB, 100KB, 200KB, or enter a custom value.",
  },
  {
    number: "03",
    title: "Download",
    description: "Your compressed image is ready instantly. Download it with one click.",
  },
];

const faqs = [
  {
    question: "How does CompressPix work?",
    answer:
      "CompressPix uses advanced browser-based image processing technology. Your images are processed entirely within your browser using the Canvas API — nothing is ever uploaded to any server.",
  },
  {
    question: "What is the Resize &amp; Crop tool?",
    answer:
      "The Resize &amp; Crop tool lets you crop your images to any shape or size. Choose from over 20 prebuilt ratios including passport photo sizes (2×2), document formats (A4, Letter), social media dimensions (Instagram, Twitter, Facebook, YouTube), and common aspect ratios (16:9, 4:3, 1:1). You can also set a custom ratio and fine-tune the crop area by dragging.",
  },
  {
    question: "What output formats are supported for cropping?",
    answer:
      "You can download your cropped image as PNG (lossless), JPEG, or WEBP. For JPEG and WEBP, you can also adjust the quality slider to balance file size and image quality.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. All image processing happens locally on your device. Your images never leave your computer, ensuring complete privacy and security.",
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPG, JPEG, PNG, and WEBP formats. You can compress to any target size from 1KB upwards.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "There's no artificial limit, but very large images may take a moment to process since everything runs in your browser. For best results, keep images under 50MB.",
  },
  {
    question: "Is CompressPix really free?",
    answer:
      "Yes! CompressPix is completely free with no hidden costs, no sign-ups, and no usage limits. We believe image compression should be accessible to everyone.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes! CompressPix is fully responsive and works perfectly on desktop, tablet, and mobile devices.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light/50 via-background to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-16 text-center sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-secondary shadow-xs">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-success" />
              100% Browser-Based — No Uploads
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Edit Images
              <br />
              <span className="text-primary">Instantly & Free</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-text-secondary sm:text-xl">
              Compress, resize, and crop your images to perfection — all directly in your browser.
              Your images never leave your device.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/compress"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                <ImageDown className="h-4 w-4" />
                Compress Images
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/resize"
                className="group inline-flex h-12 items-center gap-2 rounded-xl border-2 border-primary/20 bg-surface px-6 text-sm font-semibold text-primary shadow-xs transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
              >
                <Crop className="h-4 w-4" />
                Resize & Crop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Tool cards illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2"
          >
            {/* Compress card */}
            <Link
              href="/compress"
              className="group rounded-2xl border border-border bg-surface p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light group-hover:bg-primary transition-colors">
                  <Download className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">Compress Images</p>
                  <p className="text-xs text-text-muted">Reduce file size instantly</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-background p-3">
                <span className="text-xs text-text-secondary">2.4 MB → 350 KB</span>
                <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-medium text-success">-85%</span>
              </div>
            </Link>

            {/* Resize card */}
            <Link
              href="/resize"
              className="group rounded-2xl border border-border bg-surface p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light group-hover:bg-primary transition-colors">
                  <Crop className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">Resize & Crop</p>
                  <p className="text-xs text-text-muted">Perfect dimensions every time</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-background p-3">
                <span className="text-xs text-text-secondary">Passport, A4, Social media...</span>
                <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">20+ presets</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Why Choose CompressPix?
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Everything you need for fast, private image compression.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Compress */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Compress Images
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Three simple steps to reduce your file sizes.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/compress"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              <ImageDown className="h-4 w-4" />
              Start Compressing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works — Resize */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <Crop className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Resize &amp; Crop Images
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Choose from prebuilt sizes or create your own custom dimensions.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Upload Image",
                description: "Drag & drop, click to upload, or paste an image from your clipboard.",
              },
              {
                number: "02",
                title: "Choose a Preset",
                description: "Pick from passport, document, social media sizes, or set a custom aspect ratio.",
              },
              {
                number: "03",
                title: "Crop & Download",
                description: "Fine-tune your crop area, adjust output quality, and download in PNG, JPEG, or WEBP.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Preset badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mx-auto mt-10 max-w-2xl text-center"
          >
            <p className="text-sm font-medium text-text-secondary mb-4">
              Prebuilt sizes for every need
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Passport (2×2)", color: "bg-success-light text-success" },
                { label: "A4 Document", color: "bg-primary-light text-primary" },
                { label: "Instagram Square", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
                { label: "Twitter Header", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
                { label: "YouTube Thumbnail", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
                { label: "16:9 Widescreen", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badge.color}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="mt-10 text-center">
            <Link
              href="/resize"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              <Crop className="h-4 w-4" />
              Start Resizing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Got questions? We&apos;ve got answers.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-text-muted"
              >
                <summary className="flex items-center justify-between px-6 py-4 text-sm font-medium text-text-primary">
                  {faq.question}
                  <span className="ml-4 shrink-0 text-text-muted transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-border px-6 py-4">
                  <p className="text-sm leading-relaxed text-text-secondary">{faq.answer}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
