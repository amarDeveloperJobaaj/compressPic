import "server-only";

import { randomUUID } from "node:crypto";
import path from "node:path";

import { createAdminClient } from "./admin";

/**
 * Blog storage helpers (Supabase Storage).
 *
 * Buckets (created by supabase/storage.sql):
 *   - blog-images   : cover images + inline content images (up to 50 MB)
 *   - author-images : author avatars (up to 5 MB)
 *
 * All uploads run through the service-role client (server-only). Public reads
 * work directly via the bucket's public URL — no auth required on the client.
 */

export const BLOG_IMAGES_BUCKET = "blog-images";
export const AUTHOR_IMAGES_BUCKET = "author-images";
/** AI interview resume PDFs — private bucket, server-only access (§32). */
export const RESUMES_BUCKET = "resumes";

export const STORAGE_BUCKETS = [BLOG_IMAGES_BUCKET, AUTHOR_IMAGES_BUCKET] as const;

/** Allowed mime types — mirrors supabase/storage.sql. */
const BLOG_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];
const AUTHOR_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const RESUME_MIME_TYPES = ["application/pdf"];

/** Client-side resume cap — mirrored on the server (see uploadResume). */
export const MAX_RESUME_SIZE = 10 * 1024 * 1024;

export interface StorageUploadResult {
  path: string;
  url: string;
  size: number;
}

export type UploadableFile =
  | { buffer: Uint8Array | ArrayBuffer; contentType: string; fileName: string; size?: number }
  | Blob;

/** Sanitize a file name to a safe storage key (lowercase, no slashes/spaces). */
export function buildStoragePath(prefix: string, fileName: string): string {
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = path
    .basename(fileName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${prefix}/${Date.now()}-${randomUUID()}-${base || "image"}${ext}`;
}

async function normalizeUpload(file: UploadableFile): Promise<{
  data: ArrayBuffer | Uint8Array;
  contentType: string;
  fileName: string;
  size: number;
}> {
  if (file instanceof Blob) {
    const name = (file as File).name || "image.png";
    return {
      data: await file.arrayBuffer(),
      contentType: file.type || "application/octet-stream",
      fileName: name,
      size: file.size,
    };
  }
  return {
    data: file.buffer,
    contentType: file.contentType,
    fileName: file.fileName,
    size: file.size ?? (file.buffer as ArrayBuffer).byteLength ?? 0,
  };
}

/**
 * Upload an image into a blog bucket. Returns the storage path and public URL.
 * Throws on disallowed mime types (defense in depth — buckets also enforce it).
 */
export async function uploadImage(
  bucket: (typeof STORAGE_BUCKETS)[number],
  file: UploadableFile,
  prefix = "uploads"
): Promise<StorageUploadResult> {
  const allowed = bucket === AUTHOR_IMAGES_BUCKET ? AUTHOR_MIME_TYPES : BLOG_MIME_TYPES;
  const { data, contentType, fileName, size } = await normalizeUpload(file);

  if (!allowed.includes(contentType)) {
    throw new Error(`Unsupported image type "${contentType}" for bucket "${bucket}".`);
  }

  const admin = createAdminClient();
  const storagePath = buildStoragePath(prefix, fileName);

  const { error } = await admin.storage
    .from(bucket)
    .upload(storagePath, data, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return {
    path: storagePath,
    url: getPublicUrl(bucket, storagePath),
    size,
  };
}

/** Convenience wrapper for blog covers / inline images. */
export function uploadBlogImage(file: UploadableFile, prefix = "blog"): Promise<StorageUploadResult> {
  return uploadImage(BLOG_IMAGES_BUCKET, file, prefix);
}

/** Convenience wrapper for author avatars. */
export function uploadAuthorImage(file: UploadableFile, prefix = "authors"): Promise<StorageUploadResult> {
  return uploadImage(AUTHOR_IMAGES_BUCKET, file, prefix);
}

/**
 * Upload a resume PDF into the private `resumes` bucket (max 10 MB, PDF only).
 * The file is stored server-side; the browser never gets a public URL for it
 * (private bucket — reads go through the server for analysis).
 */
export async function uploadResume(
  file: UploadableFile,
  prefix = "resumes"
): Promise<StorageUploadResult> {
  const { data, contentType, fileName, size } = await normalizeUpload(file);

  if (!RESUME_MIME_TYPES.includes(contentType)) {
    throw new Error(`Unsupported resume type "${contentType}" — PDF only.`);
  }
  if (size > MAX_RESUME_SIZE) {
    throw new Error("Resume exceeds the 10 MB limit.");
  }

  const admin = createAdminClient();
  const storagePath = buildStoragePath(prefix, fileName);

  const { error } = await admin.storage.from(RESUMES_BUCKET).upload(storagePath, data, {
    contentType,
    upsert: false,
  });

  if (error) throw new Error(`Resume upload failed: ${error.message}`);

  return { path: storagePath, url: storagePath, size };
}

/** Read a stored resume back as a Buffer (server-only — private bucket). */
export async function downloadResume(storagePath: string): Promise<Buffer> {
  const { data, error } = await createAdminClient()
    .storage.from(RESUMES_BUCKET)
    .download(storagePath);
  if (error) throw new Error(`Resume download failed: ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

/** Public HTTPS URL for a stored object (public buckets — works client-side). */
export function getPublicUrl(bucket: string, storagePath: string): string {
  return createAdminClient().storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

/** Delete one object; no-op when the path is empty. */
export async function deleteImage(bucket: string, storagePath: string): Promise<void> {
  if (!storagePath) return;
  const { error } = await createAdminClient().storage.from(bucket).remove([storagePath]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}

export function deleteBlogImage(storagePath: string): Promise<void> {
  return deleteImage(BLOG_IMAGES_BUCKET, storagePath);
}

export function deleteAuthorImage(storagePath: string): Promise<void> {
  return deleteImage(AUTHOR_IMAGES_BUCKET, storagePath);
}
