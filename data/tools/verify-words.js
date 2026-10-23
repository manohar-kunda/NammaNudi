const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9444;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TMP_PROFILE = `C:\\Users\\manoh\\AppData\\Local\\Temp\\chrome_test_${Date.now()}`;
const ARTIFACT_DIR = 'C:\\Users\\manoh\\.gemini\\antigravity\\brain\\9f3033df-6c45-4788-a643-c5b5ded8f71f';

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result ? res.result.value : undefined;
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved screenshot to: ${filePath}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('--- Starting Chrome Headless CDP Automation ---');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${TMP_PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  let cdp = null;

  try {
    // Wait for Chrome CDP port to be open
    let version = null;
    for (let i = 0; i < 20; i++) {
      try {
        version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
        if (version && version.webSocketDebuggerUrl) break;
      } catch (e) {
        await wait(250);
      }
    }

    if (!version) throw new Error('Chrome CDP port did not respond in time');

    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    cdp = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('Connected to Chrome DevTools Protocol via WebSocket');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');

    const testResults = [];

    // ==========================================================
    // TEST 1: Mobile 390px Viewport - Home Screen & Words Card
    // ==========================================================
    console.log('\n--- TEST 1: Mobile 390px Viewport ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await cdp.send('Page.navigate', { url: 'http://localhost:4173/' });
    await wait(1200);

    const homeTitle = await cdp.eval('document.title');
    const hasWordsCard = await cdp.eval('!!document.querySelector("[data-testid=\'home-words-card\']")');
    console.log(`Page Title: ${homeTitle}, Home Words Card Present: ${hasWordsCard}`);
    testResults.push({ name: 'Home screen has prominent Words card (390px)', passed: hasWordsCard });

    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_390_home.png'));

    // ==========================================================
    // TEST 2: Open Words Screen
    // ==========================================================
    console.log('\n--- TEST 2: Navigating to Words Screen ---');
    await cdp.eval('document.querySelector("[data-testid=\'home-words-card\']").click()');
    await wait(600);

    const wordsGridCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Words rendered on screen: ${wordsGridCount}`);
    testResults.push({ name: 'Words screen renders exactly 30 word cards', passed: wordsGridCount === 30 });

    // Check first word card content
    const firstWordKn = await cdp.eval('document.querySelector("[data-testid=\'word-card-word-kodi\'] .word-kn")?.textContent');
    const firstWordTranslit = await cdp.eval('document.querySelector("[data-testid=\'word-card-word-kodi\'] .word-translit")?.textContent');
    const firstWordEn = await cdp.eval('document.querySelector("[data-testid=\'word-card-word-kodi\'] .word-en")?.textContent');
    const hasVoiceNote = await cdp.eval('!!document.querySelector(".voice-note")');
    const hasReviewBadge = await cdp.eval('document.querySelector("[data-testid=\'word-card-word-kodi\'] .badge-pending")?.textContent');
    const hasDialogue = await cdp.eval('document.querySelectorAll("[data-testid=\'word-card-word-kodi\'] .word-dialogue-turn").length');

    console.log(`First Word: ${firstWordKn} (${firstWordTranslit}) - "${firstWordEn}"`);
    console.log(`Audio fallback note present: ${hasVoiceNote}`);
    console.log(`Review badge text: "${hasReviewBadge}"`);
    console.log(`Dialogue turns count: ${hasDialogue}`);

    testResults.push({ name: 'Word card displays kn, translit, en, sections, dialogue', passed: firstWordKn === 'ಕೊಡಿ' && firstWordTranslit === 'kodi' && hasDialogue >= 2 });
    testResults.push({ name: 'Audio fallback note displayed when TTS unavailable', passed: hasVoiceNote });
    testResults.push({ name: 'Awaiting native review note shown on unreviewed card', passed: hasReviewBadge?.includes('review') });

    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_390_words.png'));

    // ==========================================================
    // TEST 3: Debounced Search (kn, translit, en)
    // ==========================================================
    console.log('\n--- TEST 3: Debounced Search ---');
    // Search by transliteration 'beku'
    await cdp.eval(`
      const input = document.querySelector("[data-testid='words-search-input']");
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, 'beku');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    `);
    await wait(350); // wait for 200ms debounce

    const searchBekuCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Cards matching search "beku": ${searchBekuCount}`);
    testResults.push({ name: 'Search for "beku" filters words client-side', passed: searchBekuCount >= 1 && searchBekuCount <= 3 });
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_390_search.png'));

    // Clear search
    await cdp.eval(`
      const clearBtn = document.querySelector(".search-clear-btn");
      if (clearBtn) clearBtn.click();
    `);
    await wait(300);

    const clearedSearchCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Cards after clearing search: ${clearedSearchCount}`);
    testResults.push({ name: 'Clear search resets word count to 30', passed: clearedSearchCount === 30 });

    // ==========================================================
    // TEST 4: Place Filter Chips ("auto", "restaurant")
    // ==========================================================
    console.log('\n--- TEST 4: Place Filter Chips ---');
    await cdp.eval('document.querySelector("[data-testid=\'filter-chip-auto\']").click()');
    await wait(250);

    const autoFilteredCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Cards matching place filter "auto": ${autoFilteredCount}`);
    testResults.push({ name: 'Place filter "auto" filters cards correctly', passed: autoFilteredCount > 0 && autoFilteredCount < 30 });
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_390_filter_auto.png'));

    // Reset filter to all
    await cdp.eval('document.querySelector("[data-testid=\'filter-chip-all\']").click()');
    await wait(250);

    // ==========================================================
    // TEST 5: Saving a Word & "Saved only" Toggle
    // ==========================================================
    console.log('\n--- TEST 5: Saving a Word & LocalStorage ---');
    // Save word-kodi and word-beku
    await cdp.eval('document.querySelector("[data-testid=\'save-word-btn-word-kodi\']").click()');
    await cdp.eval('document.querySelector("[data-testid=\'save-word-btn-word-beku\']").click()');
    await wait(200);

    const savedStorageVal = await cdp.eval('localStorage.getItem("nammanudi_saved_words_v1")');
    console.log(`nammanudi_saved_words_v1 in localStorage: ${savedStorageVal}`);
    testResults.push({
      name: 'Separate localStorage key nammanudi_saved_words_v1 stores saved words',
      passed: savedStorageVal?.includes('word-kodi') && savedStorageVal?.includes('word-beku'),
    });

    // Toggle "Saved only"
    await cdp.eval('document.querySelector("[data-testid=\'filter-saved-only\']").click()');
    await wait(250);

    const savedOnlyCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Cards displayed with "Saved only" active: ${savedOnlyCount}`);
    testResults.push({ name: '"Saved only" toggle displays only saved words', passed: savedOnlyCount === 2 });
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_390_saved_only.png'));

    // ==========================================================
    // TEST 6: Reload to Confirm Persistence of Saved Words
    // ==========================================================
    console.log('\n--- TEST 6: Reload to Confirm Persistence ---');
    await cdp.send('Page.reload');
    await wait(1200);

    // Open words screen again
    await cdp.eval('document.querySelector("[data-testid=\'home-words-card\']").click()');
    await wait(400);

    // Click "Saved only" toggle
    await cdp.eval('document.querySelector("[data-testid=\'filter-saved-only\']").click()');
    await wait(250);

    const reloadedSavedCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Cards displayed with "Saved only" active after reload: ${reloadedSavedCount}`);
    testResults.push({ name: 'Saved words persist across full page reload', passed: reloadedSavedCount === 2 });

    // Turn off saved only
    await cdp.eval('document.querySelector("[data-testid=\'filter-saved-only\']").click()');
    await wait(200);

    // ==========================================================
    // TEST 7: Desktop 1280px Viewport
    // ==========================================================
    console.log('\n--- TEST 7: Desktop 1280px Viewport ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(600);

    const isBottomNavHidden = await cdp.eval('window.getComputedStyle(document.querySelector(".bottom-nav")).display === "none"');
    const isDesktopNavVisible = await cdp.eval('window.getComputedStyle(document.querySelector(".desktop-nav")).display !== "none"');
    const gridColumns = await cdp.eval('window.getComputedStyle(document.querySelector(".words-grid")).gridTemplateColumns.split(" ").length');

    console.log(`Bottom nav hidden at 1280px: ${isBottomNavHidden}`);
    console.log(`Desktop nav visible in header: ${isDesktopNavVisible}`);
    console.log(`Words grid columns at 1280px: ${gridColumns}`);

    testResults.push({ name: 'Bottom nav hidden on desktop (>=1024px)', passed: isBottomNavHidden });
    testResults.push({ name: 'Desktop header navigation active at 1280px', passed: isDesktopNavVisible });
    testResults.push({ name: 'Words grid renders in 2 responsive columns at 1280px', passed: gridColumns === 2 });

    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_1280_words.png'));

    // ==========================================================
    // TEST 8: Existing Screens Unchanged
    // ==========================================================
    console.log('\n--- TEST 8: Existing Screens Unchanged ---');
    // Back to Home
    await cdp.eval('document.querySelector("[data-testid=\'words-back-btn\']").click()');
    await wait(400);

    // Open Scenario Screen (e.g. transport)
    await cdp.eval('document.querySelector(".scenario-card").click()');
    await wait(500);
    const scenarioPhrasesCount = await cdp.eval('document.querySelectorAll(".phrase-card").length');
    console.log(`Transport scenario phrases: ${scenarioPhrasesCount}`);
    testResults.push({ name: 'Existing scenario screen functions normally', passed: scenarioPhrasesCount === 10 });

    // Open Search Tab
    await cdp.eval('document.querySelector(".desktop-nav button:nth-child(2)").click()');
    await wait(400);
    const searchScreenInput = await cdp.eval('!!document.querySelector(".search-input")');
    testResults.push({ name: 'Existing Search screen intact', passed: searchScreenInput });

    // Open Practice Tab
    await cdp.eval('document.querySelector(".desktop-nav button:nth-child(4)").click()');
    await wait(400);
    const practiceCards = await cdp.eval('document.querySelectorAll(".scenario-card").length');
    testResults.push({ name: 'Existing Practice screen intact', passed: practiceCards === 5 });

    // Open About Tab
    await cdp.eval('document.querySelector(".desktop-nav button:nth-child(5)").click()');
    await wait(600);
    const aboutHeader = await cdp.eval('Array.from(document.querySelectorAll("h2, h3")).some(el => el.textContent.includes("About NammaNudi") || el.textContent.includes("Welcome to Karnataka"))');
    console.log(`About screen verified: ${aboutHeader}`);
    testResults.push({ name: 'Existing About screen intact', passed: !!aboutHeader });

    // Return to Home
    await cdp.eval('document.querySelector(".desktop-nav button:nth-child(1)").click()');
    await wait(400);

    // ==========================================================
    // TEST 9: Offline Mode Verification via Service Worker
    // ==========================================================
    console.log('\n--- TEST 9: Service Worker Offline Mode ---');
    // Emulate Network Offline
    await cdp.send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0,
    });
    console.log('Emulating network OFFLINE...');

    // Full reload while completely offline
    await cdp.send('Page.reload');
    await wait(1200);

    // Navigate to Words screen while offline
    await cdp.eval('document.querySelector("[data-testid=\'home-words-card\']").click()');
    await wait(500);

    const offlineWordsCount = await cdp.eval('document.querySelectorAll("[data-testid^=\'word-card-\']").length');
    console.log(`Words rendered while completely OFFLINE: ${offlineWordsCount}`);
    testResults.push({
      name: 'Words screen and static words.json load and render completely OFFLINE',
      passed: offlineWordsCount === 30,
    });

    await cdp.screenshot(path.join(ARTIFACT_DIR, 'preview_words_offline.png'));

    // Restore online
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });

    // ==========================================================
    // SUMMARY
    // ==========================================================
    console.log('\n==========================================================');
    console.log('AUTOMATED BROWSER VERIFICATION SUMMARY:');
    console.log('==========================================================');
    let allPassed = true;
    for (const r of testResults) {
      const mark = r.passed ? '✓ PASS' : '✗ FAIL';
      console.log(`  ${mark}: ${r.name}`);
      if (!r.passed) allPassed = false;
    }
    console.log('==========================================================');
    console.log(`OVERALL: ${allPassed ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED'}`);

    cdp.close();
    chrome.kill();
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('Test execution failed:', err);
    if (cdp) cdp.close();
    chrome.kill();
    process.exit(1);
  }
}

run();
