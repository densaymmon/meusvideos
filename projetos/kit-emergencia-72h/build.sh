#!/bin/sh
# One command: Kit 72 h (Instruction Manual Art), 1080×1920, 30 fps.
#   LIB = the Lemo-Opuscar library (sh .claude/skills/lemo-opuscar/scripts/setup.sh prints it). Needs ffmpeg 7+ on PATH.
#   VOICE=1 sh build.sh   regenerates the narration (Kokoro pf_dora)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; SIZE=1080x1920; FPS=30
cd "$LIB"
mkdir -p "$HERE/out"
"$PY" core/audio/sampler.py --need "$HERE/mix.py"
if [ "${VOICE:-0}" = "1" ] || [ ! -f "$HERE/vo/h.wav" ]; then "$PY" core/tts/tts.py "$HERE/vo/lines.json" "$HERE/vo"; fi
"$PY" "$HERE/tools/timeline.py"
"$PY" core/render/srt.py "$HERE/out/cues.json" "$HERE/kit-emergencia-72h.srt"
node core/render/events.mjs "$HERE" --size $SIZE
node core/render/readcheck.mjs "$HERE" --size $SIZE > "$HERE/out/readcheck.txt"
node core/render/video.mjs "$HERE" --fps $FPS --workers ${WORKERS:-3} --size $SIZE --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/kit-emergencia-72h.mp4" $FPS 1
ffmpeg -v error -y -ss 29.9 -i "$HERE/kit-emergencia-72h.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done: $HERE/kit-emergencia-72h.mp4"
