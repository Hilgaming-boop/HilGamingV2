/**
 * HilGaming Mini App - Storage & Local Cache Manager
 * Handles catalog caching, timestamp validation, user favorites and supporter status
 */

const CACHE_KEY = 'hilgaming_catalog_cache_v2';
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours TTL
const FAVORITES_KEY = 'hilgaming_user_favorites';
const SUPPORTER_KEY = 'hilgaming_vip_supporter';
const LANGUAGE_KEY = 'hilgaming_user_language';

export const HilStorage = {
  /**
   * Safe localStorage get
   */
  _getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('[HilStorage] LocalStorage access failed:', e);
      return null;
    }
  },

  /**
   * Safe localStorage set
   */
  _setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('[HilStorage] LocalStorage write failed:', e);
      return false;
    }
  },

  /**
   * Returns cached catalog if available and not strictly expired
   * @param {boolean} ignoreTTL - If true, returns cache regardless of age (offline fallback)
   */
  getCachedCatalog(ignoreTTL = false) {
    try {
      const raw = this._getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.data)) return null;

      const age = Date.now() - (parsed.timestamp || 0);
      if (!ignoreTTL && age > CACHE_TTL_MS) {
        return { data: parsed.data, isExpired: true, timestamp: parsed.timestamp };
      }
      return { data: parsed.data, isExpired: false, timestamp: parsed.timestamp };
    } catch (e) {
      console.warn('[HilStorage] Error parsing catalog cache:', e);
      return null;
    }
  },

  /**
   * Stores fresh catalog in localStorage with current timestamp
   */
  setCachedCatalog(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    const payload = {
      timestamp: Date.now(),
      version: '2.0.0',
      data
    };
    return this._setItem(CACHE_KEY, JSON.stringify(payload));
  },

  /**
   * Clears the cached catalog to force network reload
   */
  clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      console.warn(e);
    }
  },

  /**
   * Gets list of favorite mod IDs
   * @returns {string[]}
   */
  getFavorites() {
    try {
      const raw = this._getItem(FAVORITES_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Checks if mod is in favorites
   * @param {string} modId
   * @returns {boolean}
   */
  isFavorite(modId) {
    if (!modId) return false;
    const favs = this.getFavorites();
    return favs.includes(modId);
  },

  /**
   * Toggles mod favorite status
   * @param {string} modId
   * @returns {boolean} new favorite status
   */
  toggleFavorite(modId) {
    if (!modId) return false;
    const favs = new Set(this.getFavorites());
    let isFav = false;
    if (favs.has(modId)) {
      favs.delete(modId);
      isFav = false;
    } else {
      favs.add(modId);
      isFav = true;
    }
    this._setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
    return isFav;
  },

  /**
   * Check if user has supported the app via Rewarded Popup
   */
  isSupporter() {
    return this._getItem(SUPPORTER_KEY) === 'true';
  },

  /**
   * Mark user as VIP supporter
   */
  setSupporter(status = true) {
    return this._setItem(SUPPORTER_KEY, status ? 'true' : 'false');
  },

  /**
   * Get user preferred language (e.g. 'en', 'es', 'fr', 'ar', 'id', 'pt')
   * @returns {string|null}
   */
  getLanguage() {
    return this._getItem(LANGUAGE_KEY);
  },

  /**
   * Check if user has explicitly chosen a language
   */
  hasSelectedLanguage() {
    return !!this._getItem(LANGUAGE_KEY);
  },

  /**
   * Store user preferred language
   * @param {string} lang
   */
  setLanguage(lang) {
    if (!lang) return false;
    return this._setItem(LANGUAGE_KEY, lang.toLowerCase());
  }
};
