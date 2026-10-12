# NammaNudi Backend API Documentation

NammaNudi is a mobile-first Kannada situational language assistant built for the **Kannada Digital Innovation Hackathon 2026**. This backend provides situational phrases, interactive branching roleplay dialogues, quizzes, and search capabilities powered by Spring Boot 4.1.1, Java 21, and an in-memory H2 database seeded from `/data/*.json`.

---

## Server & Environment Configuration

### Default Server Port
- **Port**: `8081` (chosen as default to prevent port conflicts with running web services such as Apache HTTPD on port `8080`).
- **Base URL**: `http://localhost:8081`

### Environment Variables
| Variable | Description | Default Value |
|---|---|---|
| `SERVER_PORT` | HTTP server listening port | `8081` |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CORS | `http://localhost:5173` |

---

## Standard Error Response Format
All error responses across all endpoints adhere to the consistent contract:
```json
{
  "error": "Error description message",
  "status": 400
}
```
- **404 Not Found**: Returned when a requested scenario slug does not exist.
- **400 Bad Request**: Returned for invalid input parameters (e.g., search queries longer than 100 characters).

---

## API Endpoints

### 1. Health Check
Checks service liveness.

- **Method / Path**: `GET /api/health`
- **Response**: `200 OK`
```json
{
  "status": "ok"
}
```

---

### 2. List Scenarios
Returns all available everyday Karnataka scenarios.

- **Method / Path**: `GET /api/scenarios`
- **Response**: `200 OK`
```json
[
  {
    "id": "transport",
    "slug": "transport",
    "title": "Transport",
    "icon": "bus",
    "phraseCount": 10
  },
  {
    "id": "shopping",
    "slug": "shopping",
    "title": "Shopping",
    "icon": "shopping-bag",
    "phraseCount": 10
  },
  {
    "id": "healthcare",
    "slug": "healthcare",
    "title": "Healthcare",
    "icon": "heart-pulse",
    "phraseCount": 10
  },
  {
    "id": "workplace",
    "slug": "workplace",
    "title": "Workplace",
    "icon": "briefcase",
    "phraseCount": 10
  },
  {
    "id": "restaurant",
    "slug": "restaurant",
    "title": "Restaurant",
    "icon": "utensils",
    "phraseCount": 10
  }
]
```

---

### 3. Get Phrases for Scenario
Returns all phrases for a given scenario slug.

- **Method / Path**: `GET /api/scenarios/{slug}/phrases`
- **Path Parameters**:
  - `slug` (string, required): Scenario identifier (`transport`, `shopping`, `healthcare`, `workplace`, `restaurant`).
- **Response**: `200 OK`
```json
[
  {
    "id": "trans-01",
    "scenario": "transport",
    "kn": "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ?",
    "translit": "Majestic-ge hogthira?",
    "en": "Will you go to Majestic?",
    "example": {
      "kn": "ಅಣ್ಣಾ, ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ?",
      "translit": "Anna, Majestic-ge hogthira?",
      "en": "Brother, will you go to Majestic?"
    },
    "reviewed": false
  }
]
```
- **Error Response**: `404 Not Found` if `{slug}` is unknown:
```json
{
  "error": "Scenario not found: unknown_slug",
  "status": 404
}
```

---

### 4. Search Phrases
Case-insensitive phrase search across Kannada script (`kn`), Roman transliteration (`translit`), and English translation (`en`).

- **Method / Path**: `GET /api/phrases?q={query}&scenario={slug}`
- **Query Parameters**:
  - `q` (string, optional): Search query text. Max length: **100 characters**.
  - `scenario` (string, optional): Filters search within a specific scenario.
- **Search Behavior**:
  - **Empty / blank `q`**: Returns all phrases (or all phrases matching `scenario` if specified), up to the 50 results cap.
  - **`q` longer than 100 characters**: Returns `400 Bad Request`.
  - **Results limit**: Strictly capped at a maximum of **50 results**.
- **Response**: `200 OK`
```json
[
  {
    "id": "trans-02",
    "scenario": "transport",
    "kn": "ಮೀಟರ್ ಹಾಕಿ, ಪ್ಲೀಸ್.",
    "translit": "Meter haaki, please.",
    "en": "Please turn on the meter.",
    "example": {
      "kn": "ಮೀಟರ್ ಹಾಕಿ ಹೋಗಿ ಅಣ್ಣಾ.",
      "translit": "Meter haaki hogi anna.",
      "en": "Please put the meter and drive, brother."
    },
    "reviewed": false
  }
]
```
- **Error Responses**:
  - `400 Bad Request` if `q` exceeds 100 characters:
  ```json
  {
    "error": "Query string must not exceed 100 characters",
    "status": 400
  }
  ```
  - `404 Not Found` if `scenario` query parameter is unknown:
  ```json
  {
    "error": "Scenario not found: invalid_slug",
    "status": 404
  }
  ```

---

### 5. Get Roleplay Tree
Retrieves the interactive branching dialogue for a scenario.

- **Method / Path**: `GET /api/scenarios/{slug}/roleplay`
- **Path Parameters**:
  - `slug` (string, required): Scenario identifier.
- **Roleplay Tree Guarantees**:
  - Every option's `next` property is either `null` (end of dialogue) or a valid node ID in `nodes`.
  - Every node in `nodes` is reachable from `start`.
  - Every conversational branch can reach a `null` ending.
  - Each option includes `quality` (`"good"` | `"ok"` | `"poor"`) and pedagogical `feedback`.
- **Response**: `200 OK`
```json
{
  "title": "Hiring an Auto in Bengaluru",
  "start": "trans_node_1",
  "nodes": {
    "trans_node_1": {
      "speaker": "Auto Driver",
      "kn": "ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು ಸಾರ್?",
      "translit": "Ellige hogbeku saar?",
      "en": "Where do you want to go, sir?",
      "options": [
        {
          "kn": "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? ಮೀಟರ್ ಹಾಕಿ.",
          "translit": "Majestic-ge hogthira? Meter haaki.",
          "en": "Will you go to Majestic? Please put the meter.",
          "feedback": "Perfect! Clear destination and polite meter request.",
          "quality": "good",
          "next": "trans_node_2"
        },
        {
          "kn": "ಮೆಜೆಸ್ಟಿಕ್ ಎಷ್ಟು?",
          "translit": "Majestic eshtu?",
          "en": "How much for Majestic?",
          "feedback": "Acceptable, but asking for flat fare encourages off-meter quotes.",
          "quality": "ok",
          "next": "trans_node_2_flat"
        },
        {
          "kn": "ಹೋಗಿ ಹೋಗಿ, ನನಗೆ ಬೇಗ ಆಗ್ಬೇಕು.",
          "translit": "Hogi hogi, nanage bega aagbeku.",
          "en": "Go go, I am in a hurry.",
          "feedback": "Unclear destination and sounds impolite.",
          "quality": "poor",
          "next": "trans_node_2"
        }
      ]
    }
  }
}
```
- **Error Response**: `404 Not Found` if `{slug}` is unknown:
```json
{
  "error": "Scenario not found: invalid_slug",
  "status": 404
}
```

---

### 6. Get Quiz Questions
Retrieves 5 practice quiz questions drawn from the scenario's phrases.

- **Method / Path**: `GET /api/scenarios/{slug}/quiz`
- **Path Parameters**:
  - `slug` (string, required): Scenario identifier.
- **Guarantees**:
  - Exactly 5 question items returned per scenario.
  - `answerIndex` is guaranteed to be within `[0, options.length - 1]`.
- **Response**: `200 OK`
```json
[
  {
    "id": "quiz-trans-01",
    "prompt": "How do you ask an auto driver if they will go to Majestic in spoken Kannada?",
    "options": [
      "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ? (Majestic-ge hogthira?)",
      "ಮೆಜೆಸ್ಟಿಕ್ ಎಲ್ಲಿ ಇದೆ? (Majestic elli idhe?)",
      "ನನಗೆ ಮೆಜೆಸ್ಟಿಕ್ ಇಷ್ಟ ಇಲ್ಲ (Nanage Majestic ishta illa)",
      "ಮೆಜೆಸ್ಟಿಕ್‌ನಲ್ಲಿ ನಿಲ್ಲಿ (Majestic-nalli nilli)"
    ],
    "answerIndex": 0,
    "explanation": "'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗ್ತೀರಾ?' (Majestic-ge hogthira?) is the natural and respectful spoken way to ask if the driver is heading there."
  }
]
```
- **Error Response**: `404 Not Found` if `{slug}` is unknown:
```json
{
  "error": "Scenario not found: invalid_slug",
  "status": 404
}
```

---

## Content Integrity Notice
Per project content integrity rules:
- Every phrase is initialized with `"reviewed": false` until checked and validated by a native Kannada speaker.
- Healthcare phrases are conversational communication aids for clinics, not medical advice.
