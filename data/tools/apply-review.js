#!/usr/bin/env node
/**
 * Reads the Native-Speaker Review CSV (/docs/review/content_review_pack.csv) and:
 * - Applies `corrected_kn` and `corrected_translit` to the matching entries in
 *   /data/phrases.json, /data/roleplay.json, and /data/quiz.json.
 * - Sets `reviewed = true` ONLY on phrases whose `reviewer_status` is "approved" or "fixed".
 * - Runs full data integrity validation (counts, role-play graph reachability & termination,
 *   quiz answerIndex bounds).
 * - Prints a summary of what changed and what remains unreviewed.
 *
 * Dry-run by default! Only writes files when `--apply` is passed.
 *
 * Usage (from repository root in PowerShell):
 *   node data/tools/apply-review.js
 *   node data/tools/apply-review.js --apply
 *   node data/tools/apply-review.js --csv path/to/custom_review.csv --apply
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DEFAULT_CSV_PATH = path.join(ROOT_DIR, 'docs', 'review', 'content_review_pack.csv');

function parseArgs(argv) {
  let apply = false;
  let csvPath = DEFAULT_CSV_PATH;
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') {
      apply = true;
    } else if (arg === '--csv' && argv[i + 1]) {
      csvPath = path.resolve(process.cwd(), argv[i + 1]);
      i++;
    } else if (!arg.startsWith('--')) {
      csvPath = path.resolve(process.cwd(), arg);
    }
  }
  return { apply, csvPath };
}

function parseCsv(content) {
  const clean = content.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\r' && next === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += ch;
      }
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  const records = [];
  for (let r = 1; r < rows.length; r++) {
    const vals = rows[r];
    if (vals.length === 1 && vals[0].trim() === '') continue;
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = vals[idx] !== undefined ? vals[idx] : '';
    });
    records.push(obj);
  }
  return records;
}

function splitQuizOption(optStr) {
  const match = /^(.+?)\s*\(([^()]+)\)\s*$/.exec(optStr || '');
  if (match) {
    return { kn: match[1].trim(), translit: match[2].trim() };
  }
  return { kn: optStr || '', translit: '' };
}

function validateData(scenarios, phrases, roleplay, quiz) {
  const errors = [];

  // 1. Validate scenario & phrase counts
  if (!Array.isArray(scenarios) || scenarios.length !== 5) {
    errors.push(`Expected 5 scenarios, found ${Array.isArray(scenarios) ? scenarios.length : 0}`);
  }
  if (!Array.isArray(phrases) || phrases.length !== 50) {
    errors.push(`Expected 50 total phrases, found ${Array.isArray(phrases) ? phrases.length : 0}`);
  }

  const scenarioSlugs = new Set((scenarios || []).map((s) => s.slug));
  for (const slug of scenarioSlugs) {
    const count = phrases.filter((p) => p.scenario === slug).length;
    if (count !== 10) {
      errors.push(`Scenario "${slug}" expected 10 phrases, found ${count}`);
    }
  }

  // 2. Validate roleplay graph for every scenario
  for (const slug of scenarioSlugs) {
    const rp = roleplay[slug];
    if (!rp || !rp.nodes || !rp.start) {
      errors.push(`Roleplay missing or invalid for scenario "${slug}"`);
      continue;
    }
    const nodes = rp.nodes;
    const nodeIds = Object.keys(nodes);
    if (!nodes[rp.start]) {
      errors.push(`Roleplay "${slug}" start node "${rp.start}" does not exist`);
      continue;
    }

    // Check option next pointers
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (!Array.isArray(node.options) || node.options.length === 0) {
        errors.push(`Roleplay "${slug}" node "${nodeId}" has no options`);
        continue;
      }
      for (const opt of node.options) {
        if (opt.next !== null && !nodes[opt.next]) {
          errors.push(`Roleplay "${slug}" node "${nodeId}" has invalid next node "${opt.next}"`);
        }
      }
    }

    // Check reachability from start
    const reachable = new Set();
    const queue = [rp.start];
    while (queue.length > 0) {
      const curr = queue.shift();
      if (reachable.has(curr) || !nodes[curr]) continue;
      reachable.add(curr);
      for (const opt of nodes[curr].options || []) {
        if (opt.next !== null && !reachable.has(opt.next)) {
          queue.push(opt.next);
        }
      }
    }

    for (const id of nodeIds) {
      if (!reachable.has(id)) {
        errors.push(`Roleplay "${slug}" node "${id}" is unreachable from start "${rp.start}"`);
      }
    }

    // Check every node can reach a null ending
    const canTerminate = new Set();
    let changed = true;
    while (changed) {
      changed = false;
      for (const [nodeId, node] of Object.entries(nodes)) {
        if (canTerminate.has(nodeId)) continue;
        const reachesEnd = (node.options || []).some(
          (opt) => opt.next === null || canTerminate.has(opt.next)
        );
        if (reachesEnd) {
          canTerminate.add(nodeId);
          changed = true;
        }
      }
    }

    for (const id of nodeIds) {
      if (!canTerminate.has(id)) {
        errors.push(`Roleplay "${slug}" node "${id}" cannot reach a null ending`);
      }
    }
  }

  // 3. Validate quiz bounds & counts
  for (const slug of scenarioSlugs) {
    const qs = quiz[slug];
    if (!Array.isArray(qs) || qs.length !== 5) {
      errors.push(`Quiz for "${slug}" expected 5 questions, found ${Array.isArray(qs) ? qs.length : 0}`);
      continue;
    }
    for (const q of qs) {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`Quiz question "${q.id}" has fewer than 2 options`);
      } else if (
        typeof q.answerIndex !== 'number' ||
        q.answerIndex < 0 ||
        q.answerIndex >= q.options.length
      ) {
        errors.push(
          `Quiz question "${q.id}" answerIndex (${q.answerIndex}) out of bounds [0, ${q.options.length - 1}]`
        );
      }
    }
  }

  return errors;
}

function main() {
  const { apply, csvPath } = parseArgs(process.argv);

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: Review CSV not found at ${csvPath}`);
    console.error(`Run "node data/tools/export-review.js" first to generate it.`);
    process.exit(1);
  }

  const phrasesPath = path.join(DATA_DIR, 'phrases.json');
  const roleplayPath = path.join(DATA_DIR, 'roleplay.json');
  const quizPath = path.join(DATA_DIR, 'quiz.json');
  const scenariosPath = path.join(DATA_DIR, 'scenarios.json');

  const scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
  const phrases = JSON.parse(fs.readFileSync(phrasesPath, 'utf8'));
  const roleplay = JSON.parse(fs.readFileSync(roleplayPath, 'utf8'));
  const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf8'));

  const records = parseCsv(fs.readFileSync(csvPath, 'utf8'));

  const phraseMap = new Map(phrases.map((p) => [p.id, p]));
  const quizMap = new Map();
  for (const qs of Object.values(quiz)) {
    for (const q of qs) {
      quizMap.set(q.id, q);
    }
  }

  const changes = [];
  let statusCounts = {
    approved: 0,
    fixed: 0,
    unreviewed: 0,
    other: 0,
  };

  for (const row of records) {
    const id = (row.id || '').trim();
    const type = (row.type || '').trim();
    const status = (row.reviewer_status || '').trim().toLowerCase();
    const corrKn = (row.corrected_kn || '').trim();
    const corrTranslit = (row.corrected_translit || '').trim();

    if (status === 'approved') statusCounts.approved++;
    else if (status === 'fixed') statusCounts.fixed++;
    else if (status === '') statusCounts.unreviewed++;
    else statusCounts.other++;

    if (type === 'phrase') {
      const p = phraseMap.get(id);
      if (!p) continue;

      if (corrKn && corrKn !== p.kn) {
        changes.push(`[phrase ${id}] kn: "${p.kn}" -> "${corrKn}"`);
        p.kn = corrKn;
      }
      if (corrTranslit && corrTranslit !== p.translit) {
        changes.push(`[phrase ${id}] translit: "${p.translit}" -> "${corrTranslit}"`);
        p.translit = corrTranslit;
      }

      const shouldBeReviewed = status === 'approved' || status === 'fixed';
      if (Boolean(p.reviewed) !== shouldBeReviewed) {
        changes.push(`[phrase ${id}] reviewed: ${Boolean(p.reviewed)} -> ${shouldBeReviewed} (status="${status}")`);
        p.reviewed = shouldBeReviewed;
      }
    } else if (type === 'phrase_example') {
      const phraseId = id.replace(/:example$/, '');
      const p = phraseMap.get(phraseId);
      if (!p || !p.example) continue;

      if (corrKn && corrKn !== p.example.kn) {
        changes.push(`[phrase_example ${id}] kn: "${p.example.kn}" -> "${corrKn}"`);
        p.example.kn = corrKn;
      }
      if (corrTranslit && corrTranslit !== p.example.translit) {
        changes.push(`[phrase_example ${id}] translit: "${p.example.translit}" -> "${corrTranslit}"`);
        p.example.translit = corrTranslit;
      }
    } else if (type === 'roleplay_line') {
      // id format: rp:<scenario>:<nodeId>:line
      const parts = id.split(':');
      const scenarioSlug = parts[1];
      const nodeId = parts[2];
      const node = roleplay[scenarioSlug]?.nodes?.[nodeId];
      if (!node) continue;

      if (corrKn && corrKn !== node.kn) {
        changes.push(`[roleplay_line ${id}] kn: "${node.kn}" -> "${corrKn}"`);
        node.kn = corrKn;
      }
      if (corrTranslit && corrTranslit !== node.translit) {
        changes.push(`[roleplay_line ${id}] translit: "${node.translit}" -> "${corrTranslit}"`);
        node.translit = corrTranslit;
      }
    } else if (type === 'roleplay_option') {
      // id format: rp:<scenario>:<nodeId>:opt:<idx>
      const parts = id.split(':');
      const scenarioSlug = parts[1];
      const nodeId = parts[2];
      const optIdx = parseInt(parts[4], 10);
      const opt = roleplay[scenarioSlug]?.nodes?.[nodeId]?.options?.[optIdx];
      if (!opt) continue;

      if (corrKn && corrKn !== opt.kn) {
        changes.push(`[roleplay_option ${id}] kn: "${opt.kn}" -> "${corrKn}"`);
        opt.kn = corrKn;
      }
      if (corrTranslit && corrTranslit !== opt.translit) {
        changes.push(`[roleplay_option ${id}] translit: "${opt.translit}" -> "${corrTranslit}"`);
        opt.translit = corrTranslit;
      }
    } else if (type === 'quiz_option') {
      // id format: <quizId>:opt:<idx>
      const match = /^(.+):opt:(\d+)$/.exec(id);
      if (!match) continue;
      const q = quizMap.get(match[1]);
      const optIdx = parseInt(match[2], 10);
      if (!q || !q.options || q.options[optIdx] === undefined) continue;

      const parsed = splitQuizOption(q.options[optIdx]);
      const newKn = corrKn || parsed.kn;
      const newTranslit = corrTranslit || parsed.translit;
      const updatedOption = newTranslit ? `${newKn} (${newTranslit})` : newKn;

      if (updatedOption !== q.options[optIdx]) {
        changes.push(`[quiz_option ${id}] option: "${q.options[optIdx]}" -> "${updatedOption}"`);
        q.options[optIdx] = updatedOption;
      }
    }
  }

  // Run data integrity validation
  const validationErrors = validateData(scenarios, phrases, roleplay, quiz);

  const reviewedPhrasesCount = phrases.filter((p) => p.reviewed === true).length;
  const unreviewedPhrasesCount = phrases.filter((p) => !p.reviewed).length;

  console.log('==========================================================');
  console.log(`NammaNudi Review Pack Tool — ${apply ? 'APPLY MODE' : 'DRY RUN MODE (default)'}`);
  console.log('==========================================================');
  console.log(`CSV Source           : ${path.relative(ROOT_DIR, csvPath)}`);
  console.log(`Total CSV Rows       : ${records.length}`);
  console.log(
    `Row Status Breakdown : approved=${statusCounts.approved}, fixed=${statusCounts.fixed}, unreviewed=${statusCounts.unreviewed}, other=${statusCounts.other}`
  );
  console.log(`Phrases reviewed=true: ${reviewedPhrasesCount} / ${phrases.length}`);
  console.log(`Phrases unreviewed   : ${unreviewedPhrasesCount} / ${phrases.length}`);
  console.log(`Total Modifications  : ${changes.length}`);

  if (changes.length > 0) {
    console.log('\nDetected Changes:');
    for (const c of changes) {
      console.log(`  - ${c}`);
    }
  } else {
    console.log('\nNo modifications detected in CSV.');
  }

  if (validationErrors.length > 0) {
    console.error('\nData Validation FAILED:');
    for (const err of validationErrors) {
      console.error(`  [ERROR] ${err}`);
    }
    process.exit(1);
  } else {
    console.log('\nData Validation PASSED: 5 scenarios, 50 phrases, role-play graphs valid & terminating, 25 quiz questions within bounds.');
  }

  if (apply) {
    fs.writeFileSync(phrasesPath, JSON.stringify(phrases, null, 2) + '\n', 'utf8');
    fs.writeFileSync(roleplayPath, JSON.stringify(roleplay, null, 2) + '\n', 'utf8');
    fs.writeFileSync(quizPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
    console.log('\nWrote updated JSON files to /data/{phrases,roleplay,quiz}.json.');
  } else {
    console.log('\nDry run complete. No JSON files were modified (pass --apply to write changes).');
  }
}

main();
