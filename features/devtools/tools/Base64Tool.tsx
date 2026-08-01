"use client";

import { useMemo, useRef, useState } from "react";
import { FileUp, Type, Image as ImageIcon, Download, ArrowRight } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeTextarea } from "../components/CodeTextarea";
import { CodeOutput } from "../components/CodeOutput";
import { CopyButton } from "../components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  base64ToUtf8,
  downloadText,
  readFileAsDataUrl,
  readFileAsText,
  utf8ToBase64,
} from "../utils/download";
import { cn } from "@/lib/utils";

type Mode = "text" | "file" | "image";

interface Base64ToolProps {
  direction: "encode" | "decode";
}

export function Base64Tool({ direction }: Base64ToolProps) {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isEncode = direction === "encode";

  const result = useMemo(() => {
    if (mode !== "text" || !text) return "";
    try {
      return isEncode ? utf8ToBase64(text) : base64ToUtf8(text);
    } catch {
      return "";
    }
  }, [mode, text, isEncode]);

  const handleFile = async (file: File) => {
    setFileInfo(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    setError(null);
    if (mode === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        setImageSrc(null);
        return;
      }
      const dataUrl = await readFileAsDataUrl(file);
      setImageSrc(dataUrl);
      if (isEncode) {
        setOutput(dataUrl.split(",")[1] ?? "");
      } else {
        // Decode: show the data URL directly
        setOutput(dataUrl);
      }
    } else {
      if (isEncode) {
        const textContent = await readFileAsText(file);
        setOutput(utf8ToBase64(textContent));
      } else {
        const dataUrl = await readFileAsDataUrl(file);
        setOutput(dataUrl);
      }
    }
  };

  const handleDecodeText = () => {
    if (mode !== "text") return;
    try {
      setError(null);
      setOutput(base64ToUtf8(text));
    } catch {
      setError("Invalid Base64 input. Check for missing characters or padding.");
    }
  };

  const previewImage = useMemo(() => {
    if (!output) return null;
    // If output looks like a data URL, render it; else try decoding as base64 image
    if (output.startsWith("data:")) return output;
    if (!isEncode && mode === "text") {
      try {
        const binary = atob(output.trim());
        if (binary.length < 4) return null;
        // Detect PNG/JPEG magic bytes
        const first = binary.charCodeAt(0);
        const second = binary.charCodeAt(1);
        if (first === 0x89 && second === 0x50) return `data:image/png;base64,${output.trim()}`;
        if (first === 0xff && second === 0xd8) return `data:image/jpeg;base64,${output.trim()}`;
      } catch {
        return null;
      }
    }
    return null;
  }, [output, isEncode, mode]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel title={isEncode ? "Input" : "Base64 Input"}>
        {/* Mode tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              { key: "text", label: "Text", icon: Type },
              { key: "file", label: "File", icon: FileUp },
              { key: "image", label: "Image", icon: ImageIcon },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                setOutput("");
                setError(null);
                setImageSrc(null);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-[0.97]",
                mode === key
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {mode === "text" && (
          <CodeTextarea
            value={text}
            onChange={setText}
            rows={12}
            ariaLabel={isEncode ? "Text to encode" : "Base64 to decode"}
            placeholder={isEncode ? "Type or paste text to encode…" : "Paste a Base64 string…"}
          />
        )}

        {mode !== "text" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept={mode === "image" ? "image/*" : undefined}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary-light/30"
            >
              {mode === "image" ? <ImageIcon className="h-8 w-8 text-primary" /> : <FileUp className="h-8 w-8 text-primary" />}
              <span className="text-sm font-medium text-text-primary">
                {isEncode ? `Choose a ${mode} to encode` : `Choose a ${mode} to decode`}
              </span>
              <span className="text-xs text-text-muted">Click to browse</span>
            </button>
            {fileInfo && <p className="mt-2 text-xs text-text-muted">{fileInfo}</p>}
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc} alt="Preview" className="mt-3 max-h-48 rounded-xl border border-border object-contain" />
            )}
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {isEncode && mode === "text" && text && (
          <Button size="sm" className="mt-4" onClick={() => setOutput(utf8ToBase64(text))}>
            Encode
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
        {!isEncode && mode === "text" && text && (
          <Button size="sm" className="mt-4" onClick={handleDecodeText}>
            Decode
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </ToolPanel>

      <ToolPanel
        title={isEncode ? "Base64 Output" : "Decoded Output"}
        actions={
          <>
            <CopyButton text={output} disabled={!output} />
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  downloadText(
                    isEncode ? "encoded.txt" : "decoded.txt",
                    output,
                    "text/plain;charset=utf-8"
                  )
                }
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            )}
          </>
        }
      >
        {mode === "text" ? (
          <CodeOutput
            text={output}
            placeholder="Result appears here…"
            title={isEncode ? "Base64 Output" : "Decoded Output"}
            filename={isEncode ? "encoded.txt" : "decoded.txt"}
            ariaLabel="Result"
          />
        ) : (
          <div className="min-h-[180px]">
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewImage} alt="Decoded preview" className="max-h-72 rounded-xl border border-border object-contain" />
            ) : output ? (
              <CodeOutput text={output} title="Output" previewClass="max-h-72" ariaLabel="Result" />
            ) : (
              <p className="text-sm text-text-muted">Output appears here.</p>
            )}
          </div>
        )}

        {output && mode === "text" && (
          <p className="mt-3 text-xs text-text-muted">
            {result ? new Blob([result]).size.toLocaleString() : output.length.toLocaleString()} characters ·{" "}
            {output.length.toLocaleString()} output chars
          </p>
        )}
      </ToolPanel>
    </div>
  );
}
