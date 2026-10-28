/**
 * Test Suite for HilGaming Mini App
 * Validates data integrity (24 mods), categories, Monetag ad logic, storage cache, and search.
 */

import fs from 'fs';
import path from 'path';

console.log('====================================');
console.log('🧪 RUNNING HILGAMING TEST SUITE');
console.log('====================================\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
  }
}

// 1. DATA INTEGRITY CHECK
const jsonRaw = fs.readFileSync('public/data/mods.json', 'utf8');
const mods = JSON.parse(jsonRaw);

assert(Array.isArray(mods), 'mods.json parses as an Array');
assert(mods.length === 24, `Catalog contains exactly 24 mods (actual: ${mods.length})`);

// Validate every mod has title, downloads array, and images
let allHaveDownloads = true;
let totalDownloadLinks = 0;
let sampleLinks = [];

mods.forEach((mod, idx) => {
  if (!mod.title) {
    allHaveDownloads = false;
  }
  if (!Array.isArray(mod.downloads) || mod.downloads.length === 0) {
    allHaveDownloads = false;
  } else {
    totalDownloadLinks += mod.downloads.length;
    mod.downloads.forEach(dl => {
      if (dl.url) sampleLinks.push(dl.url);
    });
  }
});

assert(allHaveDownloads, 'All 24 mods have valid titles and non-empty download lists');
assert(totalDownloadLinks > 50, `Total preserved download URLs: ${totalDownloadLinks}`);
assert(sampleLinks.some(url => url.includes('modsfire.com')), 'Preserved ModsFire download links');
assert(sampleLinks.some(url => url.includes('mediafire.com')), 'Preserved MediaFire download links');
assert(sampleLinks.some(url => url.includes('mega.nz')), 'Preserved MEGA download links');

// 2. CATEGORY CLASSIFICATION TEST
function deriveCategory(title = '', tag = '') {
  const text = `${title} ${tag}`.toUpperCase();
  if (text.includes('DFL')) return 'DFL';
  if (text.includes('FTS')) return 'FTS';
  if (text.includes('PES') || text.includes('EFOOTBALL')) return 'PES & eFootball';
  if (text.includes('FIFA') || text.includes('FC 26') || text.includes('FC 27') || text.includes('EA SPORTS')) return 'EA Sports FC & FIFA';
  return 'Outros';
}

const pesCount = mods.filter(m => deriveCategory(m.title, m.tag) === 'PES & eFootball').length;
const fifaCount = mods.filter(m => deriveCategory(m.title, m.tag) === 'EA Sports FC & FIFA').length;
const dflCount = mods.filter(m => deriveCategory(m.title, m.tag) === 'DFL').length;
const ftsCount = mods.filter(m => deriveCategory(m.title, m.tag) === 'FTS').length;

assert(pesCount > 0, `Detected PES & eFootball category: ${pesCount} mods`);
assert(fifaCount > 0, `Detected EA Sports FC & FIFA category: ${fifaCount} mods`);
assert(dflCount > 0, `Detected DFL category: ${dflCount} mods`);
assert(ftsCount > 0, `Detected FTS category: ${ftsCount} mods`);

// 3. SEARCH LOGIC TEST
function searchMods(query) {
  const q = query.toLowerCase();
  return mods.filter(m => {
    return (m.title && m.title.toLowerCase().includes(q)) ||
           (m.tag && m.tag.toLowerCase().includes(q)) ||
           (m.description && m.description.toLowerCase().includes(q)) ||
           (m.features && m.features.some(f => f.toLowerCase().includes(q)));
  });
}

const pesSearch = searchMods('Master League');
assert(pesSearch.length >= 2, `Search 'Master League' matched ${pesSearch.length} mods`);

const careerSearch = searchMods('Career');
assert(careerSearch.length >= 4, `Search 'Career' matched ${careerSearch.length} mods`);

// 4. MONETAG AD SPECIFICATION COMPLIANCE
const indexHtml = fs.readFileSync('index.html', 'utf8');

// A. Exactly one script tag in head
const sdkMatches = indexHtml.match(/\/\/libtl\.com\/sdk\.js/g);
assert(sdkMatches && sdkMatches.length === 1, 'Monetag SDK script appears exactly once in index.html');
assert(indexHtml.includes("data-zone='9590572'") || indexHtml.includes('data-zone="9590572"'), 'Monetag SDK uses Zone 9590572');
assert(indexHtml.includes("data-sdk='show_9590572'") || indexHtml.includes('data-sdk="show_9590572"'), 'Monetag SDK uses show_9590572');

// B. Ads module test
const adsJs = fs.readFileSync('js/ads.js', 'utf8');
assert(adsJs.includes('frequency: 2'), 'In-App Interstitial configured with frequency: 2');
assert(adsJs.includes('capping: 0.1'), 'In-App Interstitial configured with capping: 0.1');
assert(adsJs.includes('interval: 30'), 'In-App Interstitial configured with interval: 30');
assert(adsJs.includes('timeout: 5'), 'In-App Interstitial configured with timeout: 5');
assert(adsJs.includes('everyPage: false'), 'In-App Interstitial configured with everyPage: false');
assert(adsJs.includes("show_9590572('pop')"), "Rewarded Popup format uses show_9590572('pop')");
assert(adsJs.includes('show_9590572()'), 'Rewarded Interstitial format uses show_9590572()');
assert(adsJs.includes('isAdRunning'), 'Ad manager enforces concurrency lock preventing simultaneous ads');

// 5. TELEGRAM WEBAPP SDK TEST
assert(indexHtml.includes('telegram-web-app.js'), 'Telegram WebApp SDK script is included in head');
const telegramJs = fs.readFileSync('js/telegram.js', 'utf8');
assert(telegramJs.includes('tg.ready()'), 'Calls Telegram.WebApp.ready()');
assert(telegramJs.includes('tg.expand()'), 'Calls Telegram.WebApp.expand()');
assert(telegramJs.includes('BackButton'), 'Configures Telegram native BackButton for seamless back navigation');
assert(telegramJs.includes('HapticFeedback'), 'Integrates Telegram native HapticFeedback');

// 6. CACHE & PERFORMANCE SPECIFICATION
const storageJs = fs.readFileSync('js/storage.js', 'utf8');
assert(storageJs.includes('getCachedCatalog'), 'Storage supports getCachedCatalog');
assert(storageJs.includes('setCachedCatalog'), 'Storage supports setCachedCatalog with timestamp');
assert(storageJs.includes('toggleFavorite'), 'Storage supports toggleFavorite');
assert(storageJs.includes('isSupporter'), 'Storage supports VIP supporter status');
assert(storageJs.includes('getLanguage'), 'Storage supports getLanguage');
assert(storageJs.includes('setLanguage'), 'Storage supports setLanguage');
assert(storageJs.includes('hasSelectedLanguage'), 'Storage supports hasSelectedLanguage for first-time popup');

// 7. INTERNATIONALIZATION (i18n) TEST
const i18nJs = fs.readFileSync('js/i18n.js', 'utf8');
assert(i18nJs.includes("currentLang: 'en'"), 'Primary default language is English (en)');
assert(i18nJs.includes("code: 'en'"), 'English language is defined');
assert(i18nJs.includes("code: 'es'"), 'Spanish (es) language is defined');
assert(i18nJs.includes("code: 'fr'"), 'French (fr) language is defined');
assert(i18nJs.includes("code: 'ar'") && i18nJs.includes('isRTL: true'), 'Arabic (ar) is defined with isRTL: true');
assert(i18nJs.includes("code: 'id'"), 'Indonesian (id) language is defined');
assert(indexHtml.includes('id="languageSelectModal"'), 'Language selection popup modal exists in index.html');
assert(indexHtml.includes('id="openLanguageModalBtn"'), 'Language switcher button exists in header');

console.log('\n====================================');
console.log(`TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('====================================');

if (testsFailed > 0) {
  process.exit(1);
}

