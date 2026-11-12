---
name: claude-animation-base
description: Starter kit to make hand-painted 2D character animations (Clawd) with p5.js + p5.brush, rendered to MP4 with headless Chrome and ffmpeg. Use when the user asks for a painted/hand-drawn character animation video with this kit.
---

# Claude Animation Base

The kit lives in `kit/` next to this file (source: ClaudeAnimationBase, MIT).

1. Copy `kit/` into a new working folder `projetos/<nome>` in this repository (or another folder outside app repositories); never edit `kit/` itself.
2. Read `ANIMATION_GUIDE.md` in that folder and follow its workflow (storyboard first, build shot by shot, check contact sheets).
3. Put the scene in `src/scenes/`, run `npm install`, then `node render.mjs --clip --out=out/video.mp4` (needs Node, Chrome/Chromium and ffmpeg; on this Linux container pass `--chrome=/opt/pw-browsers/chromium` if not auto-found, and `--soft-gl` without GPU).
