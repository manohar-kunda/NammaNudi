# NammaNudi Transliteration Style Guide (v3)

This style guide establishes consistent Roman transliteration across all NammaNudi datasets based on the empirical audit of the existing 120 phrases in `/data/phrases.json`.

---

## 1. Core Principles from Existing Data Audit

| Sound / Concept | Standard Choice | Audit Frequency in Data | Examples in Data |
|---|---|---|---|
| **Existence ("is/there is")** | **`idhe`** | 35 matches (0 for `ide`) | `Bus stop elli idhe?`, `Nanage thale novu idhe.` |
| **Question existence ("is it there?")** | **`idhya`** | 15 matches (0 for `ideya`) | `Online payment / UPI idhya?`, `Bisi neeru idhya?` |
| **Where is?** | **`elli idhe?`** (separated) | 11 matches (1 for `ellidhe`, 0 for `ellide`) | `Metro station elli idhe?`, `Trial room elli idhe?` |
| **Very / Much** | **`thumba`** | 10 matches (0 for `thumpa`) | `Thumba dhanyavaadha.`, `Bele thumba jaasthi aaythu.` |
| **Honorific / Sir** | **`sir`** (addressing) / **`saar`** (in driver quotes) | 20 `sir`, 6 `saar` | `Namaskara sir, chennaagiddhira?`, `Ellige hogbeku saar?` |
| **Dental stops (`ತ`, `ದ`, `ಥ`, `ಧ`)** | **`th` / `dh`** | Uniformly dominant | `thale`, `maathre`, `raathri`, `ondhu`, `dhaari` |
| **Retroflex stops (`ಟ`, `ಡ`)** | **`t` / `d`** | Uniformly dominant | `oota`, `hotte`, `doddadhu`, `kodu`, `bidi` |
| **Doubled third-person future (`-ತ್ತೆ`)** | **`-uththe`** | 17 matches (0 for `-utte`) | `Eshtu aaguththe?`, `late aaguththe`, `open aaguththe` |
| **Doubled past/present stem (`-ದ್ದ-`)** | **`-ddh-`** | 21 matches | `iddhini`, `hegiddhira`, `maadiddhakke`, `chennaagiddhira` |
| **Case suffixes on loanwords** | **Hyphenated** (`-ge`, `-nalli`, `-inda`) | Uniform | `Silk Board-ge`, `app-nalli`, `room-nalli`, `call-nalli` |
| **English loanwords in Roman translit** | **Standard capitalization & spelling** | Uniform | `UPI`, `PhonePe`, `Metro`, `Bus stop`, `Trial room`, `X-ray` |

---

## 2. Mandatory Rules for All New Content (v3)

1. **`idhe` and `idhya`**: Always use `idhe` for "ಇದೆ" and `idhya` for "ಇದ್ಯಾ". Never write `ide` or `ideya`.
2. **`elli idhe?`**: Always write two words with a space: `elli idhe?` (e.g. `ATM elli idhe?`, `Lift elli idhe?`).
3. **`thumba`**: Always spell `thumba` for "ತುಂಬಾ". Never spell `thumpa`.
4. **Loanword Suffixes**: Attach Kannada case markers with a hyphen to Latin/English roots:
   - Dative: `-ge` (e.g. `Majestic-ge`, `canteen-ge`, `counter-ge`)
   - Locative: `-nalli` / `-alli` (e.g. `kitchen-nalli`, `apartment-nalli`)
   - Instrumental/Ablative: `-indha` (e.g. `lift-indha`)
5. **Verbal Endings**:
   - Polite imperative: `-i` / `-ri` (e.g. `kodi`, `banni`, `heli`, `nodi`, `keli`)
   - First-person continuous/stative: `-iddhini` / `-thiddhini` (e.g. `iddhini`, `maadthiddhini`)
   - Third-person neuter habitual: `-uththe` (e.g. `aaguththe`, `siguththe`, `baruththe`)
6. **English Loanwords in Kannada Script**:
   - Write using standard colloquial spoken orthography (e.g. `ಮೀಟರ್`, `ಆಟೋ`, `ಲಿಫ್ಟ್`, `ಫ್ಲ್ಯಾಟ್`, `ಪಾರ್ಕಿಂಗ್`, `ಮ್ಯಾನೇಜರ್`).

---

## 3. Discrepancies in Existing Data for Reviewer Decision

The following subtle variations exist in legacy `data/phrases.json` and are flagged for native-speaker reviewer confirmation:
1. **`sir` vs `saar`**:
   - Legacy phrases use `sir` in 20 polite customer prompts (e.g. `L10: Namaskara sir`, `L101: Sir, nimage swalpa English baruthaa?`) and `saar` in 6 auto driver / shopkeeper turns (e.g. roleplay `Ellige hogbeku saar?`).
   - *Recommendation for v3*: Keep `sir` for general polite address in modern urban contexts, but permit `saar` when quoting working-class colloquial speech.
2. **Single vs Double Vowels in Verb Stems**:
   - `L1153` has `barabeku` while `L1092` has `hogbeku`. Both are common in spoken Kannada (`ಬರಬೇಕು` vs `ಹೋಗ್ಬೇಕು`).
3. **`ellidhe` (L36) vs `elli idhe` (11 other occurrences)**:
   - `L36` writes compound `ee address ellidhe?`. All other occurrences write `elli idhe?`. v3 standardizes on `elli idhe?`.
4. **`ivathu` (single `th`) vs `ivaththu` / `Ivaththina` (doubled dental `thth` for `ಇವತ್ತು`)**:
   - `data/phrases.json` (L179, L387, L617, L621), `data/quiz.json` (L218), `data/roleplay.json` (L73, L86, L137, L150, L558, L609), and `frontend/src/data/phrases-extra.json` (L318, L322) write `ivathu` / `ivathindhaa` / `nooraivathu`.
   - `docs/review/content_review_pack.csv` (`rest-14`) writes `Ivaththina` (geminate `thth`).
   - In `words.json`, `word-ivathu` has been standardized to translit `ivaththu` to align with the geminate dental convention (`-uththe`, `Ivaththina`).
   - *Reviewer Decision*: Standardize all occurrences across the catalog to either `ivaththu` (phonetically accurate geminate) or `ivathu` (simplified informal).
5. **`hathu` (single `th`) vs `haththu` (doubled `thth` for `ಹತ್ತು` - 10)**:
   - `data/quiz.json` (L108) and `words.json` (L777) use `haththu`.
   - Legacy review CSV (`basic-12`, `work-12`, `work-18`) writes `hathu`.
   - *Reviewer Decision*: Standardize the numeral 10 to `haththu` or `hathu`.
6. **`ippathu` (single `th`) vs `ippaththu` (doubled `thth` for `ಇಪ್ಪತ್ತು` - 20)**:
   - `data/roleplay.json` (L41) uses `ippathu`.
   - `words.json` (L162, L197) uses `ippaththu`.
   - *Reviewer Decision*: Standardize 20 to `ippaththu` or `ippathu`.
7. **`mathu` (single `th`) vs `matthu` (doubled `thth` for `ಮತ್ತು` - and)**:
   - `data/phrases.json` (L344, L370, L647), `data/roleplay.json` (L180, L314, L550), and `words.json` (L748) universally write `mathu` (single `th`).
   - *Reviewer Decision*: Confirm whether the conjunction `ಮತ್ತು` should remain simplified `mathu` or be geminated to `matthu`.
8. **`mathe` (single `th`) vs `maththe` (doubled `thth` for `ಮತ್ತೆ` - again)**:
   - `frontend/src/data/phrases-extra.json` (L500, L504) and legacy `health-20` write `mathe`.
   - *Reviewer Decision*: Standardize to `mathe` or `maththe`.
9. **`gottu` (`tt`) vs `gotthu` (`tth`) vs `gothu` (`th`) for `ಗೊತ್ತು` / `ಗೊತ್ತಿಲ್ಲ`**:
   - `data/roleplay.json` (L362) has `Gotthilla`.
   - `words.json` (L556, L568, L574) uses `gottu` / `gottaa`.
   - Legacy review CSV has `gothaaglilla`.
   - *Reviewer Decision*: Standardize whether `ಗೊತ್ತು` should be transliterated as `gottu` (informal phonetic), `gotthu` (dental geminate), or `gotthilla` / `gothilla`.
10. **Past tense / past copula `-ithu` vs `-iththu` (`ಇತ್ತು`, `ಬೇಕಿತ್ತು`, `ಬೇಕಾಗಿತ್ತು`, `ಚೆನ್ನಾಗಿತ್ತು`)**:
    - `data/phrases.json` (L309, L422, L426, L435, L439, L643) use `ithu`, `bekithu`, `bekaagithu`, `chennaagithu` (single `th`).
    - *Reviewer Decision*: Confirm keeping single `th` or geminating to `iththu`, `bekiththu`, `chennaagiththu`.
