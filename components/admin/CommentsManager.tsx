"use client";

import {
  Check,
  CornerDownRight,
  Loader2,
  Mail,
  MessageSquare,
  Reply,
  Send,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  deleteCommentAction,
  moderateCommentAction,
  replyCommentAction,
} from "@/lib/blog/actions";
import { Capsule } from "@/components/ui/capsule";
import type { AdminComment } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AdminComment["status"], { label: string; variant: "warning" | "success" | "rose" }> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  spam: { label: "Spam", variant: "rose" },
};

export function CommentsManager({ initial }: { initial: AdminComment[] }) {
  const rows = initial;
  const [filter, setFilter] = useState<"all" | AdminComment["status"]>("all");
  const [, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(
    () => rows.filter((c) => filter === "all" || c.status === filter),
    [rows, filter]
  );

  const moderate = (id: string, status: AdminComment["status"]) => {
    setBusyId(id);
    startTransition(async () => {
      const res = await moderateCommentAction(id, status);
      if (!res.ok) setError(res.error);
      window.location.reload();
    });
  };

  const remove = (id: string) => {
    setBusyId(id);
    startTransition(async () => {
      const res = await deleteCommentAction(id);
      if (!res.ok) setError(res.error);
      window.location.reload();
    });
  };

  const reply = (id: string) => {
    if (!replyText.trim()) return;
    setBusyId(id);
    startTransition(async () => {
      const res = await replyCommentAction({ commentId: id, content: replyText.trim() });
      if (!res.ok) setError(res.error);
      setReplyingTo(null);
      setReplyText("");
      window.location.reload();
    });
  };

  const counts = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((c) => c.status === "pending").length,
      approved: rows.filter((c) => c.status === "approved").length,
      spam: rows.filter((c) => c.status === "spam").length,
    }),
    [rows]
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-error/40 bg-error-light/60 px-4 py-3 text-sm font-medium text-error">
          {error}
          <button type="button" onClick={() => setError("")} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-1">
        {(["all", "pending", "approved", "spam"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all",
              filter === s ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:text-primary"
            )}
          >
            {s} · {counts[s]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-text-muted" />
            <p className="mt-2 font-semibold text-text-primary">No comments here</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((comment) => {
              const style = STATUS_STYLES[comment.status];
              return (
                <li key={comment.id} className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-sm font-bold text-white">
                      {comment.authorName.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text-primary">
                        {comment.authorName}
                        <span className="flex items-center gap-1 text-xs font-normal text-text-muted">
                          <Mail className="h-3 w-3" /> {comment.authorEmail}
                        </span>
                      </p>
                      <p className="text-xs text-text-muted">
                        on{" "}
                        <Link href={`/admin/blogs/edit/${comment.blogId}`} className="text-primary hover:underline">
                          {comment.blogTitle}
                        </Link>{" "}
                        · {new Date(comment.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <Capsule variant={style.variant} sm glow={false}>
                      {style.label}
                    </Capsule>
                  </div>

                  <p className="mt-2.5 rounded-xl bg-background/60 px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    {comment.content}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {comment.status !== "approved" && (
                      <button
                        type="button"
                        disabled={busyId === comment.id}
                        onClick={() => moderate(comment.id, "approved")}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-success/40 bg-success-light/50 px-2.5 text-xs font-medium text-success transition-colors hover:bg-success-light disabled:opacity-50"
                      >
                        {busyId === comment.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Approve
                      </button>
                    )}
                    {comment.status === "pending" && (
                      <button
                        type="button"
                        disabled={busyId === comment.id}
                        onClick={() => moderate(comment.id, "spam")}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/10 px-2.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        <ShieldAlert className="h-3 w-3" /> Mark spam
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busyId === comment.id}
                      onClick={() => {
                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                        setReplyText("");
                      }}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
                    >
                      <Reply className="h-3 w-3" /> Reply
                    </button>
                    <button
                      type="button"
                      disabled={busyId === comment.id}
                      onClick={() => remove(comment.id)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-error/50 hover:text-error disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>

                  {replyingTo === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a public reply as the Vizo Tool team…"
                        className="h-10 flex-1 rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        disabled={busyId === comment.id}
                        onClick={() => reply(comment.id)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark disabled:opacity-50"
                      >
                        {busyId === comment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        <CornerDownRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
