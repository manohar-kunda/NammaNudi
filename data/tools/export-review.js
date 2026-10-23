#!/usr/bin/env node
/**
 * Generates the Native-Speaker Review Pack:
 * 1. /docs/review/content_review_pack.csv (UTF-8 with BOM for Excel & Google Sheets)
 *    Includes `batch` column ("v1", "v2", "v3") so reviewers can easily filter to new batches.
 * 2. /docs/CONTENT_REVIEW.md (human-readable review tables covering all phrases, role-plays,
 *    quizzes, new v3 scenarios, extra phrases, words, politeness tips, and dialogues).
 *
 * Usage (from repository root in PowerShell):
 *   node data/tools/export-review.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const FRONTEND_DATA_DIR = path.join(ROOT_DIR, 'frontend', 'src', 'data');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const REVIEW_DIR = path.join(DOCS_DIR, 'review');

const phrases = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'phrases.json'), 'utf8'));
const roleplay = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'roleplay.json'), 'utf8'));
const quiz = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'quiz.json'), 'utf8'));
const scenarios = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'scenarios.json'), 'utf8'));

// Load v3 frontend data if present
const extraScenariosPath = path.join(FRONTEND_DATA_DIR, 'scenarios-extra.json');
const extraPhrasesPath = path.join(FRONTEND_DATA_DIR, 'phrases-extra.json');
const wordsPath = path.join(FRONTEND_DATA_DIR, 'words.json');

const extraScenarios = fs.existsSync(extraScenariosPath) ? JSON.parse(fs.readFileSync(extraScenariosPath, 'utf8')) : [];
const extraPhrases = fs.existsSync(extraPhrasesPath) ? JSON.parse(fs.readFileSync(extraPhrasesPath, 'utf8')) : [];
const words = fs.existsSync(wordsPath) ? JSON.parse(fs.readFileSync(wordsPath, 'utf8')) : [];

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

function getPhraseBatch(phrase) {
  if (phrase.scenario === 'basics') return 'v2';
  const match = /-(\d+)$/.exec(phrase.id || '');
  if (match && parseInt(match[1], 10) > 10) {
    return 'v2';
  }
  return 'v1';
}

const csvRows = [];
const CSV_HEADERS = [
  'id',
  'batch',
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

// 1. Backend 120 Phrases + 120 Examples (v1 / v2)
for (const p of phrases) {
  const batch = getPhraseBatch(p);
  const patternNote = p.pattern ? `Pattern: ${p.pattern.template}` : '';

  csvRows.push([
    p.id,
    batch,
    'phrase',
    p.kn,
    p.translit,
    p.en,
    patternNote,
    '',
    p.reviewed ? 'approved' : '',
    '',
    '',
    '',
  ]);

  if (p.example) {
    csvRows.push([
      `${p.id}:example`,
      batch,
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

// 2. All Role-play Speaker Lines & Reply Options (batch: v1)
for (const [scenarioSlug, rp] of Object.entries(roleplay)) {
  const nodes = rp.nodes || {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    csvRows.push([
      `rp:${scenarioSlug}:${nodeId}:line`,
      'v1',
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
        'v1',
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

// 3. All 25 Quiz Questions & 100 Quiz Options (batch: v1)
for (const [, questions] of Object.entries(quiz)) {
  for (const q of questions) {
    const correctOpt = q.options[q.answerIndex] || '';
    csvRows.push([
      q.id,
      'v1',
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
        'v1',
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

// 4. v3 Content Extension: New Scenarios Titles & Taglines
for (const sc of extraScenarios) {
  csvRows.push([
    `sc:${sc.slug}:title`,
    'v3',
    'scenario_title',
    sc.knTitle || '',
    '',
    sc.title,
    sc.tagline || '',
    '',
    '',
    '',
    '',
    'New scenario title and tagline',
  ]);
}

// 5. v3 Content Extension: Extra Phrases + Examples (40 phrases + 40 examples)
for (const p of extraPhrases) {
  csvRows.push([
    p.id,
    'v3',
    'phrase',
    p.kn,
    p.translit,
    p.en,
    `Scenario: ${p.scenario}`,
    '',
    p.reviewed ? 'approved' : '',
    '',
    '',
    'New v3 phrase',
  ]);

  if (p.example) {
    csvRows.push([
      `${p.id}:example`,
      'v3',
      'phrase_example',
      p.example.kn,
      p.example.translit,
      p.example.en,
      `Example for ${p.id}`,
      '',
      '',
      '',
      '',
      'New v3 phrase example',
    ]);
  }
}

// 6. v3 Content Extension: Words Feature (30 words, politeness claims & dialogues)
for (const w of words) {
  // Main word row
  csvRows.push([
    w.id,
    'v3',
    'word',
    w.kn,
    w.translit,
    w.en,
    `Purpose: ${w.purpose} | When: ${w.when} | Where: ${(w.where || []).join(', ')}`,
    w.type,
    w.reviewed ? 'approved' : '',
    '',
    '',
    `Register: ${w.register} | Related: ${(w.related || []).join(', ')}`,
  ]);

  // Politeness claims row (register, tip, mistake) marked specifically for native confirmation
  csvRows.push([
    `${w.id}:politeness`,
    'v3',
    'word_politeness_claim',
    '',
    '',
    `Register: ${w.register}`,
    `Tip: ${w.tip || ''} | Common Mistake: ${w.mistake || 'N/A'}`,
    w.register,
    '',
    '',
    '',
    'usage claim - needs native confirmation',
  ]);

  // Word dialogue turns
  (w.dialogue || []).forEach((turn, turnIdx) => {
    csvRows.push([
      `${w.id}:turn:${turnIdx + 1}`,
      'v3',
      'word_dialogue',
      turn.kn,
      turn.translit,
      turn.en,
      `Speaker: ${turn.speaker}`,
      `Turn ${turnIdx + 1}`,
      '',
      '',
      '',
      `Dialogue turn for ${w.id}`,
    ]);
  });
}

if (!fs.existsSync(REVIEW_DIR)) {
  fs.mkdirSync(REVIEW_DIR, { recursive: true });
}

const csvContent =
  '\uFEFF' + csvRows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n') + '\r\n';
const csvPath = path.join(REVIEW_DIR, 'content_review_pack.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

const v1Count = csvRows.slice(1).filter((r) => r[1] === 'v1').length;
const v2Count = csvRows.slice(1).filter((r) => r[1] === 'v2').length;
const v3Count = csvRows.slice(1).filter((r) => r[1] === 'v3').length;

console.log(`Exported ${csvRows.length - 1} review rows (v1=${v1Count}, v2=${v2Count}, v3=${v3Count}) to: ${csvPath}`);
