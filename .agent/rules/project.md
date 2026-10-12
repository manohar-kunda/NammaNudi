# NammaNudi: project rules

Project: a mobile-first web app that helps non-Kannada speakers handle everyday
situations in Karnataka (transport, shopping, healthcare, workplace, restaurant).
Hackathon: Kannada Digital Innovation Hackathon 2026, problem statement 03.
Deadline: submit by 25 Oct 2026. Solo developer, Windows + PowerShell.

## Stack (do not change without asking)
- /frontend: React + Vite, plain CSS or Tailwind, Noto Sans Kannada font
- /backend: Java 17+, Spring Boot, Maven, H2 (in-memory) seeded from /data/*.json
- No auth, no accounts, no Docker, no microservices. Progress lives in localStorage.

## Scope rules
- Only build what the current prompt asks for. No extra features.
- If something is risky or optional, ask first instead of adding it.
- Keep the app fully working with no external AI service.

## Content rules
- Never invent claims about verification. Every phrase has `"reviewed": false`
  until I set it to true after a native speaker checks it.
- Healthcare phrases are communication aids, not medical advice.

## Engineering rules
- Layered backend: controller, service, repository, DTO. Validate inputs.
- Consistent JSON errors: {"error": "...", "status": 400}.
- Write tests for service logic and each endpoint.
- Never commit secrets. Use .env and .env.example.
- Ask before: deleting files, adding dependencies, deploying, or running
  commands that cost money.
- After each task: run the build and tests, then tell me exactly what passed.
  Do not say something works unless you ran it.
- Small, buildable commits.

## API contract (frontend and backend both follow this)
GET /api/health                       -> {"status":"ok"}
GET /api/scenarios                    -> [{id, slug, title, icon, phraseCount}]
GET /api/scenarios/{slug}/phrases     -> [Phrase]
GET /api/phrases?q=&scenario=         -> [Phrase]   (limit 50)
GET /api/scenarios/{slug}/roleplay    -> Roleplay
GET /api/scenarios/{slug}/quiz        -> [Question]  (5 items)

Phrase: {id, scenario, kn, translit, en, example:{kn,translit,en}, reviewed}
Roleplay: {title, start, nodes:{id:{speaker, kn, translit, en, options:[{kn,translit,en,feedback,quality,next}]}}}
  quality is "good" | "ok" | "poor"; next is null at the end of the dialogue.
Question: {id, prompt, options:[string], answerIndex, explanation}
