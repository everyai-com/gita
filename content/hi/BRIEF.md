# Original Hindi translation brief

Goal: an ORIGINAL Hindi meaning for every verse, owned by the app, so we no longer ship Swami Tejomayananda's copyrighted Hindi.

Source to translate FROM: the `en` field (Swami Sivananda, public domain) of each verse in `public/data/gita.json`.
Use the Sanskrit `sa` and word meanings `wm` only to check accuracy of names and terms.
NEVER read, open, quote or paraphrase the existing `hi` field or `summaryHi` in gita.json (load JSON with code and skip those keys). Write fresh.

Style:
- Clear, modern, respectful Hindi (Devanagari), like a careful translation for a general reader. Not Sanskritised jargon, not slang.
- Keep the speaker prefix in Hindi when the English has one: "संजय ने कहा:", "अर्जुन ने कहा:", "श्रीभगवान ने कहा:", "धृतराष्ट्र ने कहा:".
- Proper nouns in their usual Hindi spelling (अर्जुन, कृष्ण, भीष्म, पाण्डव, कुरुक्षेत्र, योग, धर्म, कर्म, ब्रह्म).
- One verse's meaning only; no commentary. Roughly the same length as the English.

Chapter summary: write a NEW ~100-140 word English summary of the chapter's teaching in your own words (do not open or paraphrase the existing `summary`), plus its Hindi version.

Output: `content/hi/ch-XX.json` (XX two-digit), UTF-8, exactly:
{"chapter": N, "summary": "<English>", "summaryHi": "<Hindi>", "verses": {"1": "<Hindi>", "2": "...", ...}}
Every verse number of the chapter must be present (check against the chapter's verses in gita.json). Validate with python3 that the file parses and the count matches.
