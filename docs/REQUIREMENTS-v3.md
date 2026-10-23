# REQUIREMENTS-v3 Specification: Content Expansion & Words Feature

## Goal
Help people new to Karnataka understand and USE spoken Kannada correctly in real situations. Quality and correctness matter more than quantity.

---

## SPEC

### A. New Categories (Scenarios)
Add 4 new categories (about 10 phrases each, adhering strictly to the existing phrase format: `id`, `scenario`, `kn`, `translit`, `en`, `example: {kn, translit, en}`, `reviewed: false`):
1. **Directions & Landmarks** (`directions`)
2. **Numbers, Money & Time** (`numbers-time`)
3. **Home & Neighbours** (`home-neighbours`)
4. **Greetings & Social** (`greetings-social`)
*(No Emergency category).*

### B. New "Words" Feature
Add 30 to 40 core spoken Kannada words. Each word entry has the following shape:
```json
{
  "id": "word-kodi",
  "kn": "ಕೊಡಿ",
  "translit": "kodi",
  "en": "please give",
  "type": "verb",
  "purpose": "Politely asking someone to hand over or serve something.",
  "where": ["restaurant", "shop", "market"],
  "when": "Whenever you order or ask for something from another person.",
  "register": "polite",
  "tip": "Add 'kodi' after the thing you want.",
  "dialogue": [
    {
      "speaker": "Customer",
      "kn": "ಒಂದು ಕಪ್ ಕಾಫಿ ಕೊಡಿ.",
      "translit": "Ondhu cup coffee kodi.",
      "en": "Please give one cup of coffee."
    },
    {
      "speaker": "Server",
      "kn": "ಆಯ್ತು ಸಾರ್, ಎರಡು ನಿಮಿಷ.",
      "translit": "Aaythu saar, eradu nimisha.",
      "en": "Okay sir, two minutes."
    }
  ],
  "mistake": "Using 'kodu' with elders or service staff sounds abrupt; use 'kodi' to show respect.",
  "related": ["shop-05", "rest-02"],
  "reviewed": false
}
```

Field requirements:
- `id`: unique identifier (`word-*`)
- `kn`: Kannada script
- `translit`: Roman transliteration
- `en`: English meaning
- `type`: `"noun"` | `"verb"` | `"phrase"` | `"particle"`
- `purpose`: what it is used for (one sentence)
- `where`: typical places array (e.g., `["auto", "market", "clinic", "office", "home"]`)
- `when`: typical moments (one sentence)
- `register`: `"polite"` | `"casual"` | `"both"`
- `tip`: one-line politeness tip
- `dialogue`: 2 to 3 turns of a short real conversation (`kn`, `translit`, `en`, `speaker`)
- `mistake` (optional): common beginner mistake and how to avoid it
- `related`: array of IDs of related words or phrases
- `reviewed`: strictly `false`

### C. UI Requirements (Reusing existing colors, fonts, icons, components)
- **New "Words" Screen**:
  - Reachable from main navigation and/or Home screen.
  - Search input (debounced).
  - Filter by place (`where`).
- **Word Card**:
  - Word display (large Kannada script), transliteration, English meaning.
  - Labeled sections: *"Used for"*, *"Where"*, *"When"*, *"Politeness"*, and *"Example conversation"*.
  - Speaker buttons on the head word and each dialogue line using `useSpeech` and its existing fallback behavior.
  - Bookmark / save-word button integrated with existing saved items storage.
- **New Categories**: Appear on Home screen along with existing scenarios.

### D. Content Rules (Strict)
- Natural spoken contemporary Kannada (not literary or literal translations).
- Every new item has `reviewed: false`. Never set `reviewed: true`.
- Transliteration consistency: Audit existing data first and report inconsistencies (e.g. `ide` vs `idhe`, `ideya` vs `idhya`). Maintain single uniform transliteration convention.
- All uncertain phrases or words must be listed in `/docs/REVIEW_FLAGS.md` with explicit reasons.

### E. Technical Constraints
- Work on branch `content-v3`. Never commit or push to `main`.
- Store the new data directly in the frontend as JSON files (`frontend/src/data/`), so it is bundled directly by Vite and works offline automatically without touching `/backend`, `sw.js`, or cache versions.
- Do not add any new dependencies.
- Extend `data/tools/export-review.js` so new items export to CSV with `batch: "v3"`.

### F. Acceptance Criteria
- All new items render responsively at 390px and 1280px.
- Search and place filtering function smoothly.
- Audio synthesis speaker buttons work with existing `useSpeech` hook.
- Offline reload works seamlessly after initial visit.
- `npm.cmd run build` passes with zero errors.
- Existing screens remain unchanged.
- Validation script verifies required fields and ID uniqueness.
