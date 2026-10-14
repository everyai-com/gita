"""Merges the app's own Hindi translation (content/hi/ch-XX.json) into public/data/gita.json.

Replaces each verse's `hi` and each chapter's `summary` / `summaryHi`, so no third-party
Hindi or chapter-summary text ships. Fails loudly if any verse is missing.

Usage: python3 -I scripts/apply-hindi.py
"""
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
data_path = root / "public/data/gita.json"
gita = json.loads(data_path.read_text())

for ch in gita["chapters"]:
    n = int(ch["n"])
    src = json.loads((root / f"content/hi/ch-{n:02d}.json").read_text())
    verses = [v for v in gita["verses"] if int(v["c"]) == n]
    missing = [v["v"] for v in verses if not src["verses"].get(str(v["v"]), "").strip()]
    if missing:
        raise SystemExit(f"Chapter {n}: missing Hindi for verses {missing}")
    for v in verses:
        v["hi"] = src["verses"][str(v["v"])].strip()
    ch["summary"] = src["summary"].strip()
    ch["summaryHi"] = src["summaryHi"].strip()

data_path.write_text(json.dumps(gita, ensure_ascii=False, separators=(",", ":")))
print(f"Applied original Hindi to {len(gita['verses'])} verses and {len(gita['chapters'])} chapters.")

# Word-by-word meanings: keep the Sanskrit word list, use the app's own glosses (content/wm).
for ch in gita["chapters"]:
    n = int(ch["n"])
    src = json.loads((root / f"content/wm/ch-{n:02d}.json").read_text())["verses"]
    for v in (v for v in gita["verses"] if int(v["c"]) == n):
        glosses = src.get(str(v["v"]), [])
        if len(glosses) != len(v["wm"]) or not all(g.strip() for g in glosses):
            raise SystemExit(f"{n}.{v['v']}: expected {len(v['wm'])} glosses, got {len(glosses)}")
        v["wm"] = [[w, g.strip()] for (w, _), g in zip(v["wm"], glosses)]

data_path.write_text(json.dumps(gita, ensure_ascii=False, separators=(",", ":")))
print("Applied original word meanings.")
