# 3D Asset License — `ai-bot.glb`

Used on the **AI Mock Interview** landing page (`/ai-mock-interview`) as the 3D AI interviewer in the hero.

## Asset details

| Field            | Value |
| ---------------- | ----- |
| **Title**        | Cute Robot Mascot |
| **Author**       | hoangvt1403 ([Sketchfab profile](https://sketchfab.com/hoangvt140399)) |
| **Source**       | <https://sketchfab.com/3d-models/cute-robot-mascot-2b3c7c0b2bce4f0e813c4d85221ea17d> |
| **License**      | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| **Commercial use** | Permitted (with attribution) |
| **Modifications**  | Permitted — re-framed, scaled and re-lit for the hero composition; no geometry changes |
| **Local copy**   | `public/models/ai-bot.glb` (~4.7 MB, 6 meshes, ~34k verts, no animation clips) |

## Attribution

> "Cute Robot Mascot" by hoangvt1403 is licensed under CC BY 4.0.

Attribution is shown in the UI (caption beneath the hero 3D stage) and referenced in `features/ai-interview/components/interview/3d/AIAvatarModel.tsx`.

## Usage notes

- The model ships without animation clips, so state-driven motion (float, sway, emissive glow, orbital ring) is applied procedurally in `AIAvatarModel.tsx`.
- The glTF is lazy-loaded (`dynamic(ssr:false)`) so it never blocks first paint; a CSS avatar overlay covers the stage while it streams in.
- If this asset is ever replaced, update this file and the UI caption.
