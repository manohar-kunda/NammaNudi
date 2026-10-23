# NammaNudi Transliteration Style Guide (v3)

This style guide establishes consistent Roman transliteration across all NammaNudi datasets based on the empirical audit of existing phrases in `/data/phrases.json` and `/data/roleplay.json`.

---

## 1. Core Principles from Existing Data Audit

| Sound / Concept | Standard Choice | Audit Frequency in Data | Examples in Data |
|---|---|---|---|
| **Existence ("is/there is")** | **`idhe`** | 35 matches (0 for `ide`) | `Bus stop elli idhe?`, `Nanage thale novu idhe.` |
| **Question existence ("is it there?")** | **`idhya`** | 15 matches (0 for `ideya`) | `Online payment / UPI idhya?`, `Bisi neeru idhya?` |
| **Where is?** | **`elli idhe?`** (separated) | 11 matches (1 for `ellidhe`, 0 for `ellide`) | `Metro station elli idhe?`, `Trial room elli idhe?` |
| **Very / Much** | **`thumba`** | 10 matches (0 for `thumpa`) | `Thumba dhanyavaadha.`, `Bele thumba jaasthi aaythu.` |
| **Honorific / Sir** | **`sir`** (addressing) / **`saar`** (in driver quotes) | 20 `sir`, 6 `saar` | `Namaskara sir, chennaagiddhira?`, `Ellige hogbeku saar?` |
| **Dental stops (`ತ`, `ದ`, `ಥ`, `ಧ`)** | **`th` / `dh`** (single `th` dominant) | Uniformly dominant | `thale`, `ivathu`, `hathu`, `ippathu`, `mathu`, `mathe` |
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
4. **Single `th` for Dental Words (`ivathu`, `hathu`, `ippathu`, `mathu`, `mathe`)**:
   - Spoken majority usage in the existing catalog favors single `th`: `ivathu` (today), `hathu` (ten), `ippathu` (twenty), `mathu` (and), and `mathe` (again).
   - Doubled `thth` is reserved strictly for third-person habitual/future verb endings (`-uththe`: `aaguththe`, `baruththe`, `siguththe`, `iruththe`).
5. **Loanword Suffixes**: Attach Kannada case markers with a hyphen to Latin/English roots:
   - Dative: `-ge` (e.g. `Majestic-ge`, `canteen-ge`, `counter-ge`)
   - Locative: `-nalli` / `-alli` (e.g. `kitchen-nalli`, `apartment-nalli`)
   - Instrumental/Ablative: `-indha` (e.g. `lift-indha`)
6. **Verbal Endings**:
   - Polite imperative: `-i` / `-ri` (e.g. `kodi`, `banni`, `heli`, `nodi`, `keli`)
   - First-person continuous/stative: `-iddhini` / `-thiddhini` (e.g. `iddhini`, `maadthiddhini`)
   - Third-person neuter habitual: `-uththe` (e.g. `aaguththe`, `siguththe`, `baruththe`)
7. **English Loanwords in Kannada Script**:
   - Write using standard colloquial spoken orthography (e.g. `ಮೀಟರ್`, `ಆಟೋ`, `ಲಿಫ್ಟ್`, `ಫ್ಲ್ಯಾಟ್`, `ಪಾರ್ಕಿಂಗ್`, `ಮ್ಯಾನೇಜರ್`).

---

## 3. Leftover Conflicts in Existing Data for Reviewer Decision

The following legacy variations remain in existing `/data/*.json` files and are flagged for native-speaker reviewer decision:
1. **`hathu` vs `Haththu` in Quiz**:
   - `data/quiz.json` (L108) uses `Haththu kilo kodi`, whereas phrases and words use single `th` (`hathu`, `hathu nimisha`).
   - *Reviewer Decision*: Keep single `hathu` across the entire application or adopt `haththu`.
2. **`Gotthilla` in Roleplay vs `gottu / gothu`**:
   - `data/roleplay.json` (L362) writes `Gotthilla, neeve check maadi.` with `tth`.
   - `words.json` and informal dialogues write `gottu` or `gothilla`.
   - *Reviewer Decision*: Decide on a uniform convention: `gottu / gottilla` vs `gotthu / gotthilla` vs `gothu / gothilla`.
3. **`sir` vs `saar`**:
   - Existing phrases use `sir` in polite customer/learner prompts (`Namaskara sir`, `Sir, nimage swalpa English baruthaa?`) and `saar` in driver/server dialogue turns (`Ellige hogbeku saar?`, `Banni saar`).
   - *Reviewer Decision*: Retain `sir` for modern learner prompts and `saar` for authentic working-class speaker turns, or normalize to one.
4. **`ellidhe` (L36) vs `elli idhe`**:
   - `data/phrases.json` (L36) writes compound `ee address ellidhe?`. All other occurrences write two words `elli idhe?`.
   - *Reviewer Decision*: Standardize to two words `elli idhe?`.
