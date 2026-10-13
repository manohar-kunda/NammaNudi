#!/usr/bin/env node
/**
 * Generates the Native-Speaker Review Pack:
 * 1. /docs/review/content_review_pack.csv (UTF-8 with BOM for Excel & Google Sheets)
 * 2. /docs/CONTENT_REVIEW.md (complete human-readable review tables covering all
 *    50 phrases + examples, all role-play speaker lines + reply options + feedback/ratings,
 *    and all 25 quiz questions + options + explanations).
 *
 * Usage (from repository root in PowerShell):
 *   node data/tools/export-review.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const REVIEW_DIR = path.join(DOCS_DIR, 'review');

const phrases = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'phrases.json'), 'utf8'));
const roleplay = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'roleplay.json'), 'utf8'));
const quiz = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'quiz.json'), 'utf8'));
const scenarios = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'scenarios.json'), 'utf8'));

function escapeCsvCell(val) {
  const str = val === null || val === undefined ? '' : String(val);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function splitQuizOption(optStr) {
  const match = /^(.+?)\s*\(([^()]+)\)\s*$/.exec(optStr || '');
  if (match) {
    return { kn: match[1].trim(), translit: match[2].trim() };
  }
  return { kn: optStr || '', translit: '' };
}

const csvRows = [];
const CSV_HEADERS = [
  'id',
  'type',
  'kn',
  'translit',
  'en',
  'feedback_or_explanation',
  'rating',
  'reviewer_status',
  'corrected_kn',
  'corrected_translit',
  'notes',
];
csvRows.push(CSV_HEADERS);

// 1. All 50 Phrases + 50 Examples
for (const p of phrases) {
  csvRows.push([
    p.id,
    'phrase',
    p.kn,
    p.translit,
    p.en,
    '',
    '',
    p.reviewed ? 'approved' : '',
    '',
    '',
    '',
  ]);

  if (p.example) {
    csvRows.push([
      `${p.id}:example`,
      'phrase_example',
      p.example.kn,
      p.example.translit,
      p.example.en,
      `Example for ${p.id}`,
      '',
      '',
      '',
      '',
      '',
    ]);
  }
}

// 2. All Role-play Speaker Lines & Reply Options
for (const [scenarioSlug, rp] of Object.entries(roleplay)) {
  const nodes = rp.nodes || {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    csvRows.push([
      `rp:${scenarioSlug}:${nodeId}:line`,
      'roleplay_line',
      node.kn,
      node.translit,
      node.en,
      `Speaker: ${node.speaker} (${rp.title})`,
      '',
      '',
      '',
      '',
      '',
    ]);

    (node.options || []).forEach((opt, idx) => {
      csvRows.push([
        `rp:${scenarioSlug}:${nodeId}:opt:${idx}`,
        'roleplay_option',
        opt.kn,
        opt.translit,
        opt.en,
        opt.feedback || '',
        opt.quality || '',
        '',
        '',
        '',
        '',
      ]);
    });
  }
}

// 3. All 25 Quiz Questions & 100 Quiz Options
for (const [scenarioSlug, questions] of Object.entries(quiz)) {
  for (const q of questions) {
    const correctOpt = q.options[q.answerIndex] || '';
    csvRows.push([
      q.id,
      'quiz_question',
      '',
      '',
      q.prompt,
      q.explanation,
      `answerIndex=${q.answerIndex} (${correctOpt})`,
      '',
      '',
      '',
      '',
    ]);

    (q.options || []).forEach((optStr, idx) => {
      const { kn, translit } = splitQuizOption(optStr);
      const isCorrect = idx === q.answerIndex;
      csvRows.push([
        `${q.id}:opt:${idx}`,
        'quiz_option',
        kn,
        translit,
        isCorrect ? `Option ${idx} (Correct Answer)` : `Option ${idx} (Distractor)`,
        q.explanation,
        isCorrect ? 'correct' : 'distractor',
        '',
        '',
        '',
        '',
      ]);
    });
  }
}

if (!fs.existsSync(REVIEW_DIR)) {
  fs.mkdirSync(REVIEW_DIR, { recursive: true });
}

const csvContent =
  '\uFEFF' + csvRows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n') + '\r\n';
const csvPath = path.join(REVIEW_DIR, 'content_review_pack.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

// Build comprehensive /docs/CONTENT_REVIEW.md
function mdEscape(str) {
  return String(str || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

let md = `# NammaNudi — Complete Native-Speaker Content Review Pack

This document contains **all user-facing Kannada, transliteration, English translations, pedagogical feedback, role-play ratings, and quiz explanations** in NammaNudi for verification by a native Kannada speaker.

Per project content rules:
- Every phrase starts with \`"reviewed": false\` in \`/data/phrases.json\` until verified by a native speaker.
- Target style is **natural, everyday spoken Kannada** used in Karnataka (not stiff textbook prose).
- Healthcare phrases are conversational clinic/pharmacy communication aids, not medical advice.

## Spreadsheet Review & Automated Import Workflow
- **CSV Export (UTF-8 with BOM for Excel / Google Sheets)**: [\`docs/review/content_review_pack.csv\`](review/content_review_pack.csv)
- **Reviewer Instructions**:
  1. Open \`docs/review/content_review_pack.csv\` in Excel or Google Sheets.
  2. For each row, set \`reviewer_status\` to \`approved\`, \`fixed\`, or \`needs-work\`.
  3. If a Kannada script or Roman transliteration needs adjustment, fill in \`corrected_kn\` and/or \`corrected_translit\` (and optional \`notes\`).
  4. Run the review application tool from PowerShell:
     - **Dry run (default, no files modified)**:
       \`\`\`powershell
       node data/tools/apply-review.js
       \`\`\`
     - **Apply changes to \`/data/*.json\` and run data integrity checks**:
       \`\`\`powershell
       node data/tools/apply-review.js --apply
       \`\`\`

---

## Part 1: Situational Phrases & Example Sentences (50 Phrases)
`;

for (let i = 0; i < scenarios.length; i++) {
  const sc = scenarios[i];
  const scPhrases = phrases.filter((p) => p.scenario === sc.slug);
  md += `\n### 1.${i + 1} ${sc.title} (\`${sc.slug}\`)\n\n`;
  if (sc.slug === 'healthcare') {
    md += `> [!NOTE]\n> Healthcare phrases are communication aids for everyday clinic visits, not medical advice.\n\n`;
  }
  md += `| ID | Kannada (\`kn\`) | Transliteration (\`translit\`) | English (\`en\`) | Example Sentence (\`kn\` / \`translit\` / \`en\`) | Reviewed | Status / Notes |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  for (const p of scPhrases) {
    const ex = p.example
      ? `${p.example.kn} <br> *${p.example.translit}* <br> "${p.example.en}"`
      : '';
    md += `| \`${p.id}\` | ${mdEscape(p.kn)} | ${mdEscape(p.translit)} | ${mdEscape(p.en)} | ${mdEscape(ex)} | \`${Boolean(p.reviewed)}\` | [ ] Approved <br> [ ] Fixed |\n`;
  }
}

md += `\n---\n\n## Part 2: Interactive Role-Play Dialogues (All Speaker Lines, Reply Options, Feedback & Ratings)\n`;

for (let i = 0; i < scenarios.length; i++) {
  const sc = scenarios[i];
  const rp = roleplay[sc.slug];
  if (!rp) continue;
  md += `\n### 2.${i + 1} ${sc.title}: ${rp.title} (\`${sc.slug}\`, start: \`${rp.start}\`)\n\n`;

  for (const [nodeId, node] of Object.entries(rp.nodes || {})) {
    md += `#### Node \`${nodeId}\` — Speaker: **${node.speaker}**\n`;
    md += `- **Line ID**: \`rp:${sc.slug}:${nodeId}:line\`\n`;
    md += `- **Kannada**: ${node.kn}\n`;
    md += `- **Transliteration**: *${node.translit}*\n`;
    md += `- **English**: "${node.en}"\n\n`;

    md += `| Option ID | Quality Rating | Reply Kannada (\`kn\`) | Reply Transliteration | Reply English | Pedagogical Feedback | Next Node | Review Status |\n`;
    md += `|---|---|---|---|---|---|---|---|\n`;
    (node.options || []).forEach((opt, idx) => {
      const optId = `rp:${sc.slug}:${nodeId}:opt:${idx}`;
      md += `| \`${optId}\` | **\`${opt.quality}\`** | ${mdEscape(opt.kn)} | ${mdEscape(opt.translit)} | ${mdEscape(opt.en)} | ${mdEscape(opt.feedback)} | \`${opt.next ?? 'null (end)'}\` | [ ] Approved <br> [ ] Fixed |\n`;
    });
    md += `\n`;
  }
}

md += `---\n\n## Part 3: Scenario Quizzes (All 25 Questions, Options, Correct Answers & Explanations)\n`;

for (let i = 0; i < scenarios.length; i++) {
  const sc = scenarios[i];
  const qs = quiz[sc.slug] || [];
  md += `\n### 3.${i + 1} ${sc.title} Quiz (\`${sc.slug}\`)\n\n`;
  md += `| Question ID | Prompt | Options (0–3) | Correct Answer | Explanation | Review Status |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const q of qs) {
    const optsFormatted = (q.options || [])
      .map((o, idx) => `${idx === q.answerIndex ? '**' : ''}[${idx}] ${mdEscape(o)}${idx === q.answerIndex ? ' ✓**' : ''}`)
      .join('<br>');
    md += `| \`${q.id}\` | ${mdEscape(q.prompt)} | ${optsFormatted} | Index \`${q.answerIndex}\`: ${mdEscape(q.options[q.answerIndex])} | ${mdEscape(q.explanation)} | [ ] Approved <br> [ ] Fixed |\n`;
  }
}

const mdPath = path.join(DOCS_DIR, 'CONTENT_REVIEW.md');
fs.writeFileSync(mdPath, md, 'utf8');

console.log(`Exported ${csvRows.length - 1} review rows to: ${csvPath}`);
console.log(`Updated comprehensive review guide at: ${mdPath}`);
