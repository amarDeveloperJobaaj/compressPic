"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Called when the user clicks "Try again" — typically resets the store. */
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Error boundary for the Background Remover editor. Catches unexpected render
 * errors (e.g. an image decode race) and shows a friendly fallback instead of
 * a white screen, with a one-click recovery that resets the tool state.
 */
export class ToolErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Keep the failure visible in the console for debugging, but never crash
    // the page — the fallback UI below handles the user-facing recovery.
    console.error("Background remover crashed:", error, info.componentStack);
  }

  private handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="mx-auto mt-10 max-w-md rounded-2xl border border-error/30 bg-error-light p-8 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10">
          <AlertTriangle className="h-6 w-6 text-error" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-text-primary">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          The editor hit an unexpected error. Your images are still on your
          device — reset the tool and try again.
        </p>
        <button
          type="button"
          onClick={this.handleReset}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }
}
