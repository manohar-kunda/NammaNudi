# NammaNudi — Complete Native-Speaker Content Review Pack

This document contains **all user-facing Kannada, transliteration, English translations, pedagogical feedback, role-play ratings, and quiz explanations** in NammaNudi for verification by a native Kannada speaker.

Per project content rules:
- Every phrase starts with `"reviewed": false` in `/data/phrases.json` until verified by a native speaker.
- Target style is **natural, everyday spoken Kannada** used in Karnataka (not stiff textbook prose).
- Healthcare phrases are conversational clinic/pharmacy communication aids, not medical advice.

## Spreadsheet Review & Automated Import Workflow
- **CSV Export (UTF-8 with BOM for Excel / Google Sheets)**: [`docs/review/content_review_pack.csv`](review/content_review_pack.csv)
- **Reviewer Instructions**:
  1. Open `docs/review/content_review_pack.csv` in Excel or Google Sheets.
  2. For each row, set `reviewer_status` to `approved`, `fixed`, or `needs-work`.
  3. If a Kannada script or Roman transliteration needs adjustment, fill in `corrected_kn` and/or `corrected_translit` (and optional `notes`).
  4. Run the review application tool from PowerShell:
     - **Dry run (default, no files modified)**:
       ```powershell
       node data/tools/apply-review.js
       ```
     - **Apply changes to `/data/*.json` and run data integrity checks**:
       ```powershell
       node data/tools/apply-review.js --apply
       ```

---

## Part 1: Situational Phrases & Example Sentences (50 Phrases)

### 1.1 Transport (`transport`)

| ID | Kannada (`kn`) | Transliteration (`translit`) | English (`en`) | Example Sentence (`kn` / `translit` / `en`) | Reviewed | Status / Notes |
|---|---|---|---|---|---|---|
| `trans-01` | ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? | Majestic-ge hogthira? | Will you go to Majestic? | ಅಣ್ಣಾ, ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? <br> *Anna, Majestic-ge hogthira?* <br> "Brother, will you go to Majestic?" | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-02` | ಮೀಟರ್ ಹಾಕಿ, ಪ್ಲೀಸ್. | Meter haaki, please. | Please turn on the meter. | ಮೀಟರ್ ಹಾಕಿ ಹೋಗಿ ಅಣ್ಣಾ. <br> *Meter haaki hogi anna.* <br> "Please put the meter and drive, brother." | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-03` | ಎಷ್ಟು ಆಗುತ್ತೆ? | Eshtu aaguththe? | How much will it cost? | ಇಂದಿರಾನಗರಕ್ಕೆ ಎಷ್ಟು ಆಗುತ್ತೆ? <br> *Indiranagar-akke eshtu aaguththe?* <br> "How much will it be to Indiranagar?" | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-04` | ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ. | Illi nillisi. | Stop here. | ಮುಂದೆ ಲೆಫ್ಟ್‌ನಲ್ಲಿ ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ. <br> *Munde left-nalli illi nillisi.* <br> "Stop here ahead on the left." | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-05` | ಲೆಫ್ಟ್ ತಗೊಳ್ಳಿ / ರೈಟ್ ತಗೊಳ್ಳಿ. | Left thagoli / Right thagoli. | Take left / Take right. | ಮುಂದಿನ ಸಿಗ್ನಲ್ ಹತ್ರ ರೈಟ್ ತಗೊಳ್ಳಿ. <br> *Mundhina signal hathra right thagoli.* <br> "Take right near the next signal." | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-06` | ಮುಂದಿನ ಸ್ಟಾಪ್ ಯಾವುದು? | Mundhina stop yaavudu? | Which is the next stop? | ಕಂಡಕ್ಟರ್ ಸರ್, ಮುಂದಿನ ಸ್ಟಾಪ್ ಯಾವುದು? <br> *Conductor sir, mundhina stop yaavudu?* <br> "Conductor sir, which is the next stop?" | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-07` | ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ. | Ondhu ticket kodi. | Give one ticket. | ಸಿಲ್ಕ್ ಬೋರ್ಡ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ. <br> *Silk Board-ge ondhu ticket kodi.* <br> "Give one ticket to Silk Board." | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-08` | ಆನ್‌ಲೈನ್ ಪೇಮೆಂಟ್ / UPI ಇದ್ಯಾ? | Online payment / UPI idhya? | Do you have online payment / UPI? | ಕ್ಯಾಶ್ ಇಲ್ಲ, ಫೋನ್ ಪೇ ಸ್ಕ್ಯಾನರ್ ಇದ್ಯಾ? <br> *Cash illa, PhonePe scanner idhya?* <br> "I have no cash, do you have PhonePe scanner?" | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-09` | ಸ್ವಲ್ಪ ಬೇಗ ಹೋಗ್ಬಹುದಾ? | Swalpa bega hogbahudha? | Can you please go a little faster? | ಟ್ರೈನ್ ಮಿಸ್ ಆಗುತ್ತೆ, ಸ್ವಲ್ಪ ಬೇಗ ಹೋಗ್ಬಹುದಾ? <br> *Train miss aaguththe, swalpa bega hogbahudha?* <br> "I might miss the train, can you go a little faster?" | `false` | [ ] Approved <br> [ ] Fixed |
| `trans-10` | ಇಳಿಯೋಕೆ ಜಾಗ ಕೊಡಿ. | Iliyoke jaaga kodi. | Please make way to get down. | ಸ್ಟಾಪ್ ಬಂತು, ಇಳಿಯೋಕೆ ಸ್ವಲ್ಪ ಜಾಗ ಕೊಡಿ. <br> *Stop banthu, iliyoke swalpa jaaga kodi.* <br> "The stop has arrived, please give some way to get off." | `false` | [ ] Approved <br> [ ] Fixed |

### 1.2 Shopping (`shopping`)

| ID | Kannada (`kn`) | Transliteration (`translit`) | English (`en`) | Example Sentence (`kn` / `translit` / `en`) | Reviewed | Status / Notes |
|---|---|---|---|---|---|---|
| `shop-01` | ಇದು ಎಷ್ಟು ಬೆಲೆ? | Idhu eshtu bele? | How much is this? | ಅಣ್ಣಾ, ಈ ಶರ್ಟ್ ಎಷ್ಟು ಬೆಲೆ? <br> *Anna, ee shirt eshtu bele?* <br> "Brother, how much is this shirt?" | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-02` | ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ. | Swalpa kammi maadi. | Reduce the price a bit. | ಬೆಲೆ ತುಂಬಾ ಜಾಸ್ತಿ ಆಯ್ತು, ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ. <br> *Bele thumba jaasthi aaythu, swalpa kammi maadi.* <br> "The price is too high, reduce it a bit." | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-03` | ಬೇರೆ ಕಲರ್ ಅಥವಾ ಸೈಜ್ ಇದ್ಯಾ? | Bere color athava size idhya? | Do you have another color or size? | ಇದರಲ್ಲಿ ಬ್ಲೂ ಕಲರ್ ಮೀಡಿಯಂ ಸೈಜ್ ಇದ್ಯಾ? <br> *Idharalli blue color medium size idhya?* <br> "Do you have blue color in medium size for this?" | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-04` | ಇದು ಫ್ರೆಶ್ ಆಗಿದ್ಯಾ? | Idhu fresh aagidhya? | Is this fresh? | ಈ ತರಕಾರಿ ಇವತ್ತಿಂದಾ, ಫ್ರೆಶ್ ಆಗಿದ್ಯಾ? <br> *Ee tharakaari ivathindhaa, fresh aagidhya?* <br> "Are these vegetables from today, are they fresh?" | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-05` | ಒಂದು ಕಿಲೋ ಕೊಡಿ. | Ondhu kilo kodi. | Give one kilogram. | ಒಳ್ಳೆ ಈರುಳ್ಳಿ ಒಂದು ಕಿಲೋ ಕೊಡಿ. <br> *Olle eerulli ondhu kilo kodi.* <br> "Give one kilo of good onions." | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-06` | ಕವರ್ ಕೊಡಿ. | Cover kodi. | Give a carry bag. | ಸಾಮಾನು ತಗೊಂಡು ಹೋಗೋಕೆ ಒಂದು ಕವರ್ ಕೊಡಿ. <br> *Saamaanu thagond hogoke ondhu cover kodi.* <br> "Please give a bag to carry the items." | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-07` | ಕಾರ್ಡ್ ಅಥವಾ ಸ್ಕ್ಯಾನರ್ ತಗೋತೀರಾ? | Card athava scanner thagothira? | Do you accept card or UPI scanner? | ಕ್ಯಾಶ್ ಮುಗಿದಿದೆ, ಕಾರ್ಡ್ ತಗೋತೀರಾ? <br> *Cash mugidhidhe, card thagothira?* <br> "I'm out of cash, do you take cards?" | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-08` | ಬಿಲ್ ಕೊಡಿ. | Bill kodi. | Give the bill. | ಎಲ್ಲಾ ಪ್ಯಾಕ್ ಮಾಡಿ ಬಿಲ್ ಕೊಡಿ. <br> *Ella pack maadi bill kodi.* <br> "Please pack everything and give the bill." | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-09` | ಇದು ಬೇಡ, ಬೇರೆ ತೋರ್ಸಿ. | Idhu beda, bere thorsi. | Not this one, show another. | ಇದರ ಕ್ವಾಲಿಟಿ ಸರಿ ಇಲ್ಲ, ಬೇರೆ ತೋರ್ಸಿ. <br> *Idhara quality sari illa, bere thorsi.* <br> "Quality of this isn't good, show another one." | `false` | [ ] Approved <br> [ ] Fixed |
| `shop-10` | ಚೇಂಜ್ ಕೊಡಿ. | Change kodi. | Please give the change. | ಐನೂರು ರೂಪಾಯಿ ಕೊಟ್ಟಿದ್ದೀನಿ, ಚಿಲ್ಲರೆ ಕೊಡಿ. <br> *Ainooru roopaayi kottidhini, chillare kodi.* <br> "I gave 500 rupees, please give the balance change." | `false` | [ ] Approved <br> [ ] Fixed |

### 1.3 Healthcare (`healthcare`)

> [!NOTE]
> Healthcare phrases are communication aids for everyday clinic visits, not medical advice.

| ID | Kannada (`kn`) | Transliteration (`translit`) | English (`en`) | Example Sentence (`kn` / `translit` / `en`) | Reviewed | Status / Notes |
|---|---|---|---|---|---|---|
| `health-01` | ನನಗೆ ತಲೆ ನೋವು ಇದೆ. | Nanage thale novu idhe. | I have a headache. | ಬೆಳಗ್ಗಿಂದ ತುಂಬಾ ತಲೆ ನೋವು ಇದೆ. <br> *Belaggindha thumba thale novu idhe.* <br> "I have severe headache since morning." | `false` | [ ] Approved <br> [ ] Fixed |
| `health-02` | ಎರಡು ದಿನದಿಂದ ಜ್ವರ ಬಂದಿದೆ. | Eradu dhinadhinda jvara bandhidhe. | I have had a fever for two days. | ಚಳಿ ಜೊತೆ ಎರಡು ದಿನದಿಂದ ಜ್ವರ ಬಂದಿದೆ. <br> *Chali jothe eradu dhinadhinda jvara bandhidhe.* <br> "I have a fever with chills for two days." | `false` | [ ] Approved <br> [ ] Fixed |
| `health-03` | ಹೊಟ್ಟೆ ನೋವು ಇದೆ. | Hotte novu idhe. | I have a stomach ache. | ಊಟ ಮಾಡಿದ ಮೇಲೆ ಹೊಟ್ಟೆ ನೋವು ಬರ್ತಾ ಇದೆ. <br> *Oota maadidha mele hotte novu barthaa idhe.* <br> "Stomach is aching after having food." | `false` | [ ] Approved <br> [ ] Fixed |
| `health-04` | ಡಾಕ್ಟರ್ ಯಾವಾಗ ಬರ್ತಾರೆ? | Doctor yaavaaga barthaare? | When will the doctor come? | ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಇತ್ತು, ಡಾಕ್ಟರ್ ಯಾವಾಗ ಬರ್ತಾರೆ? <br> *Appointment ithu, doctor yaavaaga barthaare?* <br> "I had an appointment, when will the doctor arrive?" | `false` | [ ] Approved <br> [ ] Fixed |
| `health-05` | ಈ ಮಾತ್ರೆ ಯಾವಾಗ ತಗೋಬೇಕು? | Ee maathre yaavaaga thagobeku? | When should I take this tablet? | ದಿನಕ್ಕೆ ಎಷ್ಟು ಸಾರಿ ಈ ಮಾತ್ರೆ ತಗೋಬೇಕು? <br> *Dhinakke eshtu saari ee maathre thagobeku?* <br> "How many times a day should I take this tablet?" | `false` | [ ] Approved <br> [ ] Fixed |
| `health-06` | ಊಟ ಆದ್ಮೇಲೆ ತಗೋಬೇಕಾ? | Oota aadhmele thagobekaa? | Should I take it after food? | ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ತಗೋಬೇಕಾ ಅಥವಾ ಊಟ ಆದ್ಮೇಲೆ ತಗೋಬೇಕಾ? <br> *Khaali hotteyalli thagobekaa athava oota aadhmele thagobekaa?* <br> "Should I take it empty stomach or after food?" | `false` | [ ] Approved <br> [ ] Fixed |
| `health-07` | ಕೆಮ್ಮು ಮತ್ತು ಗಂಟಲು ನೋವು ಇದೆ. | Kemmu mathu gantalu novu idhe. | I have a cough and throat pain. | ರಾತ್ರಿ ತುಂಬಾ ಕೆಮ್ಮು ಬರ್ತಾ ಇದೆ. <br> *Raathri thumba kemmu barthaa idhe.* <br> "Coughing a lot during the night." | `false` | [ ] Approved <br> [ ] Fixed |
| `health-08` | ನನಗೆ ಈ ಮೆಡಿಸಿನ್ ಅಲರ್ಜಿ ಇದೆ. | Nanage ee medicine allergy idhe. | I am allergic to this medicine. | ಪೆನ್ಸಿಲಿನ್ ತಗೊಂಡ್ರೆ ನನಗೆ ಅಲರ್ಜಿ ಆಗುತ್ತೆ. <br> *Penicillin thagondre nanage allergy aaguththe.* <br> "I get an allergic reaction if I take penicillin." | `false` | [ ] Approved <br> [ ] Fixed |
| `health-09` | ಬಿಪಿ ಮತ್ತು ಶುಗರ್ ಚೆಕ್ ಮಾಡಿ. | BP mathu sugar check maadi. | Please check blood pressure and blood sugar. | ಸ್ವಲ್ಪ ತಲೆ ಸುತ್ತು ಬರ್ತಿದೆ, ಬಿಪಿ ಚೆಕ್ ಮಾಡಿ. <br> *Swalpa thale suthu barthidhe, BP check maadi.* <br> "Feeling dizzy, please check my blood pressure." | `false` | [ ] Approved <br> [ ] Fixed |
| `health-10` | ಟೆಸ್ಟ್ ರಿಪೋರ್ಟ್ ಯಾವಾಗ ಸಿಗುತ್ತೆ? | Test report yaavaaga siguththe? | When will the test report be ready? | ಬ್ಲಡ್ ಟೆಸ್ಟ್ ರಿಪೋರ್ಟ್ ಇವತ್ತು ಸಂಜೆ ಸಿಗುತ್ತಾ? <br> *Blood test report ivathu saanje siguthaa?* <br> "Will the blood test report be ready this evening?" | `false` | [ ] Approved <br> [ ] Fixed |

### 1.4 Workplace (`workplace`)

| ID | Kannada (`kn`) | Transliteration (`translit`) | English (`en`) | Example Sentence (`kn` / `translit` / `en`) | Reviewed | Status / Notes |
|---|---|---|---|---|---|---|
| `work-01` | ಈ ಫೈಲ್ ಕಳಿಸಿ. | Ee file kalisi. | Please send this file. | ನನ್ನ ಈಮೇಲ್‌ಗೆ ಆ ಪ್ರಾಜೆಕ್ಟ್ ಫೈಲ್ ಕಳಿಸಿ. <br> *Nanna email-ge aa project file kalisi.* <br> "Please send that project file to my email." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-02` | ಮೀಟಿಂಗ್ ಯಾವಾಗ ಇದೆ? | Meeting yaavaaga idhe? | When is the meeting? | ಕ್ಲೈಂಟ್ ಮೀಟಿಂಗ್ ಯಾವಾಗ ಶುರು ಆಗುತ್ತೆ? <br> *Client meeting yaavaaga shuru aaguththe?* <br> "When does the client meeting start?" | `false` | [ ] Approved <br> [ ] Fixed |
| `work-03` | ನನಗೆ ಸ್ವಲ್ಪ ಹೆಲ್ಪ್ ಬೇಕಿತ್ತು. | Nanage swalpa help bekithu. | I needed a little help. | ಈ ಟಾಸ್ಕ್ ಮುಗಿಸೋಕೆ ನನಗೆ ಸ್ವಲ್ಪ ಹೆಲ್ಪ್ ಬೇಕಿತ್ತು. <br> *Ee task mugisoke nanage swalpa help bekithu.* <br> "I needed a little help to finish this task." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-04` | ನಾಳೆ ರಜೆ / ಲೀವ್ ಬೇಕಾಗಿತ್ತು. | Naale raje / leave bekaagithu. | I need leave tomorrow. | ಮನೆ ಕೆಲಸ ಇದೆ, ನಾಳೆ ರಜೆ ಬೇಕಾಗಿತ್ತು. <br> *Mane kelasa idhe, naale raje bekaagithu.* <br> "I have personal work at home, I need leave tomorrow." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-05` | ಈ ಕೆಲಸ ಮುಗಿದಿದೆ. | Ee kelasa mugidhidhe. | This work is completed. | ನೀವು ಹೇಳಿದ ರಿಪೋರ್ಟ್ ಕೆಲಸ ಮುಗಿದಿದೆ. <br> *Neevu helidha report kelasa mugidhidhe.* <br> "The report work you asked for is completed." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-06` | ಚಹಾ / ಕಾಫಿ ಕುಡಿಯೋಣ್ವಾ? | Chaha / coffee kudiyonwaa? | Shall we go for tea / coffee? | ಐದು ನಿಮಿಷ ಬ್ರೇಕ್ ತಗೊಂಡು ಕಾಫಿ ಕುಡಿಯೋಣ್ವಾ? <br> *Aidhu nimisha break thagondu coffee kudiyonwaa?* <br> "Shall we take a five minute break and have coffee?" | `false` | [ ] Approved <br> [ ] Fixed |
| `work-07` | ಸ್ವಲ್ಪ ವೇಟ್ ಮಾಡಿ. | Swalpa wait maadi. | Please wait a moment. | ನಾನು ಕಾಲ್‌ನಲ್ಲಿ ಇದ್ದೀನಿ, ಸ್ವಲ್ಪ ವೇಟ್ ಮಾಡಿ. <br> *Naanu call-nalli iddhini, swalpa wait maadi.* <br> "I am on a call, please wait a moment." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-08` | ಕಾಲ್ ಕನೆಕ್ಟ್ ಆಗ್ತಿಲ್ಲ. | Call connect aagthilla. | The call is not connecting. | ನೆಟ್‌ವರ್ಕ್ ಪ್ರಾಬ್ಲಮ್ ಇದೆ, ಕಾಲ್ ಕನೆಕ್ಟ್ ಆಗ್ತಿಲ್ಲ. <br> *Network problem idhe, call connect aagthilla.* <br> "There is a network issue, the call is not connecting." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-09` | ಮೇಲ್ ಚೆಕ್ ಮಾಡಿ ರಿಪ್ಲೈ ಮಾಡ್ತೀನಿ. | Mail check maadi reply maadthini. | I will check the email and reply. | ಈಗಲೇ ಮೇಲ್ ಚೆಕ್ ಮಾಡಿ ಅಪ್‌ಡೇಟ್ ಕೊಡ್ತೀನಿ. <br> *Eegale mail check maadi update kodthini.* <br> "I will check the mail right away and give an update." | `false` | [ ] Approved <br> [ ] Fixed |
| `work-10` | ತುಂಬಾ ಧನ್ಯವಾದಗಳು. | Thumba dhanyavaadhagalu. | Thank you very much. | ಸಹಾಯ ಮಾಡಿದ್ದಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು. <br> *Sahaaya maadiddhakke thumba dhanyavaadhagalu.* <br> "Thank you very much for your help." | `false` | [ ] Approved <br> [ ] Fixed |

### 1.5 Restaurant (`restaurant`)

| ID | Kannada (`kn`) | Transliteration (`translit`) | English (`en`) | Example Sentence (`kn` / `translit` / `en`) | Reviewed | Status / Notes |
|---|---|---|---|---|---|---|
| `rest-01` | ಮೆನು ಕಾರ್ಡ್ ಕೊಡಿ. | Menu card kodi. | Please give the menu card. | ಸರ್, ಒಂದು ನಿಮಿಷ ಮೆನು ಕಾರ್ಡ್ ಕೊಡಿ. <br> *Sir, ondhu nimisha menu card kodi.* <br> "Sir, please give the menu card for a minute." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-02` | ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ. | Ondhu masaale dose kodi. | Give one masala dosa. | ಕ್ರಿಸ್ಪಿಯಾಗಿ ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ. <br> *Crispy aagi ondhu masaale dose kodi.* <br> "Give one crispy masala dosa." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-03` | ಕುಡಿಯೋಕೆ ನೀರು ಕೊಡಿ. | Kudiyoke neeru kodi. | Please give drinking water. | ಬಿಸಿ ನೀರು ಇದ್ಯಾ? ಕುಡಿಯೋಕೆ ನೀರು ಕೊಡಿ. <br> *Bisi neeru idhya? Kudiyoke neeru kodi.* <br> "Do you have warm water? Please bring drinking water." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-04` | ಖಾರ ಕಮ್ಮಿ ಮಾಡಿ. | Khaara kammi maadi. | Make it less spicy. | ಮಕ್ಕಳಿಗೆ ಬೇಕು, ಖಾರ ಕಮ್ಮಿ ಮಾಡಿ. <br> *Makkalige beku, khaara kammi maadi.* <br> "It is for kids, make it less spicy." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-05` | ಫಿಲ್ಟರ್ ಕಾಫಿ ಇದ್ಯಾ? | Filter coffee idhya? | Do you have filter coffee? | ಊಟ ಆದಮೇಲೆ ಒಂದು ಸ್ಟ್ರಾಂಗ್ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ. <br> *Oota aadha mele ondhu strong filter coffee kodi.* <br> "After food, please give one strong filter coffee." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-06` | ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ. | Parcel katti kodi. | Please pack it for takeaway. | ಎರಡು ಇಡ್ಲಿ ವಡೆ ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ. <br> *Eradu idli vade parcel katti kodi.* <br> "Please pack two idli-vada for parcel." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-07` | ಬಿಲ್ ತನ್ನಿ. | Bill thanni. | Bring the bill. | ಊಟ ಮುಗೀತು, ಬಿಲ್ ತನ್ನಿ ಸರ್. <br> *Oota mugeethu, bill thanni sir.* <br> "Food is done, bring the bill please sir." | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-08` | ಇವತ್ತು ಯಾವ ಸ್ವೀಟ್ ಇದೆ? | Ivathu yaava sweet idhe? | Which sweet is available today? | ಬಿಸಿ ಜಾಮೂನ್ ಇದ್ಯಾ? ಇವತ್ತು ಯಾವ ಸ್ವೀಟ್ ಇದೆ? <br> *Bisi jamun idhya? Ivathu yaava sweet idhe?* <br> "Is hot gulab jamun available? Which sweet do you have today?" | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-09` | ಆರ್ಡರ್ ಸ್ವಲ್ಪ ಬೇಗ ಕೊಡ್ತೀರಾ? | Order swalpa bega kodthira? | Can you serve the order a little quickly? | ಅರ್ಜೆಂಟ್ ಇದೆ, ಆರ್ಡರ್ ಸ್ವಲ್ಪ ಬೇಗ ಕೊಡ್ತೀರಾ? <br> *Urgent idhe, order swalpa bega kodthira?* <br> "I am in a hurry, could you bring the order quickly?" | `false` | [ ] Approved <br> [ ] Fixed |
| `rest-10` | ಊಟ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು. | Oota thumba chennaagithu. | The food was very good. | ಸಾಂಬಾರ್ ಮತ್ತು ದೋಸೆ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು. <br> *Sambar mathu dose thumba chennaagithu.* <br> "The sambar and dosa were very good." | `false` | [ ] Approved <br> [ ] Fixed |

---

## Part 2: Interactive Role-Play Dialogues (All Speaker Lines, Reply Options, Feedback & Ratings)

### 2.1 Transport: Hiring an Auto in Bengaluru (`transport`, start: `trans_node_1`)

#### Node `trans_node_1` — Speaker: **Auto Driver**
- **Line ID**: `rp:transport:trans_node_1:line`
- **Kannada**: ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು ಸಾರ್?
- **Transliteration**: *Ellige hogbeku saar?*
- **English**: "Where do you want to go, sir?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:transport:trans_node_1:opt:0` | **`good`** | ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? ಮೀಟರ್ ಹಾಕಿ. | Majestic-ge hogthira? Meter haaki. | Will you go to Majestic? Please put the meter. | Perfect! Clear destination and polite meter request. | `trans_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_1:opt:1` | **`ok`** | ಮೆಜೆಸ್ಟಿಕ್ ಎಷ್ಟು? | Majestic eshtu? | How much for Majestic? | Acceptable, but asking for flat fare encourages off-meter quotes. | `trans_node_2_flat` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_1:opt:2` | **`poor`** | ಹೋಗಿ ಹೋಗಿ, ನನಗೆ ಬೇಗ ಆಗ್ಬೇಕು. | Hogi hogi, nanage bega aagbeku. | Go go, I am in a hurry. | Unclear destination and sounds impolite. | `trans_node_2` | [ ] Approved <br> [ ] Fixed |

#### Node `trans_node_2` — Speaker: **Auto Driver**
- **Line ID**: `rp:transport:trans_node_2:line`
- **Kannada**: ಮೆಜೆಸ್ಟಿಕ್ ತುಂಬಾ ಟ್ರಾಫಿಕ್ ಇದೆ. ಮೀಟರ್ ಮೇಲೆ ಇಪ್ಪತ್ತು ರೂಪಾಯಿ ಎಕ್ಸ್ಟ್ರಾ ಕೊಡಿ.
- **Transliteration**: *Majestic thumba traffic idhe. Meter mele ippathu roopaayi extra kodi.*
- **English**: "There is heavy traffic towards Majestic. Give 20 rupees extra above the meter."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:transport:trans_node_2:opt:0` | **`good`** | ಸರಿ ಅಣ್ಣಾ, ಮೀಟರ್ ಹಾಕಿ, ಇಪ್ಪತ್ತು ರೂಪಾಯಿ ಎಕ್ಸ್ಟ್ರಾ ಕೊಡ್ತೀನಿ. | Sari anna, meter haaki, ippathu roopaayi extra kodthini. | Okay brother, put the meter, I'll pay 20 rupees extra. | Very pragmatic and polite agreement in Bengaluru traffic. | `trans_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_2:opt:1` | **`ok`** | ಇಲ್ಲ, ಮೀಟರ್ ಮಾತ್ರ ಕೊಡ್ತೀನಿ. | Illa, meter maathra kodthini. | No, I will only pay the meter charge. | Fair demand, though driver might decline during peak hours. | `trans_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_2:opt:2` | **`poor`** | ಎಕ್ಸ್ಟ್ರಾ ಕೊಡಲ್ಲ, ನೀವು ಸುಳ್ಳು ಹೇಳ್ತಿದ್ದೀರಾ. | Extra kodalla, neevu sullu helthiddhira. | I won't give extra, you are lying. | Aggressive phrasing; likely to cause conflict. | `trans_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `trans_node_2_flat` — Speaker: **Auto Driver**
- **Line ID**: `rp:transport:trans_node_2_flat:line`
- **Kannada**: ನೂರೈವತ್ತು ರೂಪಾಯಿ ಆಗುತ್ತೆ, ಬನ್ನಿ.
- **Transliteration**: *Nooraivathu roopaayi aaguththe, banni.*
- **English**: "It will be 150 rupees, come."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:transport:trans_node_2_flat:opt:0` | **`good`** | ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ ಅಣ್ಣಾ, ನೂರಕ್ಕೆ ಬನ್ನಿ ಅಥವಾ ಮೀಟರ್ ಹಾಕಿ. | Swalpa kammi maadi anna, noorakke banni athava meter haaki. | Reduce a little brother, come for 100 or put meter. | Smart negotiation back to fair rate or meter. | `trans_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_2_flat:opt:1` | **`ok`** | ಸರಿ, ನೂರೈವತ್ತು ಕೊಡ್ತೀನಿ. | Sari, nooraivathu kodthini. | Okay, I'll give 150. | Directly accepted, slightly higher than standard fare. | `trans_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_2_flat:opt:2` | **`poor`** | ತುಂಬಾ ಜಾಸ್ತಿ, ಬೇಡ. | Thumba jaasthi, beda. | Too high, no. | Abrupt refusal without counter-offer. | `trans_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `trans_node_3` — Speaker: **Auto Driver**
- **Line ID**: `rp:transport:trans_node_3:line`
- **Kannada**: ಮೆಜೆಸ್ಟಿಕ್ ಬಂತು. ಎಲ್ಲಿ ನಿಲ್ಲಿಸಬೇಕು?
- **Transliteration**: *Majestic banthu. Elli nillisabeku?*
- **English**: "Majestic has arrived. Where should I stop?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:transport:trans_node_3:opt:0` | **`good`** | ಮುಂದೆ ಮೆಟ್ರೋ ಸ್ಟೇಷನ್ ಹತ್ರ ಲೆಫ್ಟ್‌ನಲ್ಲಿ ನಿಲ್ಲಿಸಿ. | Munde metro station hathra left-nalli nillisi. | Please stop ahead on the left near the metro station. | Precise and helpful landmark direction. | `trans_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_3:opt:1` | **`ok`** | ಇಲ್ಲೇ ನಿಲ್ಲಿಸಿ. | Ille nillisi. | Stop right here. | Clear, though doesn't specify safe kerb side. | `trans_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_3:opt:2` | **`poor`** | ನಿಲ್ಲು ನಿಲ್ಲು! | Nillu nillu! | Stop stop! | Too sudden and lacks respect. | `trans_node_4` | [ ] Approved <br> [ ] Fixed |

#### Node `trans_node_4` — Speaker: **Auto Driver**
- **Line ID**: `rp:transport:trans_node_4:line`
- **Kannada**: ಮೀಟರ್ ನೂರೈವತ್ತು ಆಗಿದೆ. ಕ್ಯಾಶ್ ಕೊಡ್ತೀರಾ?
- **Transliteration**: *Meter nooraivathu aagidhe. Cash kodthira?*
- **English**: "Meter is 150. Will you pay cash?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:transport:trans_node_4:opt:0` | **`good`** | ಕ್ಯಾಶ್ ಇಲ್ಲ ಅಣ್ಣಾ, ಸ್ಕ್ಯಾನರ್ ಇದ್ಯಾ? UPI ಮಾಡ್ತೀನಿ. | Cash illa anna, scanner idhya? UPI maadthini. | No cash brother, do you have a scanner? I will do UPI. | Standard practical payment query in Bengaluru. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_4:opt:1` | **`ok`** | ಹೂಂ, ಇಲ್ನೋಡಿ ನೂರೈವತ್ತು ರೂಪಾಯಿ. | Hoom, ilnodi nooraivathu roopaayi. | Yes, look here, 150 rupees. | Direct cash payment. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:transport:trans_node_4:opt:2` | **`poor`** | ಚೇಂಜ್ ಇಲ್ಲ, ಎರಡು ಸಾವಿರ ನೋಟ್ ತಗೊಳ್ಳಿ. | Change illa, eradu saavira note thagoli. | No change, take a 2000 note. | Tough for auto drivers to break high-denomination notes. | `null (end)` | [ ] Approved <br> [ ] Fixed |


### 2.2 Shopping: Buying Vegetables at the Market (`shopping`, start: `shop_node_1`)

#### Node `shop_node_1` — Speaker: **Vendor**
- **Line ID**: `rp:shopping:shop_node_1:line`
- **Kannada**: ಬನ್ನಿ ಸಾರ್, ತಾಜಾ ತರಕಾರಿ ಇದೆ. ಏನು ಬೇಕು?
- **Transliteration**: *Banni saar, thaaja tharakaari idhe. Enu beku?*
- **English**: "Come sir, fresh vegetables are here. What do you need?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:shopping:shop_node_1:opt:0` | **`good`** | ಈರುಳ್ಳಿ ಮತ್ತು ಟೊಮ್ಯಾಟೋ ಎಷ್ಟು ಬೆಲೆ? | Eerulli mathu tomato eshtu bele? | How much for onions and tomatoes? | Clear, direct item inquiry. | `shop_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_1:opt:1` | **`ok`** | ತರಕಾರಿ ರೇಟ್ ಹೇಳಿ. | Tharakaari rate heli. | Tell the vegetable rates. | A bit broad, but understandable. | `shop_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_1:opt:2` | **`poor`** | ಇದು ಫ್ರೆಶ್ ಇಲ್ಲ ಅನ್ನಿಸುತ್ತೆ. | Idhu fresh illa annisuththe. | Looks like this isn't fresh. | Skeptical opening without even checking prices. | `shop_node_2` | [ ] Approved <br> [ ] Fixed |

#### Node `shop_node_2` — Speaker: **Vendor**
- **Line ID**: `rp:shopping:shop_node_2:line`
- **Kannada**: ಈರುಳ್ಳಿ ಕಿಲೋಗೆ ನಲವತ್ತು ರೂಪಾಯಿ, ಟೊಮ್ಯಾಟೋ ಮೂವತ್ತು ರೂಪಾಯಿ.
- **Transliteration**: *Eerulli kiloge nalavathu roopaayi, tomato moovathu roopaayi.*
- **English**: "Onions are forty rupees a kilo, tomatoes thirty rupees."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:shopping:shop_node_2:opt:0` | **`good`** | ಎರಡು ಕಿಲೋ ಈರುಳ್ಳಿ ತಗೊಂಡ್ರೆ ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡ್ತೀರಾ? | Eradu kilo eerulli thagondre swalpa kammi maadthira? | If I take two kilos of onions, will you reduce the price a bit? | Polite bulk bargaining. | `shop_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_2:opt:1` | **`ok`** | ಒಂದು ಕಿಲೋ ಈರುಳ್ಳಿ, ಅರ್ಧ ಕಿಲೋ ಟೊಮ್ಯಾಟೋ ಕೊಡಿ. | Ondhu kilo eerulli, ardha kilo tomato kodi. | Give one kilo onion, half kilo tomato. | Direct purchase without bargaining. | `shop_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_2:opt:2` | **`poor`** | ಬೇರೆ ಅಂಗಡಿಯಲ್ಲಿ ತುಂಬಾ ಕಮ್ಮಿ ಇದೆ! | Bere angadiyalli thumba kammi idhe! | It is much cheaper in other shops! | A bit confrontational. | `shop_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `shop_node_3` — Speaker: **Vendor**
- **Line ID**: `rp:shopping:shop_node_3:line`
- **Kannada**: ಸರಿ ಸಾರ್, ಎರಡು ಕಿಲೋ ಈರುಳ್ಳಿ ಎಪ್ಪತ್ತು ರೂಪಾಯಿಗೆ ಕೊಡ್ತೀನಿ. ಕವರ್ ಬೇಕಾ?
- **Transliteration**: *Sari saar, eradu kilo eerulli eppathu roopaayige kodthini. Cover bekaa?*
- **English**: "Okay sir, I'll give 2 kilos onions for seventy rupees. Do you need a bag?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:shopping:shop_node_3:opt:0` | **`good`** | ಹೌದು, ಒಂದು ಕವರ್ ಕೊಡಿ. ಜೊತೆಗೆ ಸ್ವಲ್ಪ ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು ಹಾಕಿ. | Haudhu, ondhu cover kodi. Jothege swalpa kothambari soppu haaki. | Yes, give a bag please. Also add a little coriander greens. | Quintessential market interaction in Karnataka! | `shop_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_3:opt:1` | **`good`** | ನನ್ನ ಹತ್ರ ಬ್ಯಾಗ್ ಇದೆ, ಕವರ್ ಬೇಡ. | Nanna hathra bag idhe, cover beda. | I have my own bag, no carry bag needed. | Eco-friendly and clear. | `shop_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_3:opt:2` | **`poor`** | ಕವರ್ ಕೊಡಿ ಬೇಗ. | Cover kodi bega. | Give bag fast. | Rushed and blunt. | `shop_node_4` | [ ] Approved <br> [ ] Fixed |

#### Node `shop_node_4` — Speaker: **Vendor**
- **Line ID**: `rp:shopping:shop_node_4:line`
- **Kannada**: ಒಟ್ಟು ಎಪ್ಪತ್ತು ರೂಪಾಯಿ ಆಯ್ತು ಸಾರ್.
- **Transliteration**: *Ottu eppathu roopaayi aaythu saar.*
- **English**: "Total is seventy rupees sir."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:shopping:shop_node_4:opt:0` | **`good`** | PhonePe ಸ್ಕ್ಯಾನರ್ ಇದ್ಯಾ? ಸ್ಕ್ಯಾನ್ ಮಾಡ್ತೀನಿ. | PhonePe scanner idhya? Scan maadthini. | Do you have PhonePe scanner? I will scan. | Polite digital payment request. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_4:opt:1` | **`ok`** | ನೂರು ರೂಪಾಯಿ ಇದೆ, ಚೇಂಜ್ ಕೊಡಿ. | Nooru roopaayi idhe, change kodi. | Here is 100 rupees, please give change. | Simple cash handover. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:shopping:shop_node_4:opt:2` | **`poor`** | ಐನೂರು ನೋಟು ಮಾತ್ರ ಇರೋದು. | Ainooru notu maathra irodhu. | I only have a 500 note. | Inconvenient for a small 70-rupee purchase. | `null (end)` | [ ] Approved <br> [ ] Fixed |


### 2.3 Healthcare: Visiting a Clinic Doctor (`healthcare`, start: `health_node_1`)

#### Node `health_node_1` — Speaker: **Doctor**
- **Line ID**: `rp:healthcare:health_node_1:line`
- **Kannada**: ನಮಸ್ಕಾರ, ಏನು ತೊಂದರೆ ಆಗಿದೆ?
- **Transliteration**: *Namaskaara, enu thondhare aagidhe?*
- **English**: "Hello, what seems to be the problem?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:healthcare:health_node_1:opt:0` | **`good`** | ನಮಸ್ಕಾರ ಡಾಕ್ಟರ್, ಎರಡು ದಿನದಿಂದ ಜ್ವರ ಮತ್ತು ತಲೆ ನೋವು ಇದೆ. | Namaskaara doctor, eradu dhinadhinda jvara mathu thale novu idhe. | Hello doctor, I have fever and headache for two days. | Clear symptom description and timeframe. | `health_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_1:opt:1` | **`ok`** | ನನಗೆ ಆರಾಮ ಇಲ್ಲ, ಔಷಧಿ ಕೊಡಿ. | Nanage aaraama illa, aushadhi kodi. | I am not feeling well, give medicine. | Vague about specific symptoms. | `health_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_1:opt:2` | **`poor`** | ತುಂಬಾ ಸಿಕ್ ಇದ್ದೀನಿ, ಬೇಗ ನೋಡಿ. | Thumba sick iddhini, bega nodi. | I'm very sick, check quickly. | Impatient and gives no medical details. | `health_node_2` | [ ] Approved <br> [ ] Fixed |

#### Node `health_node_2` — Speaker: **Doctor**
- **Line ID**: `rp:healthcare:health_node_2:line`
- **Kannada**: ಚಳಿ ಬರ್ತಾ ಇದ್ಯಾ? ಕೆಮ್ಮು ಅಥವಾ ಗಂಟಲು ನೋವು ಇದ್ಯಾ?
- **Transliteration**: *Chali barthaa idhya? Kemmu athava gantalu novu idhya?*
- **English**: "Are you getting chills? Do you have cough or sore throat?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:healthcare:health_node_2:opt:0` | **`good`** | ಹೌದು ಡಾಕ್ಟರ್, ರಾತ್ರಿ ಚಳಿ ಬರುತ್ತೆ ಮತ್ತು ಗಂಟಲು ನೋವು ಇದೆ. | Haudhu doctor, raathri chali baruththe mathu gantalu novu idhe. | Yes doctor, chills at night and throat pain is there. | Direct, informative response helping diagnosis. | `health_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_2:opt:1` | **`ok`** | ಕೆಮ್ಮು ಸ್ವಲ್ಪ ಇದೆ. | Kemmu swalpa idhe. | A little cough is there. | Answers partially. | `health_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_2:opt:2` | **`poor`** | ಗೊತ್ತಿಲ್ಲ, ನೀವೇ ಚೆಕ್ ಮಾಡಿ. | Gotthilla, neeve check maadi. | Don't know, you check yourself. | Unhelpful for the clinician. | `health_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `health_node_3` — Speaker: **Doctor**
- **Line ID**: `rp:healthcare:health_node_3:line`
- **Kannada**: ವೈರಲ್ ಫೀವರ್ ಇರಬಹುದು. ಮೂರು ದಿನಕ್ಕೆ ಮಾತ್ರೆ ಬರೆದಿದ್ದೀನಿ.
- **Transliteration**: *Viral fever irabahudu. Mooru dhinakke maathre baredhiddhini.*
- **English**: "Likely viral fever. I have prescribed tablets for three days."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:healthcare:health_node_3:opt:0` | **`good`** | ಈ ಮಾತ್ರೆ ಊಟ ಆದ್ಮೇಲೆ ತಗೋಬೇಕಾ ಡಾಕ್ಟರ್? | Ee maathre oota aadhmele thagobekaa doctor? | Should I take these tablets after food doctor? | Essential question for safe medication intake. | `health_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_3:opt:1` | **`good`** | ದಿನಕ್ಕೆ ಎಷ್ಟು ಸಾರಿ ತಗೋಬೇಕು? | Dhinakke eshtu saari thagobeku? | How many times a day should I take them? | Good practical dosage inquiry. | `health_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_3:opt:2` | **`ok`** | ಇಂಜೆಕ್ಷನ್ ಬೇಡ, ಬರೀ ಮಾತ್ರೆ ಸಾಕು. | Injection beda, baree maathre saaku. | No injection, only tablets are enough. | Preemptive assumption before the doctor suggested injection. | `health_node_4` | [ ] Approved <br> [ ] Fixed |

#### Node `health_node_4` — Speaker: **Doctor**
- **Line ID**: `rp:healthcare:health_node_4:line`
- **Kannada**: ಹೌದು, ಬೆಳಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟ ಆದ್ಮೇಲೆ ತಗೊಳ್ಳಿ. ಬಿಸಿ ನೀರು ಕುಡಿಯಿರಿ.
- **Transliteration**: *Haudhu, belagge mathu raathri oota aadhmele thagoli. Bisi neeru kudiyiri.*
- **English**: "Yes, take morning and night after food. Drink warm water."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:healthcare:health_node_4:opt:0` | **`good`** | ಧನ್ಯವಾದಗಳು ಡಾಕ್ಟರ್, ಹಾಗೇ ಮಾಡ್ತೀನಿ. | Dhanyavaadhagalu doctor, haage maadthini. | Thank you doctor, will do so. | Courteous and cooperative conclusion. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_4:opt:1` | **`ok`** | ಟೆಸ್ಟ್ ಏನೂ ಬೇಡ್ವಾ? | Test enoo bedwaa? | No tests needed? | Valid clarifying check. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:healthcare:health_node_4:opt:2` | **`poor`** | ಸರಿ ಸರಿ, ಹೋಗ್ತೀನಿ. | Sari sari, hogthini. | Okay okay, I am leaving. | Too casual for a clinical consultation. | `null (end)` | [ ] Approved <br> [ ] Fixed |


### 2.4 Workplace: Discussing a Task with a Colleague (`workplace`, start: `work_node_1`)

#### Node `work_node_1` — Speaker: **Colleague**
- **Line ID**: `rp:workplace:work_node_1:line`
- **Kannada**: ಹಾಯ್, ನಿನ್ನೆ ಹೇಳಿದ ರಿಪೋರ್ಟ್ ರೆಡಿ ಆಯ್ತಾ?
- **Transliteration**: *Hi, ninne helidha report ready aaythaa?*
- **English**: "Hi, is the report mentioned yesterday ready?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:workplace:work_node_1:opt:0` | **`good`** | ಹಾಯ್, ಕೆಲಸ ಮುಗಿದಿದೆ. ಈಗಲೇ ಮೇಲ್ ಕಳಿಸ್ತೀನಿ. | Hi, kelasa mugidhidhe. Eegale mail kalisthini. | Hi, work is finished. I will send the email right away. | Prompt, professional, and reliable response. | `work_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:workplace:work_node_1:opt:1` | **`ok`** | ಇನ್ನೊಂದು ಅರ್ಧ ಗಂಟೆಯಲ್ಲಿ ಕಳಿಸ್ತೀನಿ. | Innondu ardha ganteyalli kalisthini. | I will send it in half an hour. | Realistic timeframe commitment. | `work_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:workplace:work_node_1:opt:2` | **`poor`** | ಇನ್ನು ಶುರು ಮಾಡಿಲ್ಲ, ತುಂಬಾ ಕೆಲಸ ಇತ್ತು. | Innu shuru maadilla, thumba kelasa ithu. | Haven't started yet, had too much work. | Could communicate delays earlier with better context. | `work_node_2` | [ ] Approved <br> [ ] Fixed |

#### Node `work_node_2` — Speaker: **Colleague**
- **Line ID**: `rp:workplace:work_node_2:line`
- **Kannada**: ಸೂಪರ್! ಮೂರು ಗಂಟೆಗೆ ಕ್ಲೈಂಟ್ ಮೀಟಿಂಗ್ ಇದೆ, ನೀವು ಜಾಯಿನ್ ಆಗ್ತೀರಾ?
- **Transliteration**: *Super! Mooru gantege client meeting idhe, neevu join aagthira?*
- **English**: "Super! There's a client meeting at 3 PM, will you join?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:workplace:work_node_2:opt:0` | **`good`** | ಹೌದು ಖಂಡಿತ, ಮೀಟಿಂಗ್ ಲಿಂಕ್ ಕಳಿಸಿ ಜಾಯಿನ್ ಆಗ್ತೀನಿ. | Haudhu khanditha, meeting link kalisi join aagthini. | Yes definitely, send the meeting link and I will join. | Enthusiastic and clear participation. | `work_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:workplace:work_node_2:opt:1` | **`ok`** | ಕ್ಯಾಲೆಂಡರ್ ಇನ್ವೈಟ್ ಇದ್ಯಾ? ನೋಡಿ ಹೇಳ್ತೀನಿ. | Calendar invite idhya? Nodi helthini. | Is there a calendar invite? I will check and say. | Professional schedule checking. | `work_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:workplace:work_node_2:opt:2` | **`poor`** | ನನಗೆ ಮೀಟಿಂಗ್ ಇಷ್ಟ ಇಲ್ಲ. | Nanage meeting ishta illa. | I don't like meetings. | Unprofessional workplace statement. | `work_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `work_node_3` — Speaker: **Colleague**
- **Line ID**: `rp:workplace:work_node_3:line`
- **Kannada**: ಸರಿ, ಲಿಂಕ್ ಕಳಿಸಿದ್ದೀನಿ. ಮೀಟಿಂಗ್ ಮುಂಚೆ ಒಂದು ಕಾಫಿ ಕುಡಿಯೋಣ್ವಾ?
- **Transliteration**: *Sari, link kalisiddhini. Meeting munche ondhu coffee kudiyonwaa?*
- **English**: "Okay, sent the link. Shall we grab a coffee before the meeting?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:workplace:work_node_3:opt:0` | **`good`** | ಖಂಡಿತ, ಐದು ನಿಮಿಷದಲ್ಲಿ ಕೆಫೆಟೇರಿಯಾ ಹತ್ರ ಸಿಗೋಣ. | Khanditha, aidhu nimishadhalli cafeteria hathra sigona. | Definitely, let's meet near the cafeteria in five minutes. | Friendly, collaborative team rapport. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:workplace:work_node_3:opt:1` | **`ok`** | ಈಗ ಸ್ವಲ್ಪ ಕೆಲಸ ಇದೆ, ಆಮೇಲೆ ಕುಡಿಯೋಣ. | Eega swalpa kelasa idhe, aamele kudiyona. | I have some work now, let's drink later. | Polite raincheck. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:workplace:work_node_3:opt:2` | **`poor`** | ಕಾಫಿ ಬೇಡ, ಟೈಮ್ ಇಲ್ಲ. | Coffee beda, time illa. | No coffee, no time. | A bit curt with a teammate. | `null (end)` | [ ] Approved <br> [ ] Fixed |


### 2.5 Restaurant: Ordering Food at a Darshini (`restaurant`, start: `rest_node_1`)

#### Node `rest_node_1` — Speaker: **Waiter**
- **Line ID**: `rp:restaurant:rest_node_1:line`
- **Kannada**: ನಮಸ್ಕಾರ ಸಾರ್, ತಿಂಡಿಗೆ ಏನು ತರಲಿ?
- **Transliteration**: *Namaskaara saar, thindige enu tharali?*
- **English**: "Hello sir, what should I bring for breakfast/snacks?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:restaurant:rest_node_1:opt:0` | **`good`** | ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಒಂದು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ. | Ondhu masaale dose mathu ondhu filter coffee kodi. | Give one masala dosa and one filter coffee. | Classic, clear Bengaluru breakfast order. | `rest_node_2` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_1:opt:1` | **`good`** | ಇವತ್ತು ಸ್ಪೆಷಲ್ ಏನು ಇದೆ? | Ivathu special enu idhe? | What is the special today? | Great inquiry to discover daily menu items. | `rest_node_2_special` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_1:opt:2` | **`ok`** | ಬೇಗ ಏನು ಸಿಗುತ್ತೆ ಅದನ್ನೇ ತನ್ನಿ. | Bega enu siguththe adhanne thanni. | Bring whatever is available quickly. | A bit too informal, though common when in a rush. | `rest_node_2` | [ ] Approved <br> [ ] Fixed |

#### Node `rest_node_2` — Speaker: **Waiter**
- **Line ID**: `rp:restaurant:rest_node_2:line`
- **Kannada**: ದೋಸೆ ಕ್ರಿಸ್ಪಿಯಾಗಿ ಮಾಡ್ಲಾ? ಕಾಫಿ ಊಟ ಆದ್ಮೇಲೆ ತರಲಾ ಅಥವಾ ಈಗಲೇನಾ?
- **Transliteration**: *Dose crispy aagi maadlaa? Coffee oota aadhmele tharalaa athava eegalenaa?*
- **English**: "Shall I make the dosa crispy? Bring coffee after food or right now?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:restaurant:rest_node_2:opt:0` | **`good`** | ದೋಸೆ ಕ್ರಿಸ್ಪಿ ಮಾಡಿ, ಕಾಫಿ ಊಟ ಆದ್ಮೇಲೆ ಕೊಡಿ. | Dose crispy maadi, coffee oota aadhmele kodi. | Make the dosa crispy, and give coffee after food. | Clear preferences communicated courteously. | `rest_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_2:opt:1` | **`ok`** | ಎಲ್ಲಾ ಒಟ್ಟಿಗೆ ತನ್ನಿ. | Ella ottige thanni. | Bring everything together. | Simple and straightforward. | `rest_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_2:opt:2` | **`poor`** | ಹೆಂಗೆ ಬೇಕಾದ್ರೂ ತನ್ನಿ. | Henge bekaadhroo thanni. | Bring however you like. | Indifferent tone. | `rest_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `rest_node_2_special` — Speaker: **Waiter**
- **Line ID**: `rp:restaurant:rest_node_2_special:line`
- **Kannada**: ಇವತ್ತು ರವೆ ಇಡ್ಲಿ ಮತ್ತು ಮೈಸೂರು ಪಾಕ್ ಸ್ಪೆಷಲ್ ಇದೆ ಸಾರ್.
- **Transliteration**: *Ivathu rave idli mathu Mysore pak special idhe saar.*
- **English**: "Today rave idli and Mysore pak are specials, sir."

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:restaurant:rest_node_2_special:opt:0` | **`good`** | ಹಾಗಾದ್ರೆ ಒಂದು ರವೆ ಇಡ್ಲಿ ಮತ್ತು ಕಾಫಿ ಕೊಡಿ. | Haagaadhre ondhu rave idli mathu coffee kodi. | Then please give one rave idli and coffee. | Decisive choice following the recommendation. | `rest_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_2_special:opt:1` | **`ok`** | ಬೇಡ, ಮಾಮೂಲಿ ಮಸಾಲೆ ದೋಸೆಯೇ ಕೊಡಿ. | Beda, maamooli masaale doseyee kodi. | No, give regular masala dosa itself. | Clear fallback preference. | `rest_node_3` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_2_special:opt:2` | **`ok`** | ರೇಟ್ ಎಷ್ಟು? ತುಂಬಾ ಕಾಸ್ಟ್ಲಿನಾ? | Rate eshtu? Thumba costly-naa? | What is the rate? Is it too costly? | Can be asked more naturally like 'eshtu aaguththe?'. | `rest_node_3` | [ ] Approved <br> [ ] Fixed |

#### Node `rest_node_3` — Speaker: **Waiter**
- **Line ID**: `rp:restaurant:rest_node_3:line`
- **Kannada**: ಆರ್ಡರ್ ಬಂತು ಸಾರ್. ಕುಡಿಯೋಕೆ ಬಿಸಿ ನೀರು ಬೇಕಾ?
- **Transliteration**: *Order banthu saar. Kudiyoke bisi neeru bekaa?*
- **English**: "Here is your order sir. Do you want warm water to drink?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:restaurant:rest_node_3:opt:0` | **`good`** | ಹೌದು, ಕುಡಿಯೋಕೆ ಬಿಸಿ ನೀರು ಕೊಡಿ. ಧನ್ಯವಾದಗಳು. | Haudhu, kudiyoke bisi neeru kodi. Dhanyavaadhagalu. | Yes, please give warm drinking water. Thank you. | Pleasant and polite dining etiquette. | `rest_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_3:opt:1` | **`ok`** | ಮಾಮೂಲಿ ನೀರು ಕೊಡಿ. | Maamooli neeru kodi. | Give regular water. | Direct preference. | `rest_node_4` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_3:opt:2` | **`poor`** | ನೀರು ಬೇಡ. | Neeru beda. | No water. | Short and blunt. | `rest_node_4` | [ ] Approved <br> [ ] Fixed |

#### Node `rest_node_4` — Speaker: **Waiter**
- **Line ID**: `rp:restaurant:rest_node_4:line`
- **Kannada**: ತಿಂಡಿ ಮುಗೀತಾ ಸಾರ್? ಬಿಲ್ ತರಲಾ?
- **Transliteration**: *Thindi mugeethaa saar? Bill tharalaa?*
- **English**: "Finished snacks sir? Shall I bring the bill?"

| Option ID | Quality Rating | Reply Kannada (`kn`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |
|---|---|---|---|---|---|---|---|
| `rp:restaurant:rest_node_4:opt:0` | **`good`** | ಹೌದು, ಬಿಲ್ ತನ್ನಿ. ಊಟ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು! | Haudhu, bill thanni. Oota thumba chennaagithu! | Yes, bring the bill. Food was very delicious! | Warm appreciation and prompt bill request. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_4:opt:1` | **`ok`** | ಬಿಲ್ ಕೊಡಿ, UPI ಸ್ಕ್ಯಾನ್ ಮಾಡ್ತೀನಿ. | Bill kodi, UPI scan maadthini. | Give bill, I will scan UPI. | Clear payment intent. | `null (end)` | [ ] Approved <br> [ ] Fixed |
| `rp:restaurant:rest_node_4:opt:2` | **`poor`** | ಬಿಲ್ ತನ್ನಿ ಬೇಗ. | Bill thanni bega. | Bring the bill quickly. | Unnecessarily demanding. | `null (end)` | [ ] Approved <br> [ ] Fixed |

---

## Part 3: Scenario Quizzes (All 25 Questions, Options, Correct Answers & Explanations)

### 3.1 Transport Quiz (`transport`)

| Question ID | Prompt | Options (0–3) | Correct Answer | Explanation | Review Status |
|---|---|---|---|---|---|
| `quiz-trans-01` | How do you ask an auto driver if they will go to Majestic in spoken Kannada? | **[0] ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? (Majestic-ge hogthira?) ✓**<br>[1] ಮೆಜೆಸ್ಟಿಕ್ ಎಲ್ಲಿ ಇದೆ? (Majestic elli idhe?)<br>[2] ನನಗೆ ಮೆಜೆಸ್ಟಿಕ್ ಇಷ್ಟ ಇಲ್ಲ (Nanage Majestic ishta illa)<br>[3] ಮೆಜೆಸ್ಟಿಕ್‌ನಲ್ಲಿ ನಿಲ್ಲಿ (Majestic-nalli nilli) | Index `0`: ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? (Majestic-ge hogthira?) | 'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ?' (Majestic-ge hogthira?) is the natural and respectful spoken way to ask if the driver is heading there. | [ ] Approved <br> [ ] Fixed |
| `quiz-trans-02` | Which phrase asks the driver to turn on the fare meter? | [0] ಬೆಲೆ ಎಷ್ಟು? (Bele eshtu?)<br>**[1] ಮೀಟರ್ ಹಾಕಿ, ಪ್ಲೀಸ್. (Meter haaki, please.) ✓**<br>[2] ಮೀಟರ್ ಬೇಡ (Meter beda)<br>[3] ಸ್ವಲ್ಪ ನಿಲ್ಲಿಸಿ (Swalpa nillisi) | Index `1`: ಮೀಟರ್ ಹಾಕಿ, ಪ್ಲೀಸ್. (Meter haaki, please.) | 'ಮೀಟರ್ ಹಾಕಿ' (Meter haaki) directly requests turning on the auto meter. | [ ] Approved <br> [ ] Fixed |
| `quiz-trans-03` | How do you tell the driver to stop here? | [0] ಬೇಗ ಹೋಗಿ (Bega hogi)<br>**[1] ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ (Illi nillisi) ✓**<br>[2] ರೈಟ್ ತಗೊಳ್ಳಿ (Right thagoli)<br>[3] ಟಿಕೆಟ್ ಕೊಡಿ (Ticket kodi) | Index `1`: ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ (Illi nillisi) | 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ' (Illi nillisi) means 'stop here'. | [ ] Approved <br> [ ] Fixed |
| `quiz-trans-04` | How do you ask a bus conductor for the next bus stop? | **[0] ಮುಂದಿನ ಸ್ಟಾಪ್ ಯಾವುದು? (Mundhina stop yaavudu?) ✓**<br>[1] ಬಸ್ ಯಾವಾಗ ಬರುತ್ತೆ? (Bus yaavaaga baruththe?)<br>[2] ಇಲ್ಲಿ ಇಳಿಯಿರಿ (Illi iliyiri)<br>[3] ಎಷ್ಟು ಗಂಟೆ ಆಯ್ತು? (Eshtu gante aaythu?) | Index `0`: ಮುಂದಿನ ಸ್ಟಾಪ್ ಯಾವುದು? (Mundhina stop yaavudu?) | 'ಮುಂದಿನ ಸ್ಟಾಪ್ ಯಾವುದು?' (Mundhina stop yaavudu?) asks 'Which is the next stop?'. | [ ] Approved <br> [ ] Fixed |
| `quiz-trans-05` | What do you say when you have no cash and want to pay via UPI? | [0] ಕ್ಯಾಶ್ ಮಾತ್ರ ತಗೊಳ್ಳಿ (Cash maathra thagoli)<br>**[1] ಆನ್‌ಲೈನ್ ಪೇಮೆಂಟ್ / UPI ಇದ್ಯಾ? (Online payment / UPI idhya?) ✓**<br>[2] ಚಿಲ್ಲರೆ ಕೊಡಿ (Chillare kodi)<br>[3] ಕಾರ್ಡ್ ಬೇಡ (Card beda) | Index `1`: ಆನ್‌ಲೈನ್ ಪೇಮೆಂಟ್ / UPI ಇದ್ಯಾ? (Online payment / UPI idhya?) | 'UPI ಇದ್ಯಾ?' (UPI idhya?) is widely used across Karnataka to ask for digital payment QR code. | [ ] Approved <br> [ ] Fixed |

### 3.2 Shopping Quiz (`shopping`)

| Question ID | Prompt | Options (0–3) | Correct Answer | Explanation | Review Status |
|---|---|---|---|---|---|
| `quiz-shop-01` | How do you ask 'How much is this?' in a shop? | **[0] ಇದು ಎಷ್ಟು ಬೆಲೆ? (Idhu eshtu bele?) ✓**<br>[1] ಇದು ಎಲ್ಲಿಂದ ಬಂತು? (Idhu ellindha banthu?)<br>[2] ಇದು ಬೇಡ (Idhu beda)<br>[3] ಇದು ಹೊಸದಾ? (Idhu hosadhaa?) | Index `0`: ಇದು ಎಷ್ಟು ಬೆಲೆ? (Idhu eshtu bele?) | 'ಇದು ಎಷ್ಟು ಬೆಲೆ?' or simply 'ಇದು ಎಷ್ಟು?' means 'How much is this?'. | [ ] Approved <br> [ ] Fixed |
| `quiz-shop-02` | What do you say to politely ask the shopkeeper to reduce the price? | [0] ತುಂಬಾ ಕಮ್ಮಿ ಇದೆ (Thumba kammi idhe)<br>**[1] ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ (Swalpa kammi maadi) ✓**<br>[2] ಜಾಸ್ತಿ ಮಾಡಿ (Jaasthi maadi)<br>[3] ದುಡ್ಡು ಕೊಡಲ್ಲ (Duddu kodalla) | Index `1`: ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ (Swalpa kammi maadi) | 'ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ' (Swalpa kammi maadi) is standard, polite bargaining in Kannada. | [ ] Approved <br> [ ] Fixed |
| `quiz-shop-03` | How do you request a carry bag at the counter? | **[0] ಕವರ್ ಕೊಡಿ (Cover kodi) ✓**<br>[1] ಪೆನ್ ಕೊಡಿ (Pen kodi)<br>[2] ಬಾಕ್ಸ್ ಬೇಡ (Box beda)<br>[3] ನೀರು ಕೊಡಿ (Neeru kodi) | Index `0`: ಕವರ್ ಕೊಡಿ (Cover kodi) | In everyday spoken Kannada, 'ಕವರ್ ಕೊಡಿ' (Cover kodi) is the ubiquitous way to ask for a bag. | [ ] Approved <br> [ ] Fixed |
| `quiz-shop-04` | How do you ask 'Give one kilogram'? | [0] ಅರ್ಧ ಕಿಲೋ ಕೊಡಿ (Ardha kilo kodi)<br>**[1] ಒಂದು ಕಿಲೋ ಕೊಡಿ (Ondhu kilo kodi) ✓**<br>[2] ಎರಡು ಕಿಲೋ ಬೇಡ (Eradu kilo beda)<br>[3] ಹತ್ತು ಕಿಲೋ ಕೊಡಿ (Haththu kilo kodi) | Index `1`: ಒಂದು ಕಿಲೋ ಕೊಡಿ (Ondhu kilo kodi) | 'ಒಂದು ಕಿಲೋ ಕೊಡಿ' (Ondhu kilo kodi) means 'Give one kilogram'. | [ ] Approved <br> [ ] Fixed |
| `quiz-shop-05` | How do you say 'Not this one, show another'? | **[0] ಇದು ಬೇಡ, ಬೇರೆ ತೋರ್ಸಿ (Idhu beda, bere thorsi) ✓**<br>[1] ಇದೇ ಕೊಡಿ (Idhe kodi)<br>[2] ಇದು ಚೆನ್ನಾಗಿದೆ (Idhu chennaagidhe)<br>[3] ಎಲ್ಲಾ ಕೊಡಿ (Ella kodi) | Index `0`: ಇದು ಬೇಡ, ಬೇರೆ ತೋರ್ಸಿ (Idhu beda, bere thorsi) | 'ಇದು ಬೇಡ, ಬೇರೆ ತೋರ್ಸಿ' means 'I don't want this, show another one'. | [ ] Approved <br> [ ] Fixed |

### 3.3 Healthcare Quiz (`healthcare`)

| Question ID | Prompt | Options (0–3) | Correct Answer | Explanation | Review Status |
|---|---|---|---|---|---|
| `quiz-health-01` | How do you tell the doctor that you have a headache? | **[0] ನನಗೆ ತಲೆ ನೋವು ಇದೆ (Nanage thale novu idhe) ✓**<br>[1] ನನಗೆ ಹೊಟ್ಟೆ ಹಸಿವಿದೆ (Nanage hotte hasividhe)<br>[2] ನನಗೆ ನಿದ್ದೆ ಬರ್ತಿದೆ (Nanage nidhdhe barthidhe)<br>[3] ನನಗೆ ಕಾಲು ನೋವು ಇಲ್ಲ (Nanage kaalu novu illa) | Index `0`: ನನಗೆ ತಲೆ ನೋವು ಇದೆ (Nanage thale novu idhe) | 'ತಲೆ ನೋವು' (thale novu) means headache, and 'ಇದೆ' (idhe) means is there / I have. | [ ] Approved <br> [ ] Fixed |
| `quiz-health-02` | What do you say to indicate fever for the past two days? | **[0] ಎರಡು ದಿನದಿಂದ ಜ್ವರ ಬಂದಿದೆ (Eradu dhinadhinda jvara bandhidhe) ✓**<br>[1] ಜ್ವರ ಕಡಿಮೆ ಆಗಿದೆ (Jvara kadime aagidhe)<br>[2] ನಾಳೆ ಜ್ವರ ಬರುತ್ತೆ (Naale jvara baruththe)<br>[3] ಜ್ವರ ಇಲ್ಲ (Jvara illa) | Index `0`: ಎರಡು ದಿನದಿಂದ ಜ್ವರ ಬಂದಿದೆ (Eradu dhinadhinda jvara bandhidhe) | 'ಎರಡು ದಿನದಿಂದ ಜ್ವರ ಬಂದಿದೆ' means fever has come since two days. | [ ] Approved <br> [ ] Fixed |
| `quiz-health-03` | How do you ask whether a tablet should be taken after food? | [0] ಊಟಕ್ಕಿಂತ ಮುಂಚೆ ತಗೋಬೇಕಾ? (Ootakkinta munche thagobekaa?)<br>**[1] ಊಟ ಆದ್ಮೇಲೆ ತಗೋಬೇಕಾ? (Oota aadhmele thagobekaa?) ✓**<br>[2] ಊಟ ಬೇಡವಾ? (Oota bedavaa?)<br>[3] ಮಾತ್ರೆ ತಗೋಬಾರದಾ? (Maathre thagobaaradhaa?) | Index `1`: ಊಟ ಆದ್ಮೇಲೆ ತಗೋಬೇಕಾ? (Oota aadhmele thagobekaa?) | 'ಊಟ ಆದ್ಮೇಲೆ ತಗೋಬೇಕಾ?' translates to 'Should I take it after meals?'. | [ ] Approved <br> [ ] Fixed |
| `quiz-health-04` | How do you tell medical staff that you are allergic to a medicine? | [0] ನನಗೆ ಈ ಮೆಡಿಸಿನ್ ಇಷ್ಟ (Nanage ee medicine ishta)<br>**[1] ನನಗೆ ಈ ಮೆಡಿಸಿನ್ ಅಲರ್ಜಿ ಇದೆ (Nanage ee medicine allergy idhe) ✓**<br>[2] ಮೆಡಿಸಿನ್ ತಗೊಳ್ಳಲ್ಲ (Medicine thagollalla)<br>[3] ಡಾಕ್ಟರ್ ಬೇಡ (Doctor beda) | Index `1`: ನನಗೆ ಈ ಮೆಡಿಸಿನ್ ಅಲರ್ಜಿ ಇದೆ (Nanage ee medicine allergy idhe) | 'ನನಗೆ ಈ ಮೆಡಿಸಿನ್ ಅಲರ್ಜಿ ಇದೆ' clearly communicates a medical drug allergy. | [ ] Approved <br> [ ] Fixed |
| `quiz-health-05` | How do you ask when the doctor will arrive? | **[0] ಡಾಕ್ಟರ್ ಯಾವಾಗ ಬರ್ತಾರೆ? (Doctor yaavaaga barthaare?) ✓**<br>[1] ಡಾಕ್ಟರ್ ಎಲ್ಲಿ ಹೋಗಿದ್ದಾರೆ? (Doctor elli hogidhaare?)<br>[2] ಡಾಕ್ಟರ್ ಬಂದಿಲ್ಲ (Doctor bandhilla)<br>[3] ಡಾಕ್ಟರ್ ಯಾರು? (Doctor yaaru?) | Index `0`: ಡಾಕ್ಟರ್ ಯಾವಾಗ ಬರ್ತಾರೆ? (Doctor yaavaaga barthaare?) | 'ಡಾಕ್ಟರ್ ಯಾವಾಗ ಬರ್ತಾರೆ?' is the polite inquiry for doctor arrival time. | [ ] Approved <br> [ ] Fixed |

### 3.4 Workplace Quiz (`workplace`)

| Question ID | Prompt | Options (0–3) | Correct Answer | Explanation | Review Status |
|---|---|---|---|---|---|
| `quiz-work-01` | How do you politely ask a coworker to send a file? | **[0] ಈ ಫೈಲ್ ಕಳಿಸಿ (Ee file kalisi) ✓**<br>[1] ಫೈಲ್ ಡಿಲೀಟ್ ಮಾಡಿ (File delete maadi)<br>[2] ಫೈಲ್ ಬೇಡ (File beda)<br>[3] ಇದು ನನ್ನ ಫೈಲ್ (Idhu nanna file) | Index `0`: ಈ ಫೈಲ್ ಕಳಿಸಿ (Ee file kalisi) | 'ಕಳಿಸಿ' (kalisi) means 'please send'. | [ ] Approved <br> [ ] Fixed |
| `quiz-work-02` | How do you ask 'When is the meeting?' | [0] ಮೀಟಿಂಗ್ ಮುಗೀತಾ? (Meeting mugeethaa?)<br>**[1] ಮೀಟಿಂಗ್ ಯಾವಾಗ ಇದೆ? (Meeting yaavaaga idhe?) ✓**<br>[2] ಮೀಟಿಂಗ್ ಕ್ಯಾನ್ಸಲ್ ಆಯ್ತಾ? (Meeting cancel aaythaa?)<br>[3] ಮೀಟಿಂಗ್ ರೂಮ್ ಎಲ್ಲಿದೆ? (Meeting room ellidhe?) | Index `1`: ಮೀಟಿಂಗ್ ಯಾವಾಗ ಇದೆ? (Meeting yaavaaga idhe?) | 'ಯಾವಾಗ ಇದೆ?' (yaavaaga idhe?) means 'when is it?'. | [ ] Approved <br> [ ] Fixed |
| `quiz-work-03` | How do you tell your lead that you need leave tomorrow? | **[0] ನಾಳೆ ರಜೆ / ಲೀವ್ ಬೇಕಾಗಿತ್ತು (Naale raje / leave bekaagithu) ✓**<br>[1] ಇವತ್ತು ಕೆಲಸ ಮಾಡ್ತೀನಿ (Ivathu kelasa maadthini)<br>[2] ನಾಳೆ ಮೀಟಿಂಗ್ ಇದೆ (Naale meeting idhe)<br>[3] ರಜೆ ಬೇಡ (Raje beda) | Index `0`: ನಾಳೆ ರಜೆ / ಲೀವ್ ಬೇಕಾಗಿತ್ತು (Naale raje / leave bekaagithu) | 'ನಾಳೆ ರಜೆ ಬೇಕಾಗಿತ್ತು' expresses a polite need for leave tomorrow. | [ ] Approved <br> [ ] Fixed |
| `quiz-work-04` | How do you announce that a task/work is completed? | [0] ಈ ಕೆಲಸ ಶುರು ಮಾಡಿಲ್ಲ (Ee kelasa shuru maadilla)<br>**[1] ಈ ಕೆಲಸ ಮುಗಿದಿದೆ (Ee kelasa mugidhidhe) ✓**<br>[2] ಕೆಲಸ ಕಷ್ಟ ಇದೆ (Kelasa kashta idhe)<br>[3] ನಾಳೆ ಮಾಡ್ತೀನಿ (Naale maadthini) | Index `1`: ಈ ಕೆಲಸ ಮುಗಿದಿದೆ (Ee kelasa mugidhidhe) | 'ಮುಗಿದಿದೆ' (mugidhidhe) means completed / finished. | [ ] Approved <br> [ ] Fixed |
| `quiz-work-05` | How do you invite a colleague for a tea/coffee break? | **[0] ಚಹಾ / ಕಾಫಿ ಕುಡಿಯೋಣ್ವಾ? (Chaha / coffee kudiyonwaa?) ✓**<br>[1] ಕಾಫಿ ಚೆನ್ನಾಗಿಲ್ಲ (Coffee chennaagilla)<br>[2] ಚಹಾ ಬೇಡ (Chaha beda)<br>[3] ಕೆಲಸ ನಿಲ್ಲಿಸಿ (Kelasa nillisi) | Index `0`: ಚಹಾ / ಕಾಫಿ ಕುಡಿಯೋಣ್ವಾ? (Chaha / coffee kudiyonwaa?) | 'ಕುಡಿಯೋಣ್ವಾ?' (kudiyonwaa?) is the friendly spoken invitation 'shall we drink?'. | [ ] Approved <br> [ ] Fixed |

### 3.5 Restaurant Quiz (`restaurant`)

| Question ID | Prompt | Options (0–3) | Correct Answer | Explanation | Review Status |
|---|---|---|---|---|---|
| `quiz-rest-01` | How do you order one Masala Dosa? | **[0] ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ (Ondhu masaale dose kodi) ✓**<br>[1] ದೋಸೆ ಬೇಡ (Dose beda)<br>[2] ದೋಸೆ ತಿಂದೆ (Dose thinde)<br>[3] ದೋಸೆ ಸುಟ್ಟುಹೋಗಿದೆ (Dose suthuhogidhe) | Index `0`: ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ (Ondhu masaale dose kodi) | 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ' is the standard way to order one masala dosa. | [ ] Approved <br> [ ] Fixed |
| `quiz-rest-02` | How do you request food to be less spicy? | [0] ತುಂಬಾ ಖಾರ ಹಾಕಿ (Thumba khaara haaki)<br>**[1] ಖಾರ ಕಮ್ಮಿ ಮಾಡಿ (Khaara kammi maadi) ✓**<br>[2] ಉಪ್ಪು ಜಾಸ್ತಿ ಮಾಡಿ (Uppu jaasthi maadi)<br>[3] ಖಾರವೇ ಬೇಡ (Khaarave beda) | Index `1`: ಖಾರ ಕಮ್ಮಿ ಮಾಡಿ (Khaara kammi maadi) | 'ಖಾರ ಕಮ್ಮಿ ಮಾಡಿ' (Khaara kammi maadi) tells the kitchen to reduce spice/heat. | [ ] Approved <br> [ ] Fixed |
| `quiz-rest-03` | How do you ask for drinking water? | **[0] ಕುಡಿಯೋಕೆ ನೀರು ಕೊಡಿ (Kudiyoke neeru kodi) ✓**<br>[1] ಹಾಲು ಕೊಡಿ (Haalu kodi)<br>[2] ಜ್ಯೂಸ್ ಬೇಡ (Juice beda)<br>[3] ನೀರು ಚೆಲ್ಲಿತು (Neeru chellithu) | Index `0`: ಕುಡಿಯೋಕೆ ನೀರು ಕೊಡಿ (Kudiyoke neeru kodi) | 'ಕುಡಿಯೋಕೆ ನೀರು ಕೊಡಿ' means 'Please bring drinking water'. | [ ] Approved <br> [ ] Fixed |
| `quiz-rest-04` | How do you ask to pack food for takeaway? | [0] ಇಲ್ಲೇ ತಿಂತೀನಿ (Ille thinthini)<br>**[1] ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ (Parcel katti kodi) ✓**<br>[2] ಪ್ಲೇಟ್ ತನ್ನಿ (Plate thanni)<br>[3] ತಿಂಡಿ ಬೇಡ (Thindi beda) | Index `1`: ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ (Parcel katti kodi) | 'ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ' is the standard phrase for food packaging/takeaway. | [ ] Approved <br> [ ] Fixed |
| `quiz-rest-05` | How do you compliment the food saying 'The food was very good'? | **[0] ಊಟ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು (Oota thumba chennaagithu) ✓**<br>[1] ಊಟ ಸರಿ ಇಲ್ಲ (Oota sari illa)<br>[2] ಊಟ ತಣ್ಣಗಾಗಿದೆ (Oota thannagaagidhe)<br>[3] ಊಟ ಬಂದಿಲ್ಲ (Oota bandhilla) | Index `0`: ಊಟ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು (Oota thumba chennaagithu) | 'ಊಟ ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು' (Oota thumba chennaagithu) is a warm, authentic compliment to the chef/server. | [ ] Approved <br> [ ] Fixed |
