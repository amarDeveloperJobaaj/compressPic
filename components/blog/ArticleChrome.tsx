"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  Bookmark,
  Check,
  Heart,
  Link2,
  MessageSquare,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Reading progress bar                                                */
/* ------------------------------------------------------------------ */

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(100, (doc.scrollTop / total) * 100) : 0);
    };
    // First paint sets the initial value via a microtask (not synchronously).
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-sky-500 to-violet-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table of contents (scroll spy)                                      */
/* ------------------------------------------------------------------ */

export interface TocItem {
  id: string;
  label: string;
  level: number;
}

export function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-border bg-surface p-4">
      <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        On this page
      </p>
      <ul className="mt-2.5 space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block rounded-lg px-2.5 py-1.5 text-[13px] leading-snug transition-colors",
                item.level === 3 && "pl-6",
                activeId === item.id
                  ? "bg-primary-light/70 font-semibold text-primary"
                  : "text-text-secondary hover:bg-primary-light/40 hover:text-primary"
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Share buttons                                                       */
/* ------------------------------------------------------------------ */

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    await copy();
  };

  const shareLinks = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`, Icon: Twitter, hover: "hover:bg-black hover:text-white" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, Icon: Facebook, hover: "hover:bg-[#1877F2] hover:text-white" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, Icon: Linkedin, hover: "hover:bg-[#0A66C2] hover:text-white" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
      >
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
      {shareLinks.map(({ label, href, Icon, hover }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all hover:-translate-y-0.5",
            hover
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all hover:-translate-y-0.5",
          copied ? "border-success/50 text-success" : "hover:text-primary"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Like + bookmark (localStorage)                                      */
/* ------------------------------------------------------------------ */

export function ArticleActions({ slug }: { slug: string }) {
  const likeKey = `vizotool-blog-like:${slug}`;
  const bookmarkKey = `vizotool-blog-bookmark:${slug}`;

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // Deferred so the state updates don't run synchronously inside the effect.
    const id = setTimeout(() => {
      const base = Math.abs(
        slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 400
      );
      setLikes(base);
      try {
        setLiked(localStorage.getItem(likeKey) === "1");
        setBookmarked(localStorage.getItem(bookmarkKey) === "1");
      } catch {
        /* private mode */
      }
    }, 0);
    return () => clearTimeout(id);
  }, [likeKey, bookmarkKey, slug]);

  const toggle = (key: string, current: boolean) => {
    const next = !current;
    try {
      localStorage.setItem(key, next ? "1" : "0");
    } catch {
      /* private mode */
    }
    return next;
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={() => {
          const next = toggle(likeKey, liked);
          setLiked(next);
          setLikes((l) => l + (next ? 1 : -1));
        }}
        aria-pressed={liked}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
          liked
            ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300"
            : "border-border bg-surface text-text-secondary hover:border-rose-500/40 hover:text-rose-500"
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-rose-500 text-rose-500")} />
        {likes.toLocaleString()}
      </button>
      <button
        type="button"
        onClick={() => {
          const next = toggle(bookmarkKey, bookmarked);
          setBookmarked(next);
        }}
        aria-pressed={bookmarked}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
          bookmarked
            ? "border-primary/40 bg-primary-light/60 text-primary"
            : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
        )}
      >
        <Bookmark className={cn("h-4 w-4", bookmarked && "fill-primary text-primary")} />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comments (localStorage demo)                                        */
/* ------------------------------------------------------------------ */

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export function CommentSection({ slug }: { slug: string }) {
  const storageKey = `vizotool-blog-comments:${slug}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Deferred so the state updates don't run synchronously inside the effect.
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) setComments(JSON.parse(raw));
      } catch {
        /* ignore */
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(id);
  }, [storageKey]);

  const persist = (next: Comment[]) => {
    setComments(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const comment: Comment = {
      id: `${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    persist([comment, ...comments]);
    setName("");
    setText("");
  };

  return (
    <section id="comments" className="scroll-mt-24">
      <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
        <MessageSquare className="h-5 w-5 text-primary" /> Comments
        <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">
          {comments.length}
        </span>
      </h2>

      <form onSubmit={submit} className="mt-4 space-y-2.5 rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            className="h-10 flex-1 rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            <Send className="h-3.5 w-3.5" /> Post comment
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts… (stored locally in your browser for this demo)"
          aria-label="Your comment"
          rows={3}
          className="w-full resize-y rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </form>

      {loaded && comments.length > 0 && (
        <ul className="mt-4 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-xs font-bold text-white">
                    {c.name.charAt(0)}
                  </span>
                  {c.name}
                </p>
                <span className="text-xs text-text-muted">
                  {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Back to top                                                         */
/* ------------------------------------------------------------------ */

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
