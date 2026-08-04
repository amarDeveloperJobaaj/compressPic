import { permanentRedirect } from "next/navigation";

/**
 * The blog listing lives at /blogs (canonical). This route is kept as a
 * permanent 301 so old links and bookmarks never 404. Articles remain at
 * /blog/[slug], categories at /blog/category/[...], tags at /blog/tag/[...].
 */
export default function BlogIndexRedirect() {
  permanentRedirect("/blogs");
}
