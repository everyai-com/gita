"""Merges the per-chapter learning content in content/out/ into public/data/lessons.json.

Usage: python3 -I scripts/build-lessons.py
"""
import glob, json, os

root = os.path.join(os.path.dirname(__file__), "..")
simple, lessons, missing = {}, {}, []
for path in sorted(glob.glob(os.path.join(root, "content", "out", "ch-*.json"))):
    ch = json.load(open(path, encoding="utf-8"))
    inp = json.load(open(path.replace(os.sep + "out" + os.sep, os.sep + "input" + os.sep), encoding="utf-8"))
    for v in inp["verses"]:
        s = ch["verses"].get(v["ref"], {}).get("simple", "").strip()
        if s:
            simple[v["ref"]] = s
        else:
            missing.append(v["ref"])
    for l in ch["lessons"]:
        a = l["apply"]
        assert len(a["options"]) == 4 and 0 <= a["answer"] < 4, l["id"]
        lessons[l["id"]] = {k: l[k] for k in ("title", "teaching", "keyIdea", "apply", "reflect", "practice")}

dest = os.path.join(root, "public", "data", "lessons.json")
json.dump({"simple": simple, "lessons": lessons}, open(dest, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(simple)} verse explanations, {len(lessons)} lessons, {len(missing)} missing", missing[:10])
