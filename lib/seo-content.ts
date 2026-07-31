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
  /** Article meta chips shown above the content (read time, updated, author). */
  meta?: { readTime: string; updated: string; author: string };
  /** 3–6 short feature-highlight chips shown at the top of the content. */
  highlights?: string[];
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

  "passport-photo-maker": {
    meta: { readTime: "5 min read", updated: "July 2026", author: "CompressPix" },
    highlights: [
      "25+ country sizes",
      "300 DPI output",
      "Print sheets (4×6 · A4)",
      "Background colors",
      "100% browser-based",
    ],
    intro: {
      heading: "Make a Passport Photo Online — 25+ Country Sizes",
      paragraphs: [
        "Need a passport-size photo without the studio visit? The Passport Photo Maker builds a print-ready photo for 25+ countries — US 2×2 inch, India 35×45 mm, UK 35×45 mm, China 33×48 mm, and more — right in your browser. Pick your country, drag your face into the frame, choose a background color, and download a single photo or a full print sheet.",
        "Everything runs locally on your device using the Canvas API, so your photo never leaves your computer. Export at exact pixel dimensions with 300 DPI quality, or generate a 4×6, 5×7, or A4 sheet with multiple copies ready for home printing.",
      ],
    },
    benefits: [
      {
        title: "25+ Country Presets",
        description: "US, India, UK, Canada, China, Japan, UAE, and more — the correct size for each is built in.",
      },
      {
        title: "Print-Ready Sheets",
        description: "Generate a 4×6, 5×7, or A4 sheet with as many copies as fit — perfect for home printing.",
      },
      {
        title: "Exact 300 DPI Output",
        description: "Every photo exports at its official pixel dimensions with print-quality resolution.",
      },
      {
        title: "100% Private",
        description: "Your photo is processed in your browser and never uploaded to any server.",
      },
    ],
    features: [
      {
        title: "Country Size Presets",
        description: "25+ official sizes grouped by region — passport, visa, and ID card dimensions.",
      },
      {
        title: "Custom Size & DPI",
        description: "Enter any width, height, and DPI to match requirements your country isn't listed for.",
      },
      {
        title: "Face Positioning",
        description: "Drag the photo to center your face and zoom in with the slider or mouse wheel.",
      },
      {
        title: "Background Colors",
        description: "White, gray, blue, navy, red, and green — plus automatic recoloring of near-white backgrounds.",
      },
      {
        title: "Print Sheets",
        description: "Auto-arrange multiple copies on 4×6 in, 5×7 in, or A4 sheets for home printing.",
      },
      {
        title: "JPG & PNG Export",
        description: "Download as JPG (with quality control) or lossless PNG at exact passport dimensions.",
      },
    ],
    howTo: {
      heading: "How to Make a Passport Photo",
      description: "Create a print-ready passport photo in four simple steps.",
      steps: [
        {
          name: "Upload your photo",
          text: "Drag and drop, browse, or paste a JPG, PNG, WEBP, or HEIC selfie. A straight-on, evenly lit shot works best.",
        },
        {
          name: "Choose your country size",
          text: "Pick from 25+ presets like US 2×2, India 35×45, or UK 35×45 mm — or enter a custom size and DPI.",
        },
        {
          name: "Position your face",
          text: "Drag to center your face and zoom until your head fills the frame nicely. Pick a background color if needed.",
        },
        {
          name: "Download",
          text: "Save the single photo, or download a 4×6 / 5×7 / A4 print sheet with multiple copies.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I make a passport photo online?",
        answer:
          "Upload your photo, choose your country's size from the presets, drag your face into position, and download. The photo is generated at the exact official pixel dimensions — entirely in your browser.",
      },
      {
        question: "Is the passport photo maker free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits. Make as many passport photos as you need.",
      },
      {
        question: "Are my photos uploaded to a server?",
        answer:
          "No. All processing happens locally in your browser using the Canvas API — your photo never leaves your device.",
      },
      {
        question: "What size is a standard passport photo?",
        answer:
          "The most common size is 35×45 mm (used by the UK, India, Australia, and most of Europe), but it varies by country — the US uses 2×2 inch (51×51 mm) and Canada uses 50×70 mm. The tool includes the official size for 25+ countries.",
      },
      {
        question: "What size is a US passport photo?",
        answer:
          "A US passport photo is 2×2 inches (51×51 mm), which is 600×600 pixels at 300 DPI. The US preset in the tool produces exactly this.",
      },
      {
        question: "What size is an Indian passport photo?",
        answer:
          "An Indian passport photo is 35×45 mm (413×531 pixels at 300 DPI). Blue or white backgrounds are commonly accepted.",
      },
      {
        question: "What size is a UK passport photo?",
        answer:
          "A UK passport photo is 35×45 mm (413×531 pixels at 300 DPI). The UK preset produces exactly this size.",
      },
      {
        question: "What size is a China passport photo?",
        answer:
          "A Chinese passport photo is 33×48 mm (390×567 pixels at 300 DPI). The China preset in the tool produces exactly this size.",
      },
      {
        question: "How do I print passport photos at home?",
        answer:
          "Use the Print Sheet option: the tool arranges multiple copies of your photo on a 4×6, 5×7, or A4 sheet. Print at 100% scale with no margin scaling and cut along the guides.",
      },
      {
        question: "Can I change the background color?",
        answer:
          "Yes. Choose from white, gray, light blue, blue, navy, red, or green, or pick a custom color. For selfies with a white background, enable the near-white recoloring option to tint the background automatically.",
      },
      {
        question: "What DPI should I use for passport photos?",
        answer:
          "300 DPI is the standard for print. All country presets default to 300 DPI, and you can raise it in the custom size options if your application requires higher resolution.",
      },
      {
        question: "Can I make a visa photo with this tool?",
        answer:
          "Yes. Many visa photos use the same 35×45 mm size, and the tool includes dedicated presets such as the US 1×1 inch and UAE 43×55 mm. Always check your visa authority's exact requirements.",
      },
      {
        question: "How many passport photos fit on a 4×6 sheet?",
        answer:
          "For a 35×45 mm photo, the tool fits 3 copies on a 4×6 inch sheet; larger sheets like A4 fit many more. The layout is computed automatically with clean margins for cutting.",
      },
      {
        question: "Why does my face look too small or too large in the frame?",
        answer:
          "Use the zoom slider (or scroll on the preview) to enlarge your face, then drag to center it. Passport rules usually want your head to fill most of the frame with a small margin around it.",
      },
      {
        question: "Does the tool work on mobile?",
        answer:
          "Yes, the tool is fully responsive and works on desktop, tablet, and mobile browsers — including drag-to-position on touch screens.",
      },
      {
        question: "What are the official requirements for passport photos?",
        answer:
          "Common requirements: neutral expression, face centered and forward, even lighting, plain light background, no glasses glare or headwear, and sharp focus. Always confirm with your issuing authority — requirements differ by country.",
      },
    ],
  },

  "image-to-pdf": {
    meta: { readTime: "4 min read", updated: "July 2026", author: "CompressPix" },
    highlights: [
      "Merge up to 50 images",
      "A4 · Letter · Legal · A5",
      "Reorder pages",
      "HEIC support",
      "100% browser-based",
    ],
    intro: {
      heading: "Convert Images to PDF — Merge JPG, PNG & HEIC in Seconds",
      paragraphs: [
        "The Image to PDF tool turns your photos and scans into a single PDF document, right in your browser. Upload up to 50 images — JPG, PNG, WEBP, or HEIC from an iPhone — reorder them into the right sequence, pick your page size and orientation, and download a ready-to-share PDF.",
        "Each image becomes one page, fitted and centered automatically with your chosen margins. Everything is generated locally with the PDF built in your browser, so your files never leave your device — perfect for contracts, scans, receipts, and photo albums.",
      ],
    },
    benefits: [
      {
        title: "One PDF from Many Images",
        description: "Merge up to 50 JPG, PNG, WEBP, or HEIC files into a single document.",
      },
      {
        title: "Full Page Control",
        description: "A4, Letter, Legal, or A5 — portrait or landscape — with four margin presets.",
      },
      {
        title: "Reorder Before Export",
        description: "Move pages up or down so the final document is in exactly the right order.",
      },
      {
        title: "100% Private",
        description: "The PDF is generated locally in your browser — nothing is uploaded anywhere.",
      },
    ],
    features: [
      {
        title: "Multi-Image Upload",
        description: "Drag, drop, or paste as many images as you like — each becomes a PDF page.",
      },
      {
        title: "Page Reordering",
        description: "Move any image up or down in the list to control the page order.",
      },
      {
        title: "Page Size Presets",
        description: "A4, Letter, Legal, and A5 with portrait or landscape orientation.",
      },
      {
        title: "Margin Options",
        description: "None, small, medium, or large margins around each fitted image.",
      },
      {
        title: "Quality Control",
        description: "Adjust the image quality inside the PDF to balance sharpness and file size.",
      },
      {
        title: "HEIC Support",
        description: "iPhone HEIC photos are decoded automatically before being added to the PDF.",
      },
    ],
    howTo: {
      heading: "How to Convert Images to PDF",
      description: "Merge your images into a PDF document in three simple steps.",
      steps: [
        {
          name: "Upload your images",
          text: "Drag and drop, browse, or paste JPG, PNG, WEBP, or HEIC images. Add as many as you need — up to 50.",
        },
        {
          name: "Arrange & configure",
          text: "Reorder pages with the up and down buttons, then choose page size, orientation, margins, and quality.",
        },
        {
          name: "Download the PDF",
          text: "Click Download PDF and your merged document is generated instantly in your browser.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I convert images to PDF online?",
        answer:
          "Upload your images, reorder them if needed, choose your page size and margins, and click Download PDF. Each image becomes one page — generated entirely in your browser.",
      },
      {
        question: "Can I convert JPG to PDF?",
        answer:
          "Yes. JPG, PNG, WEBP, and HEIC files are all supported — each becomes a page in the PDF. There's no need to convert the images to another format first.",
      },
      {
        question: "Can I merge multiple images into one PDF?",
        answer:
          "Yes. Upload up to 50 images and they are merged into a single PDF document, one image per page, in the order you arrange them.",
      },
      {
        question: "Can I reorder the pages before downloading?",
        answer:
          "Yes. Use the up and down arrows next to each image to move it within the list — the order of the list is the order of the PDF pages.",
      },
      {
        question: "Is the image to PDF converter free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. The PDF is built locally in your browser using client-side libraries — your images never leave your device.",
      },
      {
        question: "What page sizes are supported?",
        answer:
          "A4, Letter, Legal, and A5 — each in portrait or landscape orientation, with none, small, medium, or large margins.",
      },
      {
        question: "What happens to image quality in the PDF?",
        answer:
          "Images are embedded at up to 3000 px on their longest side. Use the quality slider to trade a smaller file size for slightly lower detail, or keep 100% for maximum sharpness.",
      },
      {
        question: "Does the tool keep image transparency?",
        answer:
          "PDF pages are opaque, so transparent PNG areas are filled with white to keep the document clean and print-friendly.",
      },
      {
        question: "Can I convert iPhone HEIC photos to PDF?",
        answer:
          "Yes. HEIC and HEIF files from iPhones are decoded automatically in your browser before being added to the PDF.",
      },
      {
        question: "Is there a limit on the number of images?",
        answer:
          "You can combine up to 50 images per PDF, each up to 50 MB. After downloading, you can start a new document anytime.",
      },
      {
        question: "Can I make a photo album PDF?",
        answer:
          "Absolutely. Add your photos, arrange them in the order you like, pick A4 or Letter with small margins, and download a shareable album PDF.",
      },
    ],
  },

  "pdf-to-image": {
    meta: { readTime: "4 min read", updated: "July 2026", author: "CompressPix" },
    highlights: [
      "PDF → JPG / PNG",
      "Up to 4× resolution (288 DPI)",
      "Page previews",
      "ZIP download of all pages",
      "100% browser-based",
    ],
    intro: {
      heading: "Convert PDF to Image — Every Page to JPG or PNG",
      paragraphs: [
        "The PDF to Image tool converts every page of your PDF into a high-resolution JPG or PNG image, right in your browser. Upload a document, choose your resolution — from 1× for quick sharing up to 4× (288 DPI) for print — preview each page, and download them one by one or all together as a ZIP.",
        "It's powered by the same PDF rendering engine used by Firefox, running locally on your device, so your document never leaves your computer. Perfect for turning PDF reports into images, pulling a single page out as a picture, or extracting pages for a presentation.",
      ],
    },
    benefits: [
      {
        title: "Every Page, One Click",
        description: "All pages are rasterized automatically — download any page individually or all as a ZIP.",
      },
      {
        title: "Print-Quality Resolution",
        description: "Render up to 4× scale (288 DPI) for sharp, print-ready images.",
      },
      {
        title: "JPG or PNG Output",
        description: "Choose PNG for lossless quality or JPG with an adjustable quality slider for smaller files.",
      },
      {
        title: "100% Private",
        description: "Rendering happens locally in your browser using the same engine as Firefox — nothing is uploaded.",
      },
    ],
    features: [
      {
        title: "Whole-Document Conversion",
        description: "Every page of the PDF is converted automatically with live progress.",
      },
      {
        title: "Page Previews",
        description: "See a thumbnail of every rendered page with its exact pixel dimensions.",
      },
      {
        title: "Resolution Control",
        description: "1×, 1.5×, 2×, 3×, or 4× scale — roughly 72 to 288 DPI — re-render anytime.",
      },
      {
        title: "ZIP All Pages",
        description: "Download every page in a single ZIP archive, named and numbered automatically.",
      },
      {
        title: "Per-Page Download",
        description: "Grab just the page you need as a JPG or PNG with one click.",
      },
      {
        title: "Password & Corruption Handling",
        description: "Clear errors are shown for password-protected or unreadable PDFs.",
      },
    ],
    howTo: {
      heading: "How to Convert a PDF to Images",
      description: "Turn a PDF into images in three simple steps.",
      steps: [
        {
          name: "Upload your PDF",
          text: "Drag and drop or browse for a PDF file (up to 50 MB). Every page is rendered automatically.",
        },
        {
          name: "Choose format & resolution",
          text: "Pick PNG or JPG, adjust the quality, and select a resolution from 1× to 4×. Pages re-render instantly.",
        },
        {
          name: "Download",
          text: "Download individual pages or grab them all as a ZIP archive — generated entirely in your browser.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I convert a PDF to images online?",
        answer:
          "Upload your PDF and every page is rendered automatically. Choose JPG or PNG, pick a resolution, and download pages individually or all at once as a ZIP. Everything happens in your browser.",
      },
      {
        question: "Can I convert PDF to JPG?",
        answer:
          "Yes. Choose the JPG format and adjust the quality slider, then download individual pages or the whole document as a ZIP of JPG files.",
      },
      {
        question: "Can I convert PDF to PNG?",
        answer:
          "Yes. PNG is the default output format — it's lossless, so text and graphics stay perfectly sharp.",
      },
      {
        question: "What resolution will the images be?",
        answer:
          "That depends on the scale you choose: 1× is about 72 DPI (screen), 2× is 144 DPI, and 4× is 288 DPI — plenty for print. Higher scales produce larger, sharper files.",
      },
      {
        question: "Is the PDF to image converter free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my documents uploaded to a server?",
        answer:
          "No. Pages are rendered locally in your browser with pdf.js — the same rendering engine Firefox uses. Your documents never leave your device.",
      },
      {
        question: "Can I convert just one page?",
        answer:
          "Yes. After rendering, use the download button on any single page to save just that one as an image.",
      },
      {
        question: "Can I download all pages at once?",
        answer:
          "Yes. The 'Download All as ZIP' button packages every rendered page into a single ZIP archive with numbered file names.",
      },
      {
        question: "Why can't my PDF be read?",
        answer:
          "Password-protected, corrupted, or scanned-only PDFs with unusual encodings can fail. The tool shows a clear error so you can try another file.",
      },
      {
        question: "What is the maximum PDF size?",
        answer:
          "Files up to 50 MB are supported. Very large documents render page by page with a live progress bar.",
      },
      {
        question: "Does the tool work with scanned documents?",
        answer:
          "Yes — scanned PDFs render just like any other PDF. The images will show the scanned page content at your chosen resolution.",
      },
      {
        question: "Can I use the images for printing?",
        answer:
          "Yes. Use 3× or 4× resolution (216–288 DPI) for crisp prints, and choose PNG for the sharpest text and graphics.",
      },
    ],
  },

  "signature-resizer": {
    meta: { readTime: "4 min read", updated: "July 2026", author: "CompressPix" },
    highlights: [
      "5 size presets + custom",
      "20 / 50 / 100 KB limits",
      "Keeps transparency",
      "PNG & JPG export",
      "100% browser-based",
    ],
    intro: {
      heading: "Resize a Signature Online — Fit Any Size & File Limit",
      paragraphs: [
        "The Signature Resizer fits your signature to the exact pixel size and file-size limit your application needs. Choose a preset like 500×200 or 1000×300 px, then squeeze the file under common e-signature limits — 20 KB, 50 KB, or 100 KB — automatically.",
        "Because signatures are almost always transparent PNGs, the tool preserves transparency by default so your signature layers cleanly onto any document. Everything runs in your browser using the Canvas API, so your signature never leaves your device.",
      ],
    },
    benefits: [
      {
        title: "Exact Size Presets",
        description: "300×100 up to 1000×300 px with one click — the sizes most signature platforms accept.",
      },
      {
        title: "File-Size Limits Built In",
        description: "Auto-shrink your signature to 20 KB, 50 KB, or 100 KB for platforms with upload caps.",
      },
      {
        title: "Transparency Preserved",
        description: "PNG export keeps your signature's transparent background for clean document layering.",
      },
      {
        title: "100% Private",
        description: "Your signature is processed locally in your browser — nothing is ever uploaded.",
      },
    ],
    features: [
      {
        title: "Signature Size Presets",
        description: "300×100, 400×150, 500×200, 800×250, and 1000×300 px — plus custom dimensions.",
      },
      {
        title: "Target KB Compression",
        description: "Hit 20 KB, 50 KB, 100 KB, or 200 KB limits by adjusting quality and resolution automatically.",
      },
      {
        title: "Transparent PNG Export",
        description: "Signatures keep their transparency so they layer cleanly onto contracts and PDFs.",
      },
      {
        title: "White-Background JPG",
        description: "For platforms that need a solid background, export a clean JPG with a white fill.",
      },
      {
        title: "Live Preview",
        description: "See your resized signature at its exact output size, with transparency visible.",
      },
      {
        title: "HEIC Support",
        description: "iPhone HEIC photos are decoded automatically before resizing.",
      },
    ],
    howTo: {
      heading: "How to Resize a Signature",
      description: "Fit your signature to any size and file limit in three simple steps.",
      steps: [
        {
          name: "Upload your signature",
          text: "Drag and drop, browse, or paste your signature image — PNG, JPG, WEBP, or HEIC.",
        },
        {
          name: "Pick size & limit",
          text: "Choose a size preset like 500×200 px and a file limit like 20 KB or 50 KB. Pick PNG to keep transparency.",
        },
        {
          name: "Download",
          text: "Your resized, size-limited signature downloads instantly — generated entirely in your browser.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I resize a signature online?",
        answer:
          "Upload your signature, choose a size preset (or set a file limit like 20 KB or 50 KB), pick PNG to keep transparency or JPG for a white background, and download. It all happens in your browser.",
      },
      {
        question: "What size should a signature image be?",
        answer:
          "Most platforms accept signatures around 500×200 px or 800×250 px at 150–300 DPI. The tool's presets cover the most common sizes, and larger options exist for print-quality documents.",
      },
      {
        question: "How do I make a signature under 20 KB?",
        answer:
          "Select the 20 KB limit and the tool automatically lowers the JPG quality — or shrinks the resolution — until the exported file fits. Clean, simple signatures usually compress below 20 KB easily.",
      },
      {
        question: "How do I make a signature under 50 KB?",
        answer:
          "Select the 50 KB limit. The tool iterates quality and resolution automatically until the file fits the limit, so you never have to fiddle with sliders.",
      },
      {
        question: "Will my signature keep its transparent background?",
        answer:
          "Yes — as long as you export as PNG. Transparent PNGs layer cleanly onto contracts and PDFs. JPG doesn't support transparency, so it fills white instead.",
      },
      {
        question: "Is the signature resizer free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my signatures uploaded to a server?",
        answer:
          "No. All processing happens locally in your browser using the Canvas API — your signature never leaves your device.",
      },
      {
        question: "What formats can I download?",
        answer:
          "PNG (with transparency) and JPG (with a white background). WEBP and HEIC signatures are supported as input and converted automatically.",
      },
      {
        question: "Why is my signature file still larger than the limit?",
        answer:
          "Very complex signatures (lots of detail or color) can't always reach tiny limits like 20 KB. The tool gets as close as possible by lowering quality and resolution.",
      },
      {
        question: "Can I resize a signature I drew on my phone?",
        answer:
          "Yes. Upload the image from your phone — including iPhone HEIC files, which are decoded automatically — and resize it to any preset.",
      },
      {
        question: "Does the tool work on mobile?",
        answer:
          "Yes, the tool is fully responsive and works on desktop, tablet, and mobile browsers.",
      },
      {
        question: "Can I use the resized signature in PDF documents?",
        answer:
          "Yes. Export a transparent PNG and insert it into any document or PDF — it will layer cleanly over the page.",
      },
    ],
  },

  "social-media-resizer": {
    meta: { readTime: "5 min read", updated: "July 2026", author: "CompressPix" },
    highlights: [
      "20+ platform presets",
      "Exact pixel dimensions",
      "Drag & zoom to frame",
      "JPG · PNG · WEBP",
      "100% browser-based",
    ],
    intro: {
      heading: "Social Media Image Resizer — Perfect Sizes for Every Platform",
      paragraphs: [
        "The Social Media Image Resizer outputs photos at the exact pixel dimensions each platform expects — Instagram square posts and stories, YouTube thumbnails and channel art, Facebook covers, X headers, LinkedIn banners, Pinterest pins, and TikTok covers.",
        "Pick a preset, drag to frame the part of your photo you want, and download. With 20+ presets covering the dimensions that change every time the platforms update, your images will never get awkwardly cropped or rejected again. Everything runs in your browser.",
      ],
    },
    benefits: [
      {
        title: "20+ Exact Presets",
        description: "Instagram, YouTube, Facebook, X, LinkedIn, Pinterest, and TikTok — all official dimensions.",
      },
      {
        title: "No More Awkward Crops",
        description: "Frame your photo precisely with drag and zoom before it's resized to the platform ratio.",
      },
      {
        title: "Multiple Export Formats",
        description: "Download as JPG, PNG, or WEBP with an adjustable quality slider.",
      },
      {
        title: "100% Private",
        description: "Everything is processed locally in your browser — nothing is uploaded anywhere.",
      },
    ],
    features: [
      {
        title: "Instagram Presets",
        description: "Square 1080×1080, portrait 1080×1350, landscape 1080×566, stories & reels 1080×1920, profile 320×320.",
      },
      {
        title: "YouTube Presets",
        description: "Thumbnail 1280×720, channel art 2560×1440, and profile photo 800×800.",
      },
      {
        title: "Facebook Presets",
        description: "Cover 851×315, profile 170×170, share post 1200×630, event cover 1920×1080, and stories.",
      },
      {
        title: "X & LinkedIn Presets",
        description: "X header 1500×500 and in-stream 1600×900; LinkedIn banner 1584×396 and post 1200×627.",
      },
      {
        title: "Pinterest & TikTok",
        description: "Standard pin 1000×1500 and TikTok video/cover 1080×1920.",
      },
      {
        title: "Drag & Zoom Framing",
        description: "Position your subject inside the platform ratio with drag-to-pan and scroll-to-zoom.",
      },
    ],
    howTo: {
      heading: "How to Resize an Image for Social Media",
      description: "Get the perfect size for any platform in three simple steps.",
      steps: [
        {
          name: "Upload your image",
          text: "Drag and drop, browse, or paste your photo — JPG, PNG, WEBP, or HEIC.",
        },
        {
          name: "Pick a platform preset",
          text: "Choose Instagram post, YouTube thumbnail, Facebook cover, or any of 20+ presets with exact dimensions.",
        },
        {
          name: "Frame & download",
          text: "Drag and zoom to frame your subject, pick a format and quality, then download at the exact preset size.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I resize an image for Instagram?",
        answer:
          "Choose the Instagram preset you need — Square Post (1080×1080), Portrait (1080×1350), Landscape (1080×566), or Story/Reel (1080×1920) — frame your photo, and download. It's resized to the exact dimensions instantly.",
      },
      {
        question: "What is the best YouTube thumbnail size?",
        answer:
          "1280×720 pixels is the recommended YouTube thumbnail size — the YouTube Thumbnail preset produces exactly this, which displays crisp on all devices.",
      },
      {
        question: "What size is a Facebook cover photo?",
        answer:
          "Facebook cover photos display best at 851×315 pixels on desktop. The Facebook Cover preset produces exactly this size, so it won't be cropped.",
      },
      {
        question: "What size is a LinkedIn banner?",
        answer:
          "LinkedIn company pages use 1584×396 pixels for their banner. The LinkedIn Banner preset produces exactly this size.",
      },
      {
        question: "What size is a Twitter/X header photo?",
        answer:
          "The X (Twitter) header photo is 1500×500 pixels. The X Header preset produces exactly this size.",
      },
      {
        question: "What size is an Instagram story?",
        answer:
          "Instagram stories and reels are 1080×1920 pixels (9:16). The Instagram Story / Reel preset produces exactly this size.",
      },
      {
        question: "Can I resize an image without losing quality?",
        answer:
          "The tool crops and resizes to the preset resolution with high-quality smoothing. For maximum quality, export as PNG (lossless) — or keep JPG/WEBP with the quality slider at 100%.",
      },
      {
        question: "Can I crop my image to the right ratio?",
        answer:
          "Yes. The preset's aspect ratio frames your photo automatically — drag to reposition your subject and zoom to fill the frame before downloading.",
      },
      {
        question: "Is the social media resizer free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All resizing happens locally in your browser — your images never leave your device.",
      },
      {
        question: "What output formats are supported?",
        answer:
          "JPG, PNG, and WEBP, with a quality slider for JPG and WEBP. PNG keeps transparency for logos and graphics.",
      },
      {
        question: "Can I resize an iPhone HEIC photo?",
        answer:
          "Yes, HEIC and HEIF files from iPhones are decoded automatically before resizing.",
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
