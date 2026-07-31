import type { ConversionPair } from "@/features/converter/utils/pairs";

export interface Faq {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface ToolSeoContent {
  /** H2 intro heading + paragraphs shown on the tool page */
  intro: { heading: string; paragraphs: string[] };
  /** Benefits section */
  benefits: { title: string; description: string }[];
  /** Features list */
  features: { title: string; description: string }[];
  /** How-to section (also emitted as HowTo JSON-LD) */
  howTo: { heading: string; description: string; steps: HowToStep[] };
  /** FAQ section (also emitted as FAQPage JSON-LD) */
  faqs: Faq[];
}

export const TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  compress: {
    intro: {
      heading: "Compress Image Online — Free & Private",
      paragraphs: [
        "CompressPix's image compressor shrinks JPG, PNG, WEBP, AVIF, and HEIC photos right in your browser — no uploads, no servers, no watermarks. Just pick a target size like 50 KB, 100 KB, or 200 KB, and download a smaller file in seconds.",
        "Because everything runs locally on your device, your images never leave your computer. It's the fastest, safest way to reduce file size for email, websites, or app uploads.",
      ],
    },
    benefits: [
      {
        title: "100% Private",
        description: "Files are processed in your browser and never uploaded to a server.",
      },
      {
        title: "Exact Target Sizes",
        description: "Compress to 50 KB, 100 KB, 200 KB, or any custom size you need.",
      },
      {
        title: "No Quality Sliders Needed",
        description: "The smart algorithm finds the best balance of quality and size automatically.",
      },
      {
        title: "Free & Unlimited",
        description: "No sign-ups, no watermarks, no daily limits — compress as much as you want.",
      },
    ],
    features: [
      {
        title: "Target Size Presets",
        description: "One-click presets for the most common limits: 50 KB, 100 KB, and 200 KB.",
      },
      {
        title: "Custom Target Size",
        description: "Enter any value from 1 KB upwards for full control over the output size.",
      },
      {
        title: "Multiple Formats",
        description: "Works with JPG, PNG, WEBP, AVIF, and HEIC (iPhone) images.",
      },
      {
        title: "Live Progress & Preview",
        description: "Watch compression progress in real time and preview the result side by side.",
      },
    ],
    howTo: {
      heading: "How to Compress an Image",
      description: "Reduce any image to your target size in three simple steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, click to browse, or paste an image from your clipboard.",
        },
        {
          name: "Choose a target size",
          text: "Pick 50 KB, 100 KB, 200 KB, or enter a custom size in kilobytes.",
        },
        {
          name: "Download the result",
          text: "Your compressed image is ready instantly — download it with one click.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I compress an image online?",
        answer:
          "Upload your image, choose a target size (50 KB, 100 KB, 200 KB, or custom), and download the compressed result. Everything happens instantly in your browser.",
      },
      {
        question: "Is CompressPix free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All processing happens locally in your browser using the Canvas API — your images never leave your device.",
      },
      {
        question: "Can I compress an image to exactly 50 KB?",
        answer:
          "Yes. Choose the 50 KB preset or enter any custom target size, and the algorithm adjusts quality to get as close as possible.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "JPG, JPEG, PNG, WEBP, AVIF, and HEIC/HEIF (iPhone) files are all supported.",
      },
      {
        question: "Will I lose image quality?",
        answer:
          "Compression reduces file size by optimizing encoding. The tool targets a precise size while preserving the best visual quality possible for that size.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "There's no artificial limit, but very large images (over 50 MB) may take a moment to process since everything runs locally.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, the tool is fully responsive and works perfectly on desktop, tablet, and mobile browsers.",
      },
      {
        question: "Why is my image not getting smaller?",
        answer:
          "If the target size is close to or larger than the original, the output may stay similar in size. Try a smaller target or a JPEG output.",
      },
    ],
  },

  resize: {
    intro: {
      heading: "Resize & Crop Image Online — Passport, A4, Social Media",
      paragraphs: [
        "The Resize & Crop tool lets you crop any image to a precise shape and size with over 20 prebuilt ratios — passport photos, A4 documents, Instagram posts, YouTube thumbnails, and more. Everything runs in your browser.",
        "Drag to adjust the crop area, pick an output dimension, and download your perfectly sized image as PNG, JPEG, or WEBP in one click.",
      ],
    },
    benefits: [
      {
        title: "20+ Prebuilt Ratios",
        description: "Passport, ID, A4, Letter, Instagram, Twitter, Facebook, YouTube, and more.",
      },
      {
        title: "Custom Crop Control",
        description: "Drag the crop window to any position and fine-tune the exact area.",
      },
      {
        title: "Exact Output Dimensions",
        description: "Set the output width and height precisely, or use the fitted defaults.",
      },
      {
        title: "Multiple Output Formats",
        description: "Download as PNG, JPEG, or WEBP with adjustable quality.",
      },
    ],
    features: [
      {
        title: "Passport & ID Presets",
        description: "2×2 passport, ID card, visa photo, and US passport ratios built in.",
      },
      {
        title: "Document Presets",
        description: "A4, Letter, and Legal aspect ratios for scans and documents.",
      },
      {
        title: "Social Media Presets",
        description: "Instagram square/portrait/landscape, Twitter header, YouTube thumbnail, and more.",
      },
      {
        title: "Custom Aspect Ratio",
        description: "Enter any width and height to create your own ratio.",
      },
      {
        title: "HEIC Support",
        description: "iPhone HEIC photos are decoded automatically before cropping.",
      },
    ],
    howTo: {
      heading: "How to Resize & Crop an Image",
      description: "Crop any image to a preset ratio or custom dimensions in four steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, click to browse, or paste an image from your clipboard.",
        },
        {
          name: "Choose a ratio or size",
          text: "Pick a preset like Passport, A4, or Instagram, or enter a custom aspect ratio.",
        },
        {
          name: "Fine-tune the crop",
          text: "Drag the crop window to select the perfect area of your image.",
        },
        {
          name: "Download",
          text: "Adjust output quality and download as PNG, JPEG, or WEBP.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I crop an image online?",
        answer:
          "Upload your image, choose a preset ratio or custom size, drag to adjust the crop area, and download the result. No uploads, no servers.",
      },
      {
        question: "Can I make a passport-size photo?",
        answer:
          "Yes. Select the Passport (2×2) or US Passport preset, position the crop over your face, and download.",
      },
      {
        question: "Can I crop to A4 size?",
        answer:
          "Yes, A4, Letter, and Legal document presets are built in.",
      },
      {
        question: "Can I use a custom size?",
        answer:
          "Absolutely. Enter any custom aspect ratio, and set the exact output width and height.",
      },
      {
        question: "What output formats are supported?",
        answer: "PNG (lossless), JPEG, and WEBP — with a quality slider for JPEG and WEBP.",
      },
      {
        question: "Will cropping reduce quality?",
        answer:
          "Cropping removes pixels rather than compressing them. Choose a higher output quality to keep results crisp.",
      },
      {
        question: "Is the resize tool free?",
        answer:
          "Yes, completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Can I resize an iPhone HEIC photo?",
        answer:
          "Yes, HEIC and HEIF files are decoded automatically before cropping.",
      },
    ],
  },

  flip: {
    intro: {
      heading: "Flip & Rotate Image Online — Mirror Photos in One Click",
      paragraphs: [
        "The Flip & Rotate tool mirrors an image horizontally or vertically and rotates it 90° at a time — perfect for fixing mirrored selfies, sideways photos, or any image that needs a quick orientation change.",
        "Preview the changes live, then download your corrected image as PNG, JPEG, or WEBP. All processing happens in your browser.",
      ],
    },
    benefits: [
      {
        title: "One-Click Flip",
        description: "Mirror horizontally or vertically with a single click.",
      },
      {
        title: "90° Rotation",
        description: "Rotate left or right instantly to fix orientation.",
      },
      {
        title: "Live Preview",
        description: "See the flipped result update in real time as you adjust.",
      },
      {
        title: "Privacy by Design",
        description: "Your photos are processed locally and never uploaded.",
      },
    ],
    features: [
      {
        title: "Horizontal Flip",
        description: "Mirror the image left-to-right — perfect for fixing text and mirrors.",
      },
      {
        title: "Vertical Flip",
        description: "Mirror the image top-to-bottom.",
      },
      {
        title: "Rotate Left / Right",
        description: "Rotate 90° at a time in either direction.",
      },
      {
        title: "Multiple Formats",
        description: "Download as PNG, JPEG, or WEBP with adjustable quality.",
      },
      {
        title: "HEIC Support",
        description: "iPhone HEIC photos are decoded automatically before flipping.",
      },
    ],
    howTo: {
      heading: "How to Flip or Rotate an Image",
      description: "Fix the orientation of any image in three quick steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, click to browse, or paste an image from your clipboard.",
        },
        {
          name: "Flip or rotate",
          text: "Mirror horizontally or vertically, or rotate 90° left and right.",
        },
        {
          name: "Download",
          text: "Save as PNG, JPEG, or WEBP with your preferred quality.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I flip an image online?",
        answer:
          "Upload your image, click Flip Horizontal or Flip Vertical, and download the result. It only takes a second and happens entirely in your browser.",
      },
      {
        question: "Can I rotate an image 90 degrees?",
        answer:
          "Yes. Use the rotate left and rotate right buttons to turn the image 90° at a time.",
      },
      {
        question: "Why is my photo sideways?",
        answer:
          "Cameras sometimes store orientation incorrectly. Rotate the image 90° until it's upright, then download the corrected version.",
      },
      {
        question: "Is flipping free?",
        answer: "Yes, completely free with no sign-ups, watermarks, or limits.",
      },
      {
        question: "Are my photos uploaded to a server?",
        answer:
          "No. All processing happens locally in your browser — your photos never leave your device.",
      },
      {
        question: "What formats can I download?",
        answer: "PNG, JPEG, and WEBP, with an adjustable quality slider.",
      },
      {
        question: "Can I flip an iPhone HEIC photo?",
        answer:
          "Yes, HEIC and HEIF files are decoded automatically before flipping.",
      },
      {
        question: "Does the tool keep the original resolution?",
        answer:
          "Yes. Flipping and rotating preserve the full resolution of your image.",
      },
    ],
  },

  convert: {
    intro: {
      heading: "Convert Image Format Online — JPG, PNG, WEBP, AVIF & HEIC",
      paragraphs: [
        "The Format Converter changes any image to the format you need — JPG, PNG, WEBP, or AVIF — and accepts HEIC files from iPhones so you can convert them straight to JPG or PNG.",
        "Perfect when a website or app only accepts a specific format. Everything runs in your browser, so your files stay private.",
      ],
    },
    benefits: [
      {
        title: "Convert to Any Format",
        description: "JPG, PNG, WEBP, and AVIF output, with quality control.",
      },
      {
        title: "HEIC from iPhone",
        description: "Open and convert iPhone HEIC photos on any device instantly.",
      },
      {
        title: "AVIF Output",
        description: "Next-gen, patent-free compression for the smallest files.",
      },
      {
        title: "100% Private",
        description: "Files are converted locally in your browser — never uploaded.",
      },
    ],
    features: [
      {
        title: "Four Output Formats",
        description: "Choose PNG, JPEG, WEBP, or AVIF as your target format.",
      },
      {
        title: "HEIC / HEIF Input",
        description: "iPhone photos are decoded in-browser via a WASM decoder.",
      },
      {
        title: "AVIF Detection",
        description: "AVIF output is offered only when your browser can encode it.",
      },
      {
        title: "Quality Slider",
        description: "Fine-tune the quality for lossy formats like JPEG, WEBP, and AVIF.",
      },
      {
        title: "Dedicated Conversion Pages",
        description: "Direct links like /jpg-to-png and /heic-to-jpg for every conversion.",
      },
    ],
    howTo: {
      heading: "How to Convert an Image Format",
      description: "Change any image to the format you need in three steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, click to browse, or paste an image from your clipboard.",
        },
        {
          name: "Pick a format",
          text: "Choose PNG, JPEG, WEBP, or AVIF and fine-tune the quality slider.",
        },
        {
          name: "Download",
          text: "Your converted image is ready instantly — download it with one click.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I convert an image to another format?",
        answer:
          "Upload your image, choose the target format (PNG, JPEG, WEBP, or AVIF), and download the converted file. It's instant and runs in your browser.",
      },
      {
        question: "Can I convert HEIC to JPG?",
        answer:
          "Yes. HEIC and HEIF files from iPhones are decoded in your browser and can be converted to JPG, PNG, or WEBP.",
      },
      {
        question: "What is AVIF?",
        answer:
          "AVIF is a next-generation, patent-free image format with excellent compression. You can convert to AVIF in browsers that support it (Chrome/Edge).",
      },
      {
        question: "Will converting reduce quality?",
        answer:
          "Converting between lossless formats (like PNG to PNG) keeps quality. Converting to lossy formats like JPEG applies compression — adjust the quality slider to balance size and quality.",
      },
      {
        question: "Is the converter free?",
        answer: "Yes, completely free with no sign-ups, watermarks, or limits.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All conversion happens locally in your browser — your images never leave your device.",
      },
      {
        question: "Why can't I choose AVIF output?",
        answer:
          "AVIF encoding isn't supported by every browser (notably Firefox). The option is hidden automatically when your browser can't encode it.",
      },
      {
        question: "Does the converter keep transparency?",
        answer:
          "PNG keeps transparency. JPEG doesn't support transparency, so transparent areas become white.",
      },
    ],
  },

  "watermark-image": {
    intro: {
      heading: "Add Watermark to Image Online — Text & Logo Watermark",
      paragraphs: [
        "Protect your photos and graphics with the free Watermark tool. Add a custom text watermark — with fonts, shadows, outlines, and rotation — or overlay your own logo image, then drag it to any position on the picture.",
        "Watermarking happens entirely in your browser using the Canvas API, so your original photo and logo never leave your device. Download the result as PNG, JPEG, or WEBP in full resolution.",
      ],
    },
    benefits: [
      {
        title: "Text & Logo Watermarks",
        description: "Type a custom watermark or upload your logo — both are fully supported.",
      },
      {
        title: "Drag-and-Drop Positioning",
        description: "Place the watermark anywhere on the image, or snap to 7 presets like corners and center.",
      },
      {
        title: "Full Styling Control",
        description: "Fonts, colors, opacity, rotation, letter spacing, shadows, and outlines for text watermarks.",
      },
      {
        title: "100% Private",
        description: "Everything is processed locally in your browser — nothing is ever uploaded.",
      },
    ],
    features: [
      {
        title: "Custom Text Watermark",
        description: "Any text with 9 font families, weights, italics, letter spacing, and pill backgrounds.",
      },
      {
        title: "Logo Watermark",
        description: "Upload a PNG, JPG, WEBP, or SVG logo and scale it to fit your image perfectly.",
      },
      {
        title: "7 Position Presets + Free Drag",
        description: "Top, center, bottom corners plus a custom drag mode for pixel-perfect placement.",
      },
      {
        title: "Shadow & Outline",
        description: "Make text readable on any background with drop shadows and stroke outlines.",
      },
      {
        title: "Undo / Redo / Reset",
        description: "Full history support — step back and forward through every watermark edit.",
      },
      {
        title: "Multi-Format Export",
        description: "Download as PNG, JPEG, or WEBP at full resolution with adjustable quality.",
      },
    ],
    howTo: {
      heading: "How to Watermark an Image",
      description: "Add a text or logo watermark in four simple steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, click to browse, or paste an image from your clipboard.",
        },
        {
          name: "Choose text or logo",
          text: "Type your watermark text or upload a logo, then style it with fonts, colors, and effects.",
        },
        {
          name: "Position it",
          text: "Drag the watermark on the live preview or pick a preset corner and adjust the margin.",
        },
        {
          name: "Download",
          text: "Choose PNG, JPEG, or WEBP, set the quality, and download your watermarked image.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I add a watermark to an image online?",
        answer:
          "Upload your image, type your watermark text or upload a logo, drag it to the position you want, and download. Everything happens instantly in your browser.",
      },
      {
        question: "Can I use my own logo as a watermark?",
        answer:
          "Yes. Upload a PNG, JPG, WEBP, or SVG logo and it becomes your watermark. You can resize it, rotate it, and keep or remove its transparency.",
      },
      {
        question: "Is the watermark tool free?",
        answer: "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All watermarking happens locally in your browser using the Canvas API — your images and logos never leave your device.",
      },
      {
        question: "Can I position the watermark anywhere?",
        answer:
          "Yes. Use the 7 position presets (corners, center, edges) or drag the watermark directly on the preview for a completely custom position.",
      },
      {
        question: "What text styles are available?",
        answer:
          "9 font families, 6 font weights, italics, any text color, background pills, letter spacing, drop shadows, and outlines.",
      },
      {
        question: "What output formats are supported?",
        answer: "PNG (lossless), JPEG, and WEBP — with a quality slider for JPEG and WEBP output.",
      },
      {
        question: "Can I undo a mistake?",
        answer:
          "Yes. The tool keeps a full history of your edits — use Undo and Redo to step back and forward, or Reset to start fresh.",
      },
      {
        question: "Does the watermark keep my image resolution?",
        answer:
          "Yes. The result is exported at your image's full resolution, so watermarked photos stay sharp.",
      },
    ],
  },

  "remove-background": {
    intro: {
      heading: "AI Background Remover — Free & Private",
      paragraphs: [
        "Remove backgrounds from photos in seconds with CompressPix's AI Background Remover. The neural network detects your subject automatically and cuts it out — no manual selection, no green screens, no design skills needed.",
        "Everything runs entirely in your browser using WebAssembly and WebGPU, so your images never leave your device. Replace the background with a color, gradient, blur, or another photo, refine the edges, and download a transparent PNG, JPG, or WEBP in one click.",
      ],
    },
    benefits: [
      {
        title: "AI-Powered Cutouts",
        description: "A neural network detects the subject automatically — including hair and fine details.",
      },
      {
        title: "100% Private & Free",
        description: "Processing happens in your browser. Images are never uploaded, so nothing is stored.",
      },
      {
        title: "Instant Transparent PNGs",
        description: "Export a clean cutout with a transparent background in a single click.",
      },
      {
        title: "Batch Mode & ZIP",
        description: "Process multiple images at once and download them all as a ZIP archive.",
      },
    ],
    features: [
      {
        title: "One-Click Subject Detection",
        description: "Upload an image and the AI finds the subject and removes the background automatically.",
      },
      {
        title: "7 Background Replacements",
        description: "Transparent, solid color, gradient, blurred backdrop, or any replacement photo.",
      },
      {
        title: "Full Image Adjustments",
        description: "Brightness, contrast, saturation, sharpness, exposure, temperature, tint, gamma, and opacity.",
      },
      {
        title: "Edge Refinement",
        description: "Smooth, feather, hair refinement, and edge cleanup — plus restore and erase brushes.",
      },
      {
        title: "Before / After Comparison",
        description: "Slider, side-by-side, and split views with zoom, pan, and fullscreen preview.",
      },
      {
        title: "Multi-Format Export",
        description: "Download as transparent PNG, colored PNG, JPG, or WEBP with a quality slider.",
      },
    ],
    howTo: {
      heading: "How to Remove a Background",
      description: "Cut out any image and replace its background in four simple steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, click to browse, or paste a JPG, PNG, or WEBP image (up to 50 MB).",
        },
        {
          name: "AI removes the background",
          text: "The neural network detects the subject and creates a clean cutout automatically.",
        },
        {
          name: "Refine & replace",
          text: "Choose a new background, fine-tune edges with brushes, and adjust the subject's look.",
        },
        {
          name: "Download",
          text: "Export as transparent PNG, JPG, or WEBP — or download the whole batch as a ZIP.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I remove a background from an image online?",
        answer:
          "Upload your image and the AI removes the background automatically. You can then replace it with a color, gradient, blur, or another photo, refine the edges, and download the result. Everything happens in your browser.",
      },
      {
        question: "Is this AI background remover really free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits. You can remove backgrounds from as many images as you like.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All processing runs locally in your browser with WebAssembly. Your photos never leave your device, so nothing is ever stored or uploaded.",
      },
      {
        question: "How does the AI detect the subject?",
        answer:
          "A neural network (ONNX model) analyzes the image and predicts which pixels belong to the subject versus the background. It's the same technology used by paid background removers — running right in your browser.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "You can upload JPG, JPEG, PNG, and WEBP images up to 50 MB each, and download the result as transparent PNG, colored PNG, JPG, or WEBP.",
      },
      {
        question: "How do I make a transparent background PNG?",
        answer:
          "Choose 'PNG (Transparent)' in the export panel after the AI removes the background. The download will have a fully transparent background, perfect for logos and product photos.",
      },
      {
        question: "Can I replace the background with a color or image?",
        answer:
          "Yes. Pick from transparent, solid color, gradient, a blurred version of the photo, or upload any image to use as the new background.",
      },
      {
        question: "Does it work on photos with hair?",
        answer:
          "The AI model is trained to preserve fine details like hair. You can also use the Hair Refine tool and the Restore brush to bring back any wispy strands that were removed.",
      },
      {
        question: "How do I fix leftover background bits or missing parts?",
        answer:
          "Use the Erase brush to remove leftover background and the Restore brush to bring back parts of the subject. You can undo, redo, or reset to the original AI cutout at any time.",
      },
      {
        question: "Can I remove backgrounds from multiple images at once?",
        answer:
          "Yes. Upload several images to the batch queue — they process automatically — and download them all together as a ZIP file.",
      },
      {
        question: "Why does the first use download a model?",
        answer:
          "The first time you use the tool, the browser downloads the AI model (~80 MB) so it can run locally. It's cached afterward, so later images process instantly and offline.",
      },
      {
        question: "Will the background removal reduce image quality?",
        answer:
          "No. The cutout keeps your image's pixels — only the background is removed. Choose PNG for lossless quality or JPG/WEBP with a quality slider for smaller files.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, the tool is fully responsive and works on desktop, tablet, and mobile browsers — including touch-friendly restore and erase brushes.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Conversion-pair pages (e.g. /jpg-to-png, /heic-to-jpg)             */
/* ------------------------------------------------------------------ */

function conversionQuestion(pair: ConversionPair, question: string): string {
  const { from, to } = pair;
  return question.replace(/\{from\}/g, from.label).replace(/\{to\}/g, to.label);
}

export function getConversionSeoContent(pair: ConversionPair): {
  intro: { heading: string; paragraphs: string[] };
  howTo: { heading: string; description: string; steps: HowToStep[] };
  faqs: Faq[];
} {
  const { from, to } = pair;
  const transparentNote =
    to.type === "image/png"
      ? "PNG preserves transparency, so logos and graphics with transparent backgrounds stay transparent."
      : `JPG and WEBP don't support transparency — transparent areas are filled with white.`;

  return {
    intro: {
      heading: `Convert ${from.label} to ${to.label} — Free & Private`,
      paragraphs: [
        `Need to convert ${from.label} to ${to.label}? This dedicated page does exactly that — upload a ${from.label} image and download the ${to.label} version in seconds. No uploads, no servers, no watermarks.`,
        transparentNote +
          " All processing happens locally in your browser, so your files never leave your device.",
      ],
    },
    howTo: {
      heading: `How to Convert ${from.label} to ${to.label}`,
      description: `Turn your ${from.label} image into ${to.label} in three simple steps.`,
      steps: [
        { name: "Upload your image", text: `Drag and drop or browse for a ${from.label} image on your device.` },
        {
          name: `Convert to ${to.label}`,
          text: `The conversion starts automatically as soon as the image loads. Adjust the quality slider if needed.`,
        },
        { name: "Download", text: `Download your converted ${to.label} file with one click.` },
      ],
    },
    faqs: [
      {
        question: conversionQuestion(pair, "How do I convert {from} to {to} online?"),
        answer: conversionQuestion(
          pair,
          `Upload a {from} image and the tool converts it to {to} instantly in your browser. Click Download to save the result.`
        ),
      },
      {
        question: conversionQuestion(pair, "Is converting {from} to {to} free?"),
        answer: "Yes, completely free with no sign-ups, watermarks, or usage limits.",
      },
      {
        question: conversionQuestion(pair, "Are my images uploaded to a server?"),
        answer: "No. All conversion happens locally in your browser — your images never leave your device.",
      },
      {
        question: conversionQuestion(pair, "Will I lose quality converting {from} to {to}?"),
        answer: conversionQuestion(
          pair,
          `Converting from {from} to {to} re-encodes the image. Use the quality slider to balance file size and quality to your preference.`
        ),
      },
      {
        question: conversionQuestion(pair, "What happens to transparency?"),
        answer: transparentNote,
      },
      {
        question: conversionQuestion(pair, "Can I convert multiple {from} files at once?"),
        answer: "This page converts one image at a time for the best quality. You can convert as many files as you like, one after another.",
      },
      {
        question: conversionQuestion(pair, "Does it work on mobile?"),
        answer: "Yes, the tool is fully responsive and works on desktop, tablet, and mobile browsers.",
      },
      {
        question: conversionQuestion(pair, "Why choose CompressPix to convert {from} to {to}?"),
        answer: conversionQuestion(
          pair,
          `CompressPix is free, private, and unlimited. There's no software to install and your {from} files are never uploaded to a server.`
        ),
      },
    ],
  };
}
