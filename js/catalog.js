/**
 * HilGaming Mini App - Catalog Data Model & Service
 * Preserves 100% of existing mods data, handles offline fallback, search, filtering and sorting.
 */

import { HilStorage } from './storage.js';

export const HilCatalog = {
  mods: [],
  isLoading: false,
  isOffline: false,
  error: null,
  activeFilter: 'all',
  activeSort: 'recent',
  searchQuery: '',

  /**
   * Candidate JSON paths for robust cross-environment hosting
   * (Root domain, GitHub Pages sub-path, relative directory)
   */
  candidateUrls: [
    './data/mods.json',
    'data/mods.json',
    './mods.json',
    'mods.json',
    '/data/mods.json',
    '/mods.json'
  ],

  /**
   * Extract YouTube video ID for thumbnail facade and embed
   */
  extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    try {
      // Handles youtu.be/XXXX
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/')[1].split(/[?&]/);
        return parts[0] || null;
      }
      // Handles youtube.com/watch?v=XXXX
      if (url.includes('watch?v=')) {
        const parts = url.split('watch?v=')[1].split('&');
        return parts[0] || null;
      }
      // Handles embed/XXXX
      if (url.includes('/embed/')) {
        const parts = url.split('/embed/')[1].split(/[?&]/);
        return parts[0] || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Categorizes mod into football gaming categories
   */
  deriveCategory(title = '', tag = '') {
    const text = `${title} ${tag}`.toUpperCase();
    if (text.includes('DFL')) return 'DFL';
    if (text.includes('FTS')) return 'FTS';
    if (text.includes('PES') || text.includes('EFOOTBALL')) return 'PES & eFootball';
    if (text.includes('FIFA') || text.includes('FC 26') || text.includes('FC 27') || text.includes('EA SPORTS')) return 'EA Sports FC & FIFA';
    return 'Outros';
  },

  /**
   * Derives download type and host for badges
   */
  classifyDownload(dl) {
    const label = (dl.label || '').toUpperCase();
    const url = dl.url || '';

    let type = 'file';
    let icon = 'fa-file-arrow-down';
    let badgeColor = 'blue';

    if (label.includes('APK')) {
      type = 'apk';
      icon = 'fa-android';
      badgeColor = 'green';
    } else if (label.includes('OBB')) {
      type = 'obb';
      icon = 'fa-folder';
      badgeColor = 'amber';
    } else if (label.includes('DATA')) {
      type = 'data';
      icon = 'fa-database';
      badgeColor = 'purple';
    } else if (label.includes('FACES') || label.includes('KITS') || label.includes('SCENEASSETS') || label.includes('SCENESETS')) {
      type = 'scenesets';
      icon = 'fa-shirt';
      badgeColor = 'pink';
    } else if (label.includes('COMMENTARY') || label.includes('NARRAÇÃO')) {
      type = 'commentary';
      icon = 'fa-microphone';
      badgeColor = 'cyan';
    } else if (label.includes('FREE') || label.includes('PREMIUM') || label.includes('DOWNLOAD')) {
      type = 'external';
      icon = 'fa-arrow-up-right-from-square';
      badgeColor = 'red';
    }

    // Host detection
    let host = 'Servidor Seguro';
    if (url.includes('modsfire.com')) host = 'ModsFire';
    else if (url.includes('mediafire.com')) host = 'MediaFire';
    else if (url.includes('mega.nz')) host = 'MEGA';
    else if (url.includes('gofile.io')) host = 'GoFile';
    else if (url.includes('sharemods.com')) host = 'ShareMods';
    else if (url.includes('roberfl.com')) host = 'RoberFL Oficial';
    else if (url.includes('giiodroid.com')) host = 'GiiODroid';
    else if (url.includes('alphatrixgaming2.blogspot')) host = 'Alphatrix';

    return {
      ...dl,
      type,
      icon,
      badgeColor,
      host
    };
  },

  /**
   * Normalizes raw mod item while keeping 100% of existing attributes intact
   */
  normalizeMod(raw, index) {
    const titleParts = (raw.title || '').split('|');
    const displayTitle = titleParts[0].trim();
    const extractedId = titleParts[1] ? titleParts[1].trim() : `ID-${String(index + 1).padStart(4, '0')}`;
    const cleanId = raw.id || extractedId;

    const videoId = this.extractYouTubeId(raw.video);
    const category = this.deriveCategory(raw.title, raw.tag);

    // Classify download links
    const downloads = Array.isArray(raw.downloads)
      ? raw.downloads.map(dl => this.classifyDownload(dl))
      : [];

    return {
      ...raw,
      id: cleanId,
      displayTitle,
      category,
      videoId,
      downloads,
      images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : ['/assets/fallback-mod.svg'],
      features: Array.isArray(raw.features) ? raw.features : [],
      instructions: raw.instructions || 'Extraia os arquivos baixados e instale o APK no seu dispositivo Android.',
      description: raw.description || `Download do mod ${displayTitle} para Android offline com elencos atualizados e novos gráficos.`
    };
  },

  /**
   * Loads the catalog from network or cached storage
   * @param {boolean} forceRefresh - If true, ignores cache and requests latest from network
   */
  async loadCatalog(forceRefresh = false) {
    this.isLoading = true;
    this.error = null;

    // Check localStorage cache first unless forceRefresh is set
    if (!forceRefresh) {
      const cached = HilStorage.getCachedCatalog(false);
      if (cached && cached.data && cached.data.length > 0) {
        this.mods = cached.data.map((m, i) => this.normalizeMod(m, i));
        this.isLoading = false;
        this.isOffline = false;
        console.log(`[HilCatalog] Loaded ${this.mods.length} mods from local cache.`);
        
        // Asynchronously check network in background to keep cache fresh
        this._syncLatestInBackground();
        return this.mods;
      }
    }

    // Attempt network fetch
    let fetchedData = null;
    let fetchError = null;

    for (const path of this.candidateUrls) {
      try {
        const res = await fetch(`${path}?_t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            fetchedData = json;
            console.log(`[HilCatalog] Successfully fetched ${json.length} mods from ${path}`);
            break;
          }
        }
      } catch (e) {
        fetchError = e;
      }
    }

    if (fetchedData) {
      // Save valid data to cache
      HilStorage.setCachedCatalog(fetchedData);
      this.mods = fetchedData.map((m, i) => this.normalizeMod(m, i));
      this.isOffline = false;
      this.isLoading = false;
      return this.mods;
    }

    // If network failed, try offline fallback from expired cache
    const staleCache = HilStorage.getCachedCatalog(true);
    if (staleCache && staleCache.data && staleCache.data.length > 0) {
      this.mods = staleCache.data.map((m, i) => this.normalizeMod(m, i));
      this.isOffline = true;
      this.isLoading = false;
      console.warn('[HilCatalog] Network unreachable, using stale offline cache.');
      return this.mods;
    }

    // No cache and no network
    this.isLoading = false;
    this.error = fetchError || new Error('Não foi possível carregar o catálogo de mods. Verifique a conexão.');
    throw this.error;
  },

  /**
   * Background sync helper
   */
  async _syncLatestInBackground() {
    for (const path of this.candidateUrls) {
      try {
        const res = await fetch(`${path}?_sync=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            HilStorage.setCachedCatalog(json);
            this.mods = json.map((m, i) => this.normalizeMod(m, i));
            console.log('[HilCatalog] Background cache sync completed.');
            break;
          }
        }
      } catch (e) {
        // Silent background fail
      }
    }
  },

  /**
   * Get single mod by ID
   */
  getModById(id) {
    if (!id) return null;
    return this.mods.find(m => m.id === id || m.title.includes(id)) || null;
  },

  /**
   * Filter and sort mods
   */
  getFilteredMods({ query = '', category = 'all', sort = 'recent', favoritesOnly = false } = {}) {
    let result = [...this.mods];

    // Favorites filter
    if (favoritesOnly) {
      const favIds = new Set(HilStorage.getFavorites());
      result = result.filter(m => favIds.has(m.id));
    }

    // Category filter
    if (category && category !== 'all') {
      result = result.filter(m => m.category === category);
    }

    // Text search query
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(m => {
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchId = m.id.toLowerCase().includes(q);
        const matchTag = (m.tag || '').toLowerCase().includes(q);
        const matchDesc = (m.description || '').toLowerCase().includes(q);
        const matchFeat = (m.features || []).some(f => f.toLowerCase().includes(q));
        return matchTitle || matchId || matchTag || matchDesc || matchFeat;
      });
    }

    // Sorting
    if (sort === 'az') {
      result.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
    } else if (sort === 'za') {
      result.sort((a, b) => b.displayTitle.localeCompare(a.displayTitle));
    } else if (sort === 'downloads') {
      result.sort((a, b) => (b.downloads?.length || 0) - (a.downloads?.length || 0));
    }
    // 'recent' keeps original order (first items are newest releases)

    return result;
  },

  /**
   * Returns list of unique categories and counts
   */
  getCategories() {
    const counts = {
      'PES & eFootball': 0,
      'EA Sports FC & FIFA': 0,
      'DFL': 0,
      'FTS': 0,
      'Outros': 0
    };

    this.mods.forEach(m => {
      if (counts[m.category] !== undefined) {
        counts[m.category]++;
      } else {
        counts['Outros']++;
      }
    });

    return [
      { id: 'all', i18nKey: 'cat_all', name: 'All Mods', count: this.mods.length, icon: 'fa-gamepad' },
      { id: 'PES & eFootball', i18nKey: 'cat_pes', name: 'PES & eFootball', count: counts['PES & eFootball'], icon: 'fa-futbol' },
      { id: 'EA Sports FC & FIFA', i18nKey: 'cat_fifa', name: 'EA FC & FIFA', count: counts['EA Sports FC & FIFA'], icon: 'fa-trophy' },
      { id: 'DFL', i18nKey: 'cat_dfl', name: 'DFL (RoberFL)', count: counts['DFL'], icon: 'fa-star' },
      { id: 'FTS', i18nKey: 'cat_fts', name: 'FTS Mobile', count: counts['FTS'], icon: 'fa-bolt' }
    ];
  }
};
