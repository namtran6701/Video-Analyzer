"""Generate one Lyria 3.5 track through the Gemini API (not available on the Vertex MCP).

usage: python3 -I lyria.py "<prompt>" <out.wav>
Reads GEMINI_API_KEY from the environment or the nearest .env above the working directory.
"""
import base64, json, os, pathlib, sys, urllib.error, urllib.request


def api_key():
    if os.environ.get("GEMINI_API_KEY"):
        return os.environ["GEMINI_API_KEY"]
    for d in [pathlib.Path.cwd(), *pathlib.Path.cwd().parents]:
        env = d / ".env"
        if env.exists():
            for line in env.read_text().splitlines():
                if line.startswith("GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit("GEMINI_API_KEY not found")


prompt, out = sys.argv[1], pathlib.Path(sys.argv[2])
body = {
    "contents": [{"parts": [{"text": prompt}]}],
    "generationConfig": {"responseModalities": ["AUDIO", "TEXT"], "responseFormat": {"audio": {"mimeType": "AUDIO_WAV"}}},
}
req = urllib.request.Request(
    "https://generativelanguage.googleapis.com/v1beta/models/lyria-3.5:generateContent",
    data=json.dumps(body).encode(),
    headers={"x-goog-api-key": api_key(), "Content-Type": "application/json"},
)
try:
    resp = json.load(urllib.request.urlopen(req, timeout=600))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")
for part in resp["candidates"][0]["content"]["parts"]:
    if "inlineData" in part:
        out.write_bytes(base64.b64decode(part["inlineData"]["data"]))
        print(out, part["inlineData"].get("mimeType"))
    elif part.get("text"):
        print(part["text"][:300])
