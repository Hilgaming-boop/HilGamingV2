/**
 * HilGaming Mini App - Core Application Controller
 * Handles view routing, DOM rendering, search/filters, Telegram sync, Monetag monetization, and i18n.
 */

import { HilStorage } from './storage.js';
import { HilAds } from './ads.js';
import { HilTelegram } from './telegram.js';
import { HilCatalog } from './catalog.js';
import { HilI18n, SUPPORTED_LANGUAGES } from './i18n.js';

class HilApp {
  constructor() {
    this.currentView = 'home';
    this.activeMod = null;
    this.pendingDownload = null;
    this.searchDebounceTimer = null;
    this.historyStack = ['home'];
    this.selectedLangTemp = 'en';

    // DOM Elements
    this.dom = {
      views: {
        home: document.getElementById('view-home'),
        games: document.getElementById('view-games'),
        categories: document.getElementById('view-categories'),
        favorites: document.getElementById('view-favorites'),
        about: document.getElementById('view-about'),
        details: document.getElementById('view-details')
      },
      navTabs: document.querySelectorAll('.nav-tab-item'),
      searchInput: document.getElementById('searchInput'),
      searchClearBtn: document.getElementById('searchClearBtn'),
      filterStrip: document.getElementById('filterStrip'),
      sortSelect: document.getElementById('sortSelect'),
      refreshBtn: document.getElementById('refreshCatalogBtn'),
      offlineBanner: document.getElementById('offlineBanner'),
      
      // Language Elements
      openLangModalBtn: document.getElementById('openLanguageModalBtn'),
      aboutChangeLangBtn: document.getElementById('aboutChangeLanguageBtn'),
      topBarLangFlag: document.getElementById('topBarLangFlag'),
      topBarLangCode: document.getElementById('topBarLangCode'),
      languageSelectModal: document.getElementById('languageSelectModal'),
      langOptionsGrid: document.getElementById('langOptionsGrid'),
      confirmLangBtn: document.getElementById('confirmLanguageModalBtn'),

      // Containers
      featuredSlot: document.getElementById('featuredModSlot'),
      recentGrid: document.getElementById('recentModsGrid'),
      gamesGrid: document.getElementById('gamesModsGrid'),
      categoriesList: document.getElementById('categoriesGridList'),
      favoritesGrid: document.getElementById('favoritesModsGrid'),
      favoritesEmpty: document.getElementById('favoritesEmptyState'),
      detailsContent: document.getElementById('detailsContentContainer'),
      
      // Modals
      downloadModal: document.getElementById('downloadRewardModal'),
      downloadTargetLabel: document.getElementById('downloadTargetLabel'),
      downloadHostLabel: document.getElementById('downloadHostLabel'),
      startAdBtn: document.getElementById('startRewardedAdBtn'),
      cancelDlBtn: document.getElementById('cancelDownloadModalBtn'),
      dlModalStatusText: document.getElementById('downloadModalStatusText'),

      // Supporter Modal & Lightbox
      supporterModal: document.getElementById('supporterSuccessModal'),
      closeSupporterBtn: document.getElementById('closeSupporterModalBtn'),
      watchPopupAdBtn: document.getElementById('watchPopupAdBtn'),
      supporterBadgeContainer: document.getElementById('vipSupporterCard'),
      
      lightbox: document.getElementById('imageLightbox'),
      lightboxImg: document.getElementById('lightboxActiveImg'),
      lightboxClose: document.getElementById('closeLightboxBtn'),

      toast: document.getElementById('appToastNotice')
    };
  }

  /**
   * Main Application Bootstrap
   */
  async init() {
    console.log('[HilGaming] Booting mini app...');

    // 1. Initialize i18n Engine (English primary default)
    HilI18n.init();
    this.selectedLangTemp = HilI18n.currentLang;
    this.updateLanguageButtonUI();

    // 2. Initialize Telegram WebApp SDK
    HilTelegram.init();

    // 3. Initialize Monetag In-App Interstitial (Format A - exactly once per session)
    HilAds.initInAppInterstitial();

    // 4. Bind UI Event Listeners
    this.bindEvents();

    // 5. Load Catalog Data (with cache fallback)
    try {
      await HilCatalog.loadCatalog(false);
      this.renderAllViews();
    } catch (err) {
      console.error('[HilGaming] Failed to load catalog:', err);
      this.showToast(HilI18n.t('catalog_error'), 'error');
    }

    // 6. Check first-time user: Show Language Selection Popup if never set
    if (!HilStorage.hasSelectedLanguage()) {
      setTimeout(() => {
        this.openLanguageModal(true);
      }, 350);
    }

    // 7. Update offline banner if loaded from stale cache
    if (HilCatalog.isOffline) {
      this.dom.offlineBanner.classList.add('active');
    }

    // 8. Update VIP Supporter status visual
    this.updateSupporterUI();
  }

  /**
   * Bind DOM Events
   */
  bindEvents() {
    // Navigation Tabs
    this.dom.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-view');
        HilTelegram.haptic('light');
        this.navigate(targetView);
      });
    });

    // Refresh Catalog Button
    this.dom.refreshBtn.addEventListener('click', async () => {
      HilTelegram.haptic('medium');
      this.dom.refreshBtn.classList.add('spinning');
      this.showToast(HilI18n.t('catalog_refreshing'), 'info');

      try {
        await HilCatalog.loadCatalog(true);
        this.renderAllViews();
        this.dom.offlineBanner.classList.remove('active');
        this.showToast(HilI18n.t('catalog_refreshed'), 'success');
        HilTelegram.haptic('success');
      } catch (e) {
        this.showToast(HilI18n.t('catalog_error'), 'error');
        HilTelegram.haptic('error');
      } finally {
        setTimeout(() => this.dom.refreshBtn.classList.remove('spinning'), 600);
      }
    });

    // Language Modal Triggers
    this.dom.openLangModalBtn?.addEventListener('click', () => {
      HilTelegram.haptic('light');
      this.openLanguageModal(false);
    });

    this.dom.aboutChangeLangBtn?.addEventListener('click', () => {
      HilTelegram.haptic('light');
      this.openLanguageModal(false);
    });

    this.dom.confirmLangBtn?.addEventListener('click', () => {
      this.confirmLanguageSelection();
    });

    // Listen for language changes to re-render dynamic views
    window.addEventListener('hilgaming:languageChanged', () => {
      this.updateLanguageButtonUI();
      this.renderAllViews();
      if (this.currentView === 'details' && this.activeMod) {
        this.renderDetailsViewContent(this.activeMod);
      }
    });

    // Search Input with Debounce
    this.dom.searchInput.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value.trim()) {
        this.dom.searchClearBtn.classList.add('visible');
      } else {
        this.dom.searchClearBtn.classList.remove('visible');
      }

      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = setTimeout(() => {
        HilCatalog.searchQuery = value;
        if (this.currentView !== 'games' && this.currentView !== 'details') {
          this.navigate('games', false);
        }
        this.renderGamesGrid();
      }, 200);
    });

    // Search Clear Button
    this.dom.searchClearBtn.addEventListener('click', () => {
      this.dom.searchInput.value = '';
      this.dom.searchClearBtn.classList.remove('visible');
      HilCatalog.searchQuery = '';
      this.renderGamesGrid();
      this.dom.searchInput.focus();
    });

    // Sort Dropdown
    if (this.dom.sortSelect) {
      this.dom.sortSelect.addEventListener('change', (e) => {
        HilCatalog.activeSort = e.target.value;
        this.renderGamesGrid();
      });
    }

    // Filter Chips
    this.dom.filterStrip.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      HilTelegram.haptic('light');

      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterCategory = chip.getAttribute('data-category');
      HilCatalog.activeFilter = filterCategory;
      this.renderGamesGrid();
    });

    // Download Modal Actions (Rewarded Interstitial - Format B)
    this.dom.startAdBtn.addEventListener('click', () => {
      this.handleStartRewardedAd();
    });

    this.dom.cancelDlBtn.addEventListener('click', () => {
      this.closeDownloadModal();
    });

    // Support Creator Button (Rewarded Popup - Format C)
    if (this.dom.watchPopupAdBtn) {
      this.dom.watchPopupAdBtn.addEventListener('click', () => {
        this.handleSupportPopupAd();
      });
    }

    if (this.dom.closeSupporterBtn) {
      this.dom.closeSupporterBtn.addEventListener('click', () => {
        this.dom.supporterModal.classList.remove('active');
      });
    }

    // Lightbox Close
    this.dom.lightboxClose.addEventListener('click', () => {
      this.dom.lightbox.classList.remove('active');
    });

    this.dom.lightbox.addEventListener('click', (e) => {
      if (e.target === this.dom.lightbox) {
        this.dom.lightbox.classList.remove('active');
      }
    });

    // Hardware/Browser PopState
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.view) {
        this._applyView(e.state.view, false);
      } else {
        this._applyView('home', false);
      }
    });
  }

  /**
   * Language Selection Flow
   */
  openLanguageModal(isFirstLaunch = false) {
    this.selectedLangTemp = HilI18n.currentLang;
    this.renderLanguageOptions();
    this.dom.languageSelectModal.classList.add('active');
  }

  renderLanguageOptions() {
    if (!this.dom.langOptionsGrid) return;

    this.dom.langOptionsGrid.innerHTML = SUPPORTED_LANGUAGES.map(lang => {
      const isSelected = lang.code === this.selectedLangTemp;
      return `
        <div class="lang-option-card ${isSelected ? 'active' : ''}" data-lang="${lang.code}">
          <div class="lang-option-left">
            <span class="lang-option-flag">${lang.flag}</span>
            <div class="lang-option-names">
              <span class="lang-native-name">${lang.native}</span>
              <span class="lang-sub-name">${lang.name} ${lang.isRTL ? '(RTL)' : ''}</span>
              ${lang.isDefault ? `<span class="lang-default-pill">Default (English)</span>` : ''}
            </div>
          </div>
          <div class="lang-check-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
        </div>
      `;
    }).join('');

    // Option tap handlers
    this.dom.langOptionsGrid.querySelectorAll('.lang-option-card').forEach(card => {
      card.addEventListener('click', () => {
        HilTelegram.haptic('light');
        const langCode = card.getAttribute('data-lang');
        this.selectedLangTemp = langCode;

        this.dom.langOptionsGrid.querySelectorAll('.lang-option-card').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-lang') === langCode);
        });
      });
    });
  }

  confirmLanguageSelection() {
    HilTelegram.haptic('medium');
    HilI18n.setLanguage(this.selectedLangTemp, true);
    this.dom.languageSelectModal.classList.remove('active');
    this.showToast(HilI18n.t('lang_changed_toast'), 'success');
  }

  updateLanguageButtonUI() {
    const current = HilI18n.getCurrentLanguage();
    if (this.dom.topBarLangFlag) this.dom.topBarLangFlag.textContent = current.flag;
    if (this.dom.topBarLangCode) this.dom.topBarLangCode.textContent = current.code.toUpperCase();
  }

  /**
   * View Navigation
   */
  navigate(viewName, pushHistory = true) {
    if (this.currentView === viewName && viewName !== 'details') return;

    if (pushHistory) {
      this.historyStack.push(viewName);
      window.history.pushState({ view: viewName }, '', `#${viewName}`);
    }

    this._applyView(viewName);
  }

  _applyView(viewName) {
    this.currentView = viewName;

    // Toggle active view container
    Object.keys(this.dom.views).forEach(key => {
      if (this.dom.views[key]) {
        this.dom.views[key].classList.toggle('active', key === viewName);
      }
    });

    // Update bottom navigation bar tabs
    this.dom.navTabs.forEach(tab => {
      const tabView = tab.getAttribute('data-view');
      tab.classList.toggle('active', tabView === viewName);
    });

    // Configure Telegram native BackButton
    if (viewName === 'details') {
      HilTelegram.setBackButton(() => this.goBack());
    } else {
      HilTelegram.hideBackButton();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh specific view contents when shown
    if (viewName === 'favorites') {
      this.renderFavoritesGrid();
    } else if (viewName === 'categories') {
      this.renderCategoriesView();
    } else if (viewName === 'games') {
      this.renderGamesGrid();
    }
  }

  goBack() {
    HilTelegram.haptic('light');
    if (this.historyStack.length > 1) {
      this.historyStack.pop();
      const prev = this.historyStack[this.historyStack.length - 1];
      this._applyView(prev, false);
    } else {
      this.navigate('home', false);
    }
  }

  renderAllViews() {
    this.renderHomeFeatured();
    this.renderHomeRecent();
    this.renderGamesGrid();
    this.renderCategoriesView();
    this.renderFavoritesGrid();
  }

  /**
   * Render Featured Mod on Home View
   */
  renderHomeFeatured() {
    if (!this.dom.featuredSlot) return;
    const featured = HilCatalog.mods[0];
    if (!featured) return;

    this.dom.featuredSlot.innerHTML = `
      <div class="featured-card" id="featuredModCard">
        <div class="featured-img-wrap">
          <img src="${featured.images[0]}" 
               alt="${featured.displayTitle}" 
               class="featured-img" 
               loading="lazy" 
               referrerpolicy="no-referrer"
               onerror="this.onerror=null; this.src='/assets/fallback-mod.svg';">
          <div class="featured-scrim"></div>
          <div class="featured-overlay-content">
            <span class="featured-kicker">
              <i class="fa-solid fa-fire"></i> ${HilI18n.t('spotlight_kicker')} • ${featured.category}
            </span>
            <h2 class="featured-title">${featured.displayTitle}</h2>
            <div class="featured-meta">
              <span>${featured.id}</span>
              <span>•</span>
              <span>${featured.downloads.length} ${HilI18n.t('available_files')}</span>
              ${featured.video ? `<span>•</span><span><i class="fa-brands fa-youtube"></i> ${HilI18n.t('video_included')}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('featuredModCard')?.addEventListener('click', () => {
      this.openModDetails(featured);
    });
  }

  /**
   * Render Recent Mods
   */
  renderHomeRecent() {
    if (!this.dom.recentGrid) return;
    const recentMods = HilCatalog.mods.slice(0, 6);
    this.dom.recentGrid.innerHTML = '';

    recentMods.forEach(mod => {
      const card = this.createModCardElement(mod);
      this.dom.recentGrid.appendChild(card);
    });
  }

  /**
   * Render Main Games Grid with active filters and search
   */
  renderGamesGrid() {
    if (!this.dom.gamesGrid) return;

    const filtered = HilCatalog.getFilteredMods({
      query: HilCatalog.searchQuery,
      category: HilCatalog.activeFilter,
      sort: HilCatalog.activeSort,
      favoritesOnly: false
    });

    this.dom.gamesGrid.innerHTML = '';

    if (filtered.length === 0) {
      this.dom.gamesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h3 class="empty-state-title">${HilI18n.t('no_results_title')}</h3>
          <p class="empty-state-desc">${HilI18n.t('no_results_desc')}</p>
        </div>
      `;
      return;
    }

    filtered.forEach(mod => {
      const card = this.createModCardElement(mod);
      this.dom.gamesGrid.appendChild(card);
    });
  }

  /**
   * Render Categories Grid View
   */
  renderCategoriesView() {
    if (!this.dom.categoriesList) return;
    const categories = HilCatalog.getCategories();
    this.dom.categoriesList.innerHTML = '';

    categories.forEach(cat => {
      const localizedName = cat.i18nKey ? HilI18n.t(cat.i18nKey, cat.name) : cat.name;
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-card-left">
          <div class="category-icon-box">
            <i class="fa-solid ${cat.icon}"></i>
          </div>
          <div>
            <h4 class="category-name">${localizedName}</h4>
            <span class="category-count">${cat.count} ${HilI18n.t('cat_count_suffix')}</span>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.85rem;"></i>
      `;

      card.addEventListener('click', () => {
        HilTelegram.haptic('light');
        HilCatalog.activeFilter = cat.id;

        document.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-category') === cat.id);
        });

        this.navigate('games');
      });

      this.dom.categoriesList.appendChild(card);
    });
  }

  /**
   * Render Favorites View
   */
  renderFavoritesGrid() {
    if (!this.dom.favoritesGrid) return;
    const favMods = HilCatalog.getFilteredMods({ favoritesOnly: true });

    this.dom.favoritesGrid.innerHTML = '';

    if (favMods.length === 0) {
      this.dom.favoritesEmpty.style.display = 'block';
      this.dom.favoritesGrid.style.display = 'none';
      return;
    }

    this.dom.favoritesEmpty.style.display = 'none';
    this.dom.favoritesGrid.style.display = 'grid';

    favMods.forEach(mod => {
      const card = this.createModCardElement(mod);
      this.dom.favoritesGrid.appendChild(card);
    });
  }

  /**
   * Factory: Create Mod Card DOM Element
   */
  createModCardElement(mod) {
    const card = document.createElement('div');
    card.className = 'mod-card';

    let tagHtml = '';
    if (mod.tag) {
      const tagUpper = mod.tag.toUpperCase();
      let tagClass = 'tag-default';
      if (tagUpper.includes('NEW')) tagClass = 'tag-new';
      else if (tagUpper.includes('HOT')) tagClass = 'tag-hot';
      else if (tagUpper.includes('CAREER')) tagClass = 'tag-career';

      tagHtml = `<span class="card-corner-tag ${tagClass}">${mod.tag}</span>`;
    }

    const firstImage = mod.images[0] || '/assets/fallback-mod.svg';

    card.innerHTML = `
      <div class="mod-card-thumb-wrap">
        ${tagHtml}
        <img src="${firstImage}" 
             alt="${mod.displayTitle}" 
             class="mod-card-thumb" 
             loading="lazy" 
             referrerpolicy="no-referrer"
             onerror="this.onerror=null; this.src='/assets/fallback-mod.svg';">
      </div>
      <div class="card-info">
        <div>
          <span class="card-category-kicker">${mod.category}</span>
          <h3 class="card-title">${mod.displayTitle}</h3>
        </div>
        <div class="card-footer">
          <span class="card-id-text">${mod.id}</span>
          <span class="card-dl-count">
            <i class="fa-solid fa-download"></i> ${mod.downloads.length} ${HilI18n.t('files_links_count')}
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      this.openModDetails(mod);
    });

    return card;
  }

  /**
   * Open Mod Details Page
   */
  openModDetails(mod) {
    this.activeMod = mod;
    HilTelegram.haptic('light');

    this.renderDetailsViewContent(mod);
    this.navigate('details');

    HilAds.initInAppInterstitial();
  }

  /**
   * Build Mod Details HTML Content
   */
  renderDetailsViewContent(mod) {
    const isFav = HilStorage.isFavorite(mod.id);

    // 1. Screenshots Gallery
    const slidesHtml = mod.images.map((img, i) => `
      <img src="${img}" 
           alt="${mod.displayTitle} screenshot ${i + 1}" 
           class="gallery-slide-img" 
           loading="lazy"
           referrerpolicy="no-referrer"
           onerror="this.onerror=null; this.src='/assets/fallback-mod.svg';"
           data-src="${img}">
    `).join('');

    const dotsHtml = mod.images.map((_, i) => `
      <span class="gallery-dot ${i === 0 ? 'active' : ''}"></span>
    `).join('');

    // 2. Video Facade (Lazy YouTube player)
    let videoHtml = '';
    if (mod.videoId) {
      videoHtml = `
        <div class="video-facade-wrap" id="youtubeFacade">
          <img src="https://img.youtube.com/vi/${mod.videoId}/hqdefault.jpg" 
               alt="${mod.displayTitle} video preview" 
               class="video-thumb-img"
               loading="lazy"
               onerror="this.onerror=null; this.src='/assets/fallback-mod.svg';">
          <div class="video-play-overlay" id="playVideoOverlayBtn">
            <div class="play-circle-btn">
              <i class="fa-solid fa-play"></i>
            </div>
            <span class="play-label">${HilI18n.t('watch_gameplay')}</span>
          </div>
        </div>
      `;
    }

    // 3. Features List
    let featuresHtml = '';
    if (mod.features && mod.features.length > 0) {
      const items = mod.features.map(f => `
        <li class="feature-item">
          <i class="fa-solid fa-circle-check"></i>
          <span>${f}</span>
        </li>
      `).join('');

      featuresHtml = `
        <div class="detail-card-box">
          <h4 class="detail-card-title">
            <i class="fa-solid fa-star"></i> ${HilI18n.t('features_title')}
          </h4>
          <ul class="features-list">
            ${items}
          </ul>
        </div>
      `;
    }

    // 4. Instructions Box
    let instructionsHtml = '';
    if (mod.instructions) {
      instructionsHtml = `
        <div class="instructions-container">
          <div class="instructions-header">
            <span class="detail-card-title" style="margin-bottom: 0;">
              <i class="fa-solid fa-book-open"></i> ${HilI18n.t('how_to_install')}
            </span>
            <button class="copy-instructions-btn" id="copyInstructionsBtn">
              <i class="fa-regular fa-copy"></i> ${HilI18n.t('copy_btn')}
            </button>
          </div>
          <p class="instructions-text">${mod.instructions}</p>
        </div>
      `;
    }

    // 5. Categorized Download Buttons (Protected with Rewarded Interstitial)
    const downloadBtnsHtml = mod.downloads.map((dl, index) => `
      <button class="monetized-dl-btn type-${dl.type}" data-dl-index="${index}">
        <div class="dl-btn-left">
          <div class="dl-type-icon">
            <i class="fa-solid ${dl.icon}"></i>
          </div>
          <div>
            <div class="dl-btn-title">${dl.label}</div>
            <div class="dl-btn-sub">
              <span>${dl.host || HilI18n.t('secure_server')}</span>
              <span>•</span>
              <span>${HilI18n.t('touch_to_unlock')}</span>
            </div>
          </div>
        </div>
        <div class="dl-btn-right">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
      </button>
    `).join('');

    // Assemble View
    this.dom.detailsContent.innerHTML = `
      <div class="details-back-bar">
        <button class="back-btn" id="detailsBackBtn">
          <i class="fa-solid fa-arrow-left"></i> ${HilI18n.t('back_to_catalog')}
        </button>
        <button class="favorite-toggle-btn ${isFav ? 'is-fav' : ''}" id="toggleFavoriteBtn" title="Favorite">
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
      </div>

      <div class="detail-header-block">
        <div class="detail-kicker-row">
          <span>${mod.category}</span>
          <span>•</span>
          <span>${mod.id}</span>
          ${mod.tag ? `<span>•</span><span>${mod.tag}</span>` : ''}
        </div>
        <h1 class="detail-title">${mod.displayTitle}</h1>
      </div>

      <div class="gallery-wrapper">
        <div class="gallery-scroll-container" id="galleryScrollContainer">
          ${slidesHtml}
        </div>
        <div class="gallery-dots">
          ${dotsHtml}
        </div>
      </div>

      ${videoHtml}

      <div class="detail-card-box">
        <h4 class="detail-card-title">
          <i class="fa-solid fa-circle-info"></i> ${HilI18n.t('description_title')}
        </h4>
        <p class="detail-desc-text">${mod.description}</p>
      </div>

      ${featuresHtml}
      ${instructionsHtml}

      <div class="download-section-wrap">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fa-solid fa-download"></i> ${HilI18n.t('protected_downloads')} (${mod.downloads.length})
          </h3>
        </div>
        <div class="dl-banner-note">
          <i class="fa-solid fa-circle-play"></i>
          <span>${HilI18n.t('dl_note')}</span>
        </div>
        <div class="download-buttons-list" id="downloadButtonsList">
          ${downloadBtnsHtml}
        </div>
      </div>
    `;

    // Bind Details Action Handlers
    document.getElementById('detailsBackBtn')?.addEventListener('click', () => {
      this.goBack();
    });

    // Favorite Button Handler
    const favBtn = document.getElementById('toggleFavoriteBtn');
    favBtn?.addEventListener('click', () => {
      HilTelegram.haptic('medium');
      const nowFav = HilStorage.toggleFavorite(mod.id);
      favBtn.classList.toggle('is-fav', nowFav);
      favBtn.innerHTML = `<i class="fa-${nowFav ? 'solid' : 'regular'} fa-heart"></i>`;
      this.showToast(nowFav ? HilI18n.t('add_favorite_toast') : HilI18n.t('remove_favorite_toast'), 'info');
      this.renderFavoritesGrid();
    });

    // Copy Instructions Handler
    document.getElementById('copyInstructionsBtn')?.addEventListener('click', () => {
      HilTelegram.haptic('light');
      navigator.clipboard?.writeText(mod.instructions).then(() => {
        this.showToast(HilI18n.t('copied_toast'), 'success');
      }).catch(() => {
        this.showToast(HilI18n.t('manual_copy_toast'), 'info');
      });
    });

    // Lazy YouTube Play Button
    const playBtn = document.getElementById('playVideoOverlayBtn');
    if (playBtn && mod.videoId) {
      playBtn.addEventListener('click', () => {
        HilTelegram.haptic('medium');
        const facade = document.getElementById('youtubeFacade');
        facade.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${mod.videoId}?autoplay=1&rel=0" 
                  title="${mod.displayTitle}" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>
        `;
      });
    }

    // Gallery Zoom / Lightbox
    const galleryContainer = document.getElementById('galleryScrollContainer');
    galleryContainer?.querySelectorAll('.gallery-slide-img').forEach(imgEl => {
      imgEl.addEventListener('click', () => {
        const src = imgEl.getAttribute('data-src');
        if (src) {
          this.dom.lightboxImg.src = src;
          this.dom.lightbox.classList.add('active');
          HilTelegram.haptic('light');
        }
      });
    });

    // Gallery Scroll Dot Sync
    if (galleryContainer) {
      const dots = document.querySelectorAll('.gallery-dot');
      galleryContainer.addEventListener('scroll', () => {
        const scrollIndex = Math.round(galleryContainer.scrollLeft / galleryContainer.clientWidth);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === scrollIndex);
        });
      }, { passive: true });
    }

    // Download Button Click Handlers
    document.querySelectorAll('.monetized-dl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dlIndex = parseInt(btn.getAttribute('data-dl-index'), 10);
        const selectedDl = mod.downloads[dlIndex];
        if (selectedDl) {
          this.openDownloadModal(selectedDl);
        }
      });
    });
  }

  /**
   * Opens Download Modal Prompt
   */
  openDownloadModal(dl) {
    this.pendingDownload = dl;
    HilTelegram.haptic('light');

    this.dom.downloadTargetLabel.textContent = dl.label;
    this.dom.downloadHostLabel.textContent = `${dl.host} • ${dl.type.toUpperCase()}`;
    this.dom.dlModalStatusText.textContent = HilI18n.t('modal_dl_desc');
    this.dom.dlModalStatusText.style.color = 'var(--text-secondary)';
    
    this.dom.startAdBtn.disabled = false;
    this.dom.startAdBtn.innerHTML = `<i class="fa-solid fa-play"></i> ${HilI18n.t('modal_dl_start')}`;

    this.dom.downloadModal.classList.add('active');
  }

  closeDownloadModal() {
    this.dom.downloadModal.classList.remove('active');
    this.pendingDownload = null;
  }

  /**
   * Execute Rewarded Interstitial Ad (Monetag Format B)
   */
  async handleStartRewardedAd() {
    if (!this.pendingDownload) return;
    const targetDl = this.pendingDownload;

    HilTelegram.haptic('medium');
    this.dom.startAdBtn.disabled = true;
    this.dom.startAdBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${HilI18n.t('modal_dl_connecting')}`;
    this.dom.dlModalStatusText.textContent = HilI18n.t('modal_dl_watching');

    try {
      // 1. Invoke central Monetag Rewarded Interstitial Promise
      await HilAds.showRewardedInterstitial();

      // 2. SUCCESS: Ad completed / validated!
      HilTelegram.haptic('success');
      this.dom.dlModalStatusText.textContent = `✅ ${HilI18n.t('modal_dl_success')}`;
      this.dom.dlModalStatusText.style.color = 'var(--color-green)';
      this.dom.startAdBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${HilI18n.t('modal_dl_success_btn')}`;

      this.showToast(HilI18n.t('modal_dl_success'), 'success');

      setTimeout(() => {
        this.closeDownloadModal();
        HilTelegram.openLink(targetDl.url);
      }, 700);

    } catch (err) {
      // 3. ERROR / CANCELLED: Do NOT reward! Show retry button
      console.warn('[HilGaming] Rewarded download ad failed:', err);
      HilTelegram.haptic('error');

      this.dom.startAdBtn.disabled = false;
      this.dom.startAdBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> ${HilI18n.t('modal_dl_retry')}`;

      if (err.code === 'SDK_UNAVAILABLE') {
        this.dom.dlModalStatusText.textContent = `⚠️ ${HilI18n.t('modal_dl_adblock')}`;
        this.dom.dlModalStatusText.style.color = '#ff5252';
      } else {
        this.dom.dlModalStatusText.textContent = `❌ ${HilI18n.t('modal_dl_failed')}`;
        this.dom.dlModalStatusText.style.color = '#ff5252';
      }

      this.showToast(HilI18n.t('modal_dl_failed'), 'error');
    }
  }

  /**
   * Execute Rewarded Popup Ad (Monetag Format C)
   */
  async handleSupportPopupAd() {
    HilTelegram.haptic('medium');
    this.dom.watchPopupAdBtn.disabled = true;
    this.dom.watchPopupAdBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${HilI18n.t('modal_dl_connecting')}`;

    try {
      await HilAds.showRewardedPopup();

      HilStorage.setSupporter(true);
      HilTelegram.haptic('success');
      this.updateSupporterUI();

      this.dom.supporterModal.classList.add('active');
      this.showToast(HilI18n.t('vip_congrats_desc'), 'success');

    } catch (err) {
      console.warn('[HilGaming] Popup ad failed:', err);
      HilTelegram.haptic('error');
      this.showToast('Popup ad cancelled or unavailable.', 'error');
    } finally {
      this.dom.watchPopupAdBtn.disabled = false;
      this.dom.watchPopupAdBtn.innerHTML = `<i class="fa-solid fa-heart"></i> ${HilI18n.t('vip_support_btn')}`;
    }
  }

  /**
   * Update Supporter UI Elements
   */
  updateSupporterUI() {
    const isSupporter = HilStorage.isSupporter();
    if (this.dom.supporterBadgeContainer) {
      if (isSupporter) {
        this.dom.supporterBadgeContainer.innerHTML = `
          <div class="vip-title">
            <i class="fa-solid fa-crown" style="color: #ffab00;"></i> ${HilI18n.t('vip_active_badge')}
          </div>
          <p class="vip-desc">
            ${HilI18n.t('vip_congrats_desc')}
          </p>
          <span style="font-size: 0.78rem; color: var(--color-green); font-weight: 700;">
            <i class="fa-solid fa-circle-check"></i> VIP Status Active
          </span>
        `;
      }
    }
  }

  /**
   * Display Toast Notification
   */
  showToast(message, type = 'info') {
    if (!this.dom.toast) return;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    this.dom.toast.className = `toast-notice ${type} show`;
    this.dom.toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, 3200);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new HilApp();
  app.init();
  window.HilAppInstance = app;
});
