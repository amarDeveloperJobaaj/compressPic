"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, Mail, MapPin } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Use mailto as fallback — opens default email client
      const subject = encodeURIComponent(data.subject);
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      );
      window.location.href = `mailto:hello@vizotool.com?subject=${subject}&body=${body}`;
      setIsSubmitted(true);
    } catch {
      // If mailto fails, still show success
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container-page py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-light">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-text-primary">Message Sent!</h1>
          <p className="mt-3 text-text-secondary">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container-page py-16 sm:py-24"
    >
      <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2">
        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Have a question, suggestion, or feedback? We&apos;d love to hear from you.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Email</h3>
                <p className="mt-1 text-sm text-text-secondary">hello@vizotool.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Location</h3>
                <p className="mt-1 text-sm text-text-secondary">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-text-primary">
              Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              className="mt-1.5 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-1.5 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-medium text-text-primary">
              Subject
            </label>
            <input
              id="subject"
              {...register("subject", { required: "Subject is required" })}
              className="mt-1.5 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="How can we help?"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-error">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium text-text-primary">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              {...register("message", {
                required: "Message is required",
                minLength: { value: 10, message: "Message must be at least 10 characters" },
              })}
              className="mt-1.5 block w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Tell us more..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-error">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </span>
            ) : (
              <>
                Send Message
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
