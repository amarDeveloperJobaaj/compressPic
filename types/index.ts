export interface CompressionState {
  originalFile: File | null;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressionRatio: number;
  isCompressing: boolean;
  progress: number;
  error: string | null;
  targetSize: number | "custom";
  customTargetSize: number | null;
}

export interface CompressionOptions {
  maxSizeMB: number;
  useWebWorker: boolean;
  maxIteration?: number;
  onProgress?: (progress: number) => void;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
