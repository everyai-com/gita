"""Builds public/data/gita.json from the public-domain gita/gita dataset.

Usage: python3 -I scripts/build-data.py <dir with verse.json, translation.json, chapters.json>
"""
import json, re, sys, os

src = sys.argv[1]
load = lambda n: json.load(open(os.path.join(src, n), encoding="utf-8"))
verses, translations, chapters = load("verse.json"), load("translation.json"), load("chapters.json")

AUTHORS = {"Swami Sivananda": "en", "Shri Purohit Swami": "en2", "Swami Tejomayananda": "hi"}
by_verse = {}
for t in translations:
    key = AUTHORS.get(t["authorName"])
    if key:
        by_verse.setdefault(t["verse_id"], {})[key] = t["description"]

CONSONANT = "[\u0915-\u0939\u0958-\u095f]"

def fix_devanagari(s):
    # Legacy typing put a vowel sign before its consonant: "श्िच" should be "श्चि".
    s = re.sub("\u094d([\u093e-\u094c])(" + CONSONANT + ")", "\u094d\\2\\1", s)
    s = s.replace("प्रस्ेाद", "प्रसाद")  # one-off typo in 2.64 (Hindi)
    # Doubled vowel signs ("ेे", "ाा") are typos.
    return re.sub("([\u093e-\u094c])\\1", "\\1", s)

def clean_text(s):
    s = fix_devanagari(s)
    s = re.sub(r"[।|]{1,2}\s*\d+\.\d+\s*[।|]{1,2}", "", s)  # verse numbering like ।।1.1।।
    s = re.sub(r"\(टिप्पणी[^)]*\)", "", s)
    lines = [l.strip() for l in s.strip().split("\n")]
    return "\n".join(l for l in lines if l)

def clean_translation(s):
    # The dataset contains a few editing leftovers ("No changes needed.", "Revised:").
    s = clean_text(s)
    if s.lower().startswith("no changes needed"):
        return ""
    return re.sub(r"^Revised:\s*", "", s)

def word_meanings(s):
    out = []
    for part in s.strip().split(";"):
        if "—" in part:
            w, m = part.split("—", 1)
            if w.strip() and m.strip():
                out.append([w.strip(), m.strip()])
    return out

out_verses = []
for v in sorted(verses, key=lambda x: (x["chapter_number"], x["verse_number"])):
    t = by_verse.get(v["id"], {})
    out_verses.append({
        "c": v["chapter_number"], "v": v["verse_number"],
        "sa": clean_text(v["text"]),
        "tr": clean_text(v["transliteration"]),
        "wm": word_meanings(v["word_meanings"]),
        "en": clean_text(t.get("en", "")),
        "en2": clean_translation(t.get("en2", "")),
        "hi": clean_text(t.get("hi", "")),
    })

out_chapters = [{
    "n": c["chapter_number"], "name": c["name"], "translit": c["name_transliterated"],
    "title": c["name_meaning"], "count": c["verses_count"],
    "summary": c["chapter_summary"].strip(), "summaryHi": c["chapter_summary_hindi"].strip(),
} for c in sorted(chapters, key=lambda x: x["chapter_number"])]

dest = os.path.join(os.path.dirname(__file__), "..", "public", "data", "gita.json")
with open(dest, "w", encoding="utf-8") as f:
    json.dump({"chapters": out_chapters, "verses": out_verses}, f, ensure_ascii=False, separators=(",", ":"))
print(len(out_verses), "verses,", os.path.getsize(dest) // 1024, "KB")
