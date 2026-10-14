# Original word-by-word meanings brief

Goal: ORIGINAL English glosses for every Sanskrit word of every verse, so we no longer ship
the copyrighted glosses (Swami Mukundananda, holy-bhagavad-gita.org) that came with the dataset.

In `public/data/gita.json` each verse has `wm`: a list of [sanskritWord, gloss] pairs.
- KEEP the Sanskrit words and their order exactly (the word list is factual).
- Write a NEW gloss for each word yourself, from your own knowledge of Sanskrit, using the verse's
  Sanskrit `sa` and the public-domain English `en` (Sivananda) for context.
- NEVER read, print or paraphrase the existing gloss (index 1 of each `wm` pair). Load with code and
  only print `wm[i][0]`, `sa`, `en`.

Style: short, plain dictionary-style glosses (1-5 words), lower case unless a proper noun,
grammatical sense where it helps ("of the senses", "having seen", "O Arjuna"). Vocatives as "O ...".
For names give the name plus a hint when useful ("Hrishikesha (Krishna)").

Output `content/wm/ch-XX.json` (two-digit XX), UTF-8:
{"chapter": N, "verses": {"1": ["gloss for word 1", "gloss for word 2", ...], "2": [...], ...}}
Each verse's list must have exactly as many glosses as that verse's `wm` list, none empty.
Validate with python3 before finishing.
