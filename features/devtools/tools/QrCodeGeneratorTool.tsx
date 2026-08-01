"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Download, FileUp } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { Slider } from "../components/controls";
import { cn } from "@/lib/utils";

type ContentType = "url" | "text" | "wifi" | "email" | "phone" | "sms" | "whatsapp" | "upi";

interface WifiFields {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

const DEFAULT_FIELDS: Record<string, string> = {
  url: "https://compresspix.com",
  text: "Hello from CompressPix!",
  email: "hello@compresspix.com",
  phone: "+15551234567",
  sms: "+15551234567",
  whatsapp: "15551234567",
  upi: "yourname@upi",
};

function buildPayload(type: ContentType, fields: Record<string, string>, wifi: WifiFields): string {
  switch (type) {
    case "url":
      return fields.url || "https://";
    case "text":
      return fields.text || "";
    case "wifi":
      return `WIFI:T:${wifi.security};S:${wifi.ssid};P:${wifi.password};${wifi.hidden ? "H:true;" : ""};`;
    case "email": {
      const [email, subject = "", body = ""] = fields.email.split("|");
      return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    case "phone":
      return `tel:${fields.phone}`;
    case "sms":
      return `SMSTO:${fields.sms}:${fields.smsBody ?? ""}`;
    case "whatsapp":
      return `https://wa.me/${fields.whatsapp.replace(/\D/g, "")}`;
    case "upi": {
      const [upi, name = "", amount = "", note = ""] = fields.upi.split("|");
      const params = new URLSearchParams();
      params.set("pa", upi);
      if (name) params.set("pn", name);
      if (amount) params.set("am", amount);
      if (note) params.set("tn", note);
      params.set("cu", "INR");
      return `upi://pay?${params.toString()}`;
    }
  }
}

export function QrCodeGeneratorTool() {
  const [type, setType] = useState<ContentType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ ...DEFAULT_FIELDS });
  const [wifi, setWifi] = useState<WifiFields>({ ssid: "MyNetwork", password: "", security: "WPA", hidden: false });
  const [dark, setDark] = useState("#111827");
  const [light, setLight] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [logo, setLogo] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const payload = useMemo(() => buildPayload(type, fields, wifi), [type, fields, wifi]);

  // Render QR to canvas with colors and optional centered logo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    QRCode.toCanvas(canvas, payload || " ", {
      width: size,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark, light },
    })
      .then(() => {
        if (cancelled) return;
        setQrError(null);
        if (!logo) return;
        // Overlay the logo in the center
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const logoSize = size * 0.22;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;
        const img = new Image();
        img.onload = () => {
          if (cancelled) return;
          // White padding behind logo for scannability
          ctx.fillStyle = light;
          ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
          ctx.drawImage(img, x, y, logoSize, logoSize);
        };
        img.src = logo;
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setQrError(
            err instanceof Error ? err.message : "Failed to generate the QR code."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [payload, size, dark, light, logo]);

  const setField = (key: string, value: string) => setFields((f) => ({ ...f, [key]: value }));

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };

  const downloadSvg = async () => {
    const svg = await QRCode.toString(payload || " ", {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark, light },
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const doc = new jsPDF({ unit: "px", format: [size + 40, size + 40] });
    doc.addImage(dataUrl, "PNG", 20, 20, size, size);
    doc.save("qr-code.pdf");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <ToolPanel title="Content">
        {/* Type selector */}
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              { key: "url", label: "URL" },
              { key: "text", label: "Text" },
              { key: "wifi", label: "WiFi" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "sms", label: "SMS" },
              { key: "whatsapp", label: "WhatsApp" },
              { key: "upi", label: "UPI" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-medium transition-all active:scale-[0.97]",
                type === key
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Fields per type */}
        <div className="space-y-3">
          {type === "url" && (
            <Field label="URL" value={fields.url ?? ""} onChange={(v) => setField("url", v)} placeholder="https://example.com" />
          )}
          {type === "text" && (
            <Field label="Text" value={fields.text ?? ""} onChange={(v) => setField("text", v)} placeholder="Enter any text…" />
          )}
          {type === "wifi" && (
            <>
              <Field label="Network name (SSID)" value={wifi.ssid} onChange={(v) => setWifi((w) => ({ ...w, ssid: v }))} />
              <Field label="Password" value={wifi.password} onChange={(v) => setWifi((w) => ({ ...w, password: v }))} />
              <div className="flex flex-wrap gap-2">
                {(["WPA", "WEP", "nopass"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setWifi((w) => ({ ...w, security: s }))}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      wifi.security === s
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background text-text-secondary"
                    )}
                  >
                    {s === "nopass" ? "Open" : s}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={wifi.hidden}
                  onChange={(e) => setWifi((w) => ({ ...w, hidden: e.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Hidden network
              </label>
            </>
          )}
          {type === "email" && (
            <Field
              label="Email | Subject | Body (use | to separate)"
              value={fields.email ?? ""}
              onChange={(v) => setField("email", v)}
              placeholder="user@example.com|Subject|Body"
            />
          )}
          {type === "phone" && (
            <Field label="Phone number" value={fields.phone ?? ""} onChange={(v) => setField("phone", v)} placeholder="+15551234567" />
          )}
          {type === "sms" && (
            <>
              <Field label="Phone number" value={fields.sms ?? ""} onChange={(v) => setField("sms", v)} placeholder="+15551234567" />
              <Field label="Message (optional)" value={fields.smsBody ?? ""} onChange={(v) => setField("smsBody", v)} placeholder="Hi! Scan this…" />
            </>
          )}
          {type === "whatsapp" && (
            <Field label="WhatsApp number" value={fields.whatsapp ?? ""} onChange={(v) => setField("whatsapp", v)} placeholder="15551234567" />
          )}
          {type === "upi" && (
            <Field
              label="UPI ID | Name | Amount | Note (use | to separate)"
              value={fields.upi ?? ""}
              onChange={(v) => setField("upi", v)}
              placeholder="yourname@upi|Your Name|100|Thank you"
            />
          )}
        </div>

        {/* Appearance */}
        <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Foreground</span>
            <input
              type="color"
              value={dark}
              onChange={(e) => setDark(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-border bg-background"
              aria-label="QR foreground color"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Background</span>
            <input
              type="color"
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-border bg-background"
              aria-label="QR background color"
            />
          </div>
          <div className="sm:col-span-2">
            <Slider label="Size" value={size} min={128} max={1024} step={32} onChange={setSize} suffix=" px" />
          </div>
        </div>

        {/* Logo */}
        <div className="mt-5 border-t border-border pt-5">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setLogo(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <FileUp className="h-3.5 w-3.5" />
              {logo ? "Change logo" : "Add logo"}
            </button>
            {logo && (
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="text-xs font-medium text-error transition-colors hover:underline"
              >
                Remove logo
              </button>
            )}
          </div>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo" className="mt-3 h-12 w-12 rounded-lg border border-border object-contain" />
          )}
        </div>
      </ToolPanel>

      {/* Preview */}
      <ToolPanel title="Preview" description="Live QR code — scan it with any phone.">
        <div className="flex items-center justify-center rounded-xl border border-border bg-background p-6">
          <canvas ref={canvasRef} className="h-auto max-w-full rounded-lg" aria-label="QR code preview" />
        </div>
        {qrError && (
          <p className="mt-3 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error" role="alert">
            {qrError}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadPng}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.97]"
          >
            <Download className="h-4 w-4" />
            PNG
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Download className="h-4 w-4" />
            SVG
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
        <p className="mt-4 break-all rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-text-muted">
          {payload}
        </p>
      </ToolPanel>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text-primary">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      />
    </label>
  );
}
