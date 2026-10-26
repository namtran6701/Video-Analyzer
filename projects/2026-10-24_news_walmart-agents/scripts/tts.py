import base64, json, pathlib, sys, urllib.request

root = pathlib.Path(__file__).resolve().parents[3]
key = next(l.split("=", 1)[1].strip().strip('"\'') for l in (root / ".env").read_text().splitlines() if l.startswith("GEMINI_API_KEY="))
text = " ".join(pathlib.Path(sys.argv[1]).read_text().split("\n")).strip()
body = {
    "contents": [{"role": "user", "parts": [{"text": text, "speech_metadata": {"style": "dry, deadpan tech news narrator, brisk pace, flat delivery"}}]}],
    "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"voice": "en-us-podcaster-4"}}},
}
req = urllib.request.Request(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent",
    data=json.dumps(body).encode(), headers={"x-goog-api-key": key, "Content-Type": "application/json"})
try:
    resp = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")
part = resp["candidates"][0]["content"]["parts"][0]["inlineData"]
pathlib.Path(sys.argv[2]).write_bytes(base64.b64decode(part["data"]))
print(part.get("mimeType"))
