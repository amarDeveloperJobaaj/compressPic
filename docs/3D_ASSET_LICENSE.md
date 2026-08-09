# 3D Asset License — `ai-bot2.glb`

Used on the **AI Mock Interview** landing page (`/ai-mock-interview`) as the 3D AI interviewer in the hero.

## Asset details

| Field            | Value |
| ---------------- | ----- |
| **Title**        | AI Kitchen 🧪 just a bit fun |
| **Author**       | smice ([Sketchfab profile](https://sketchfab.com/smice)) |
| **Source**       | <https://sketchfab.com/3d-models/ai-kitchen-just-a-bit-fun-afa0ca2339c14ff68c69b79db205690a> |
| **License**      | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| **Commercial use** | Permitted (with attribution) |
| **Modifications**  | Permitted — re-framed, scaled and re-lit for the hero composition; no geometry changes |
| **Local copy**   | `public/models/ai-bot2.glb` (~4.1 MB, 1 skinned mesh, ~8.9k verts, 1 walk animation clip) |

## Attribution

> "AI Kitchen 🧪 just a bit fun" by smice is licensed under CC BY 4.0.

Attribution is shown in the UI (caption beneath the hero 3D stage) and referenced in `features/ai-interview/components/interview/3d/AIAvatarModel.tsx`.

## Usage notes

- The model ships with a walking animation loop, which the hero plays at a calmer pace (`timeScale 0.75`) via drei's `useAnimations`. Because the mesh is skinned, the cached scene is used directly (a plain deep-clone would break the skeleton binding).
- Procedural motion (float, sway, emissive glow, aura halo, orbital ring) is layered on top in `AIAvatarModel.tsx`.
- The glTF is lazy-loaded (`dynamic(ssr:false)`) so it never blocks first paint; a CSS avatar overlay covers the stage while it streams in.
- If this asset is ever replaced, update this file and the UI caption.
