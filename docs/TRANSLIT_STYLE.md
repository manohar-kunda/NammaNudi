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
