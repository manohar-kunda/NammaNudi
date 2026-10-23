#!/usr/bin/env node
/**
 * Validation Script for NammaNudi v3 Content Extension.
 *
 * Checks:
 * 1. Required fields across scenarios-extra, phrases-extra, and words.
 * 2. Global uniqueness of all IDs across backend data and frontend v3 data.
 * 3. All "related" IDs in words.json exist in backend phrases, frontend extra phrases, or words.
 * 4. "where" values in words.json strictly come from the allowed list:
 *    auto, bus-metro, market, shop, restaurant, clinic, office, home, anywhere
 * 5. Allowed values for "type" (noun, verb, phrase, particle) and "register" (polite, casual, both).
 * 6. Every word entry has a 2 to 3 turn dialogue with kn, translit, en, speaker.
 * 7. "reviewed" is strictly false on all new items.
 *
 * Usage:
 *   node data/tools/validate-v3.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

const ALLOWED_WHERE = new Set([
  'auto',
  'bus-metro',
  'market',
  'shop',
  'restaurant',
  'clinic',
  'office',
  'home',
  'anywhere',
]);

const ALLOWED_TYPES = new Set(['noun', 'verb', 'phrase', 'particle']);
const ALLOWED_REGISTERS = new Set(['polite', 'casual', 'both']);

function loadJson(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relPath}`);
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function runValidation() {
  const errors = [];
  const allIds = new Map();

  console.log('Validating NammaNudi v3 Content Extension...');

  // 1. Load Backend Data
  const backendScenarios = loadJson('data/scenarios.json');
  const backendPhrases = loadJson('data/phrases.json');

  backendScenarios.forEach((s) => {
    if (allIds.has(s.id)) errors.push(`Duplicate ID in backend scenarios: ${s.id}`);
    allIds.set(s.id, 'backend_scenario');
  });

  backendPhrases.forEach((p) => {
    if (allIds.has(p.id)) errors.push(`Duplicate ID in backend phrases: ${p.id}`);
    allIds.set(p.id, 'backend_phrase');
  });

  // 2. Load Frontend v3 Data
  const extraScenarios = loadJson('frontend/src/data/scenarios-extra.json');
  const extraPhrases = loadJson('frontend/src/data/phrases-extra.json');
  const words = loadJson('frontend/src/data/words.json');

  // Check extra scenarios
  if (!Array.isArray(extraScenarios) || extraScenarios.length !== 4) {
    errors.push(`Expected exactly 4 extra scenarios, found ${extraScenarios?.length}`);
  }

  const scenarioSlugs = new Set();
  extraScenarios.forEach((sc) => {
    const required = ['id', 'slug', 'title', 'knTitle', 'tagline', 'icon', 'phraseCount'];
    required.forEach((f) => {
      if (!sc[f]) errors.push(`Scenario ${sc.id || 'unknown'} missing field "${f}"`);
    });

    if (allIds.has(sc.id)) errors.push(`Duplicate scenario ID: ${sc.id}`);
    allIds.set(sc.id, 'v3_scenario');
    scenarioSlugs.add(sc.slug);
  });

  // Check extra phrases
  if (!Array.isArray(extraPhrases) || extraPhrases.length !== 40) {
    errors.push(`Expected exactly 40 extra phrases (10 per scenario), found ${extraPhrases?.length}`);
  }

  const phraseCountByScenario = {};
  extraPhrases.forEach((p) => {
    const required = ['id', 'scenario', 'kn', 'translit', 'en', 'example', 'reviewed'];
    required.forEach((f) => {
      if (p[f] === undefined) errors.push(`Phrase ${p.id || 'unknown'} missing field "${f}"`);
    });

    if (p.reviewed !== false) {
      errors.push(`Phrase ${p.id} must have reviewed=false, found: ${p.reviewed}`);
    }

    if (!scenarioSlugs.has(p.scenario)) {
      errors.push(`Phrase ${p.id} belongs to unknown scenario: ${p.scenario}`);
    }

    if (allIds.has(p.id)) errors.push(`Duplicate phrase ID: ${p.id}`);
    allIds.set(p.id, 'v3_phrase');

    phraseCountByScenario[p.scenario] = (phraseCountByScenario[p.scenario] || 0) + 1;
  });

  for (const slug of scenarioSlugs) {
    const cnt = phraseCountByScenario[slug] || 0;
    if (cnt !== 10) {
      errors.push(`Scenario ${slug} expected 10 phrases, found ${cnt}`);
    }
  }

  // Check words
  if (!Array.isArray(words) || words.length > 30) {
    errors.push(`Expected at most 30 words, found ${words?.length}`);
  }

  words.forEach((w) => {
    const required = [
      'id',
      'kn',
      'translit',
      'en',
      'type',
      'purpose',
      'where',
      'when',
      'register',
      'tip',
      'dialogue',
      'reviewed',
    ];
    required.forEach((f) => {
      if (w[f] === undefined) errors.push(`Word ${w.id || 'unknown'} missing field "${f}"`);
    });

    if (w.reviewed !== false) {
      errors.push(`Word ${w.id} must have reviewed=false, found: ${w.reviewed}`);
    }

    if (!ALLOWED_TYPES.has(w.type)) {
      errors.push(`Word ${w.id} invalid type "${w.type}". Must be one of: ${[...ALLOWED_TYPES].join(', ')}`);
    }

    if (!ALLOWED_REGISTERS.has(w.register)) {
      errors.push(`Word ${w.id} invalid register "${w.register}". Must be one of: ${[...ALLOWED_REGISTERS].join(', ')}`);
    }

    if (!Array.isArray(w.where) || w.where.length === 0) {
      errors.push(`Word ${w.id} must have a non-empty array of "where" locations`);
    } else {
      w.where.forEach((loc) => {
        if (!ALLOWED_WHERE.has(loc)) {
          errors.push(`Word ${w.id} invalid where location "${loc}". Must be one of: ${[...ALLOWED_WHERE].join(', ')}`);
        }
      });
    }

    if (!Array.isArray(w.dialogue) || w.dialogue.length < 2 || w.dialogue.length > 3) {
      errors.push(`Word ${w.id} dialogue must have 2 or 3 turns, found: ${w.dialogue?.length}`);
    } else {
      w.dialogue.forEach((turn, idx) => {
        ['speaker', 'kn', 'translit', 'en'].forEach((field) => {
          if (!turn[field]) {
            errors.push(`Word ${w.id} dialogue turn ${idx + 1} missing "${field}"`);
          }
        });
      });
    }

    if (allIds.has(w.id)) errors.push(`Duplicate word ID: ${w.id}`);
    allIds.set(w.id, 'v3_word');
  });

  // Verify all "related" IDs in words exist
  words.forEach((w) => {
    if (Array.isArray(w.related)) {
      w.related.forEach((relId) => {
        if (!allIds.has(relId)) {
          errors.push(`Word ${w.id} references non-existent related ID: "${relId}"`);
        }
      });
    }
  });

  console.log('----------------------------------------------------------');
  console.log(`Checked Backend Data : ${backendScenarios.length} scenarios, ${backendPhrases.length} phrases`);
  console.log(`Checked v3 Scenarios : ${extraScenarios.length}`);
  console.log(`Checked v3 Phrases   : ${extraPhrases.length}`);
  console.log(`Checked v3 Words     : ${words.length}`);
  console.log(`Total Unique IDs     : ${allIds.size}`);
  console.log('----------------------------------------------------------');

  if (errors.length > 0) {
    console.error(`Validation FAILED with ${errors.length} error(s):`);
    errors.forEach((err) => console.error(`  [ERROR] ${err}`));
    process.exit(1);
  }

  console.log('Validation PASSED: All required fields present, all IDs unique, all relations valid, all reviewed=false.');
}

runValidation();
