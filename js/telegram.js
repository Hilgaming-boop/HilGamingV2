/**
 * HilGaming Mini App - Telegram Web Apps SDK Adapter
 * Handles lifecycle, BackButton navigation, Theme sync, Haptic feedback, and CloudStorage safety.
 */

export const HilTelegram = {
  tg: null,
  isAvailable: false,
  backButtonCallback: null,

  init() {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;
      this.isAvailable = true;

      try {
        this.tg.ready();
        this.tg.expand();

        // Safe CloudStorage polyfill if running on client < 6.9 or mock browser
        this.ensureCloudStorageSafety();

        // Guard version-specific features to avoid version mismatch warnings
        const hasV61 = typeof this.tg.isVersionAtLeast === 'function' && this.tg.isVersionAtLeast('6.1');
        const hasV62 = typeof this.tg.isVersionAtLeast === 'function' && this.tg.isVersionAtLeast('6.2');

        // Theme colors (requires Bot API 6.1+)
        if (hasV61) {
          if (typeof this.tg.setHeaderColor === 'function') {
            this.tg.setHeaderColor('#0d0f12');
          }
          if (typeof this.tg.setBackgroundColor === 'function') {
            this.tg.setBackgroundColor('#0d0f12');
          }
        }

        // Closing confirmation (requires Bot API 6.2+)
        if (hasV62 && typeof this.tg.enableClosingConfirmation === 'function') {
          this.tg.enableClosingConfirmation();
        }

        console.log('[HilTelegram] Initialized inside Telegram Mini App. Version:', this.tg.version || '6.0', 'Platform:', this.tg.platform);
      } catch (e) {
        console.warn('[HilTelegram] Init warning:', e);
      }
    } else {
      console.log('[HilTelegram] Running in standard browser mode (outside Telegram).');
    }
  },

  /**
   * Ensures CloudStorage does not throw in older versions (< 6.9)
   */
  ensureCloudStorageSafety() {
    if (!this.tg) return;
    const isNative69 = typeof this.tg.isVersionAtLeast === 'function' && this.tg.isVersionAtLeast('6.9');
    if (!isNative69 && (!this.tg.CloudStorage || typeof this.tg.CloudStorage.setItem !== 'function')) {
      const prefix = 'tg_cs_';
      const polyfill = {
        setItem: (key, value, callback) => {
          try {
            localStorage.setItem(prefix + key, String(value));
            if (typeof callback === 'function') setTimeout(() => callback(null, true), 0);
          } catch (err) {
            if (typeof callback === 'function') setTimeout(() => callback(err, false), 0);
          }
          return polyfill;
        },
        getItem: (key, callback) => {
          try {
            const v = localStorage.getItem(prefix + key);
            if (typeof callback === 'function') setTimeout(() => callback(null, v !== null ? v : ''), 0);
          } catch (err) {
            if (typeof callback === 'function') setTimeout(() => callback(err, null), 0);
          }
          return polyfill;
        },
        getItems: (keys, callback) => {
          try {
            const res = {};
            (keys || []).forEach(k => {
              const v = localStorage.getItem(prefix + k);
              if (v !== null) res[k] = v;
            });
            if (typeof callback === 'function') setTimeout(() => callback(null, res), 0);
          } catch (err) {
            if (typeof callback === 'function') setTimeout(() => callback(err, {}), 0);
          }
          return polyfill;
        },
        removeItem: (key, callback) => {
          try {
            localStorage.removeItem(prefix + key);
            if (typeof callback === 'function') setTimeout(() => callback(null, true), 0);
          } catch (err) {
            if (typeof callback === 'function') setTimeout(() => callback(err, false), 0);
          }
          return polyfill;
        },
        removeItems: (keys, callback) => {
          try {
            (keys || []).forEach(k => localStorage.removeItem(prefix + k));
            if (typeof callback === 'function') setTimeout(() => callback(null, true), 0);
          } catch (err) {
            if (typeof callback === 'function') setTimeout(() => callback(err, false), 0);
          }
          return polyfill;
        },
        getKeys: (callback) => {
          try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && k.startsWith(prefix)) {
                keys.push(k.substring(prefix.length));
              }
            }
            if (typeof callback === 'function') setTimeout(() => callback(null, keys), 0);
          } catch (err) {
            if (typeof callback === 'function') setTimeout(() => callback(err, []), 0);
          }
          return polyfill;
        }
      };
      this.tg.CloudStorage = polyfill;
    }
  },

  /**
   * Check if running inside Telegram
   */
  isInsideTelegram() {
    return this.isAvailable && !!this.tg?.initData;
  },

  /**
   * Get basic user info for greeting
   */
  getUser() {
    if (!this.isAvailable || !this.tg.initDataUnsafe?.user) return null;
    return this.tg.initDataUnsafe.user;
  },

  /**
   * Configures native Telegram BackButton
   * @param {Function} callback
   */
  setBackButton(callback) {
    if (!this.isAvailable || !this.tg.BackButton) return;

    if (this.backButtonCallback) {
      this.tg.BackButton.offClick(this.backButtonCallback);
    }

    if (callback) {
      this.backButtonCallback = callback;
      this.tg.BackButton.onClick(callback);
      this.tg.BackButton.show();
    } else {
      this.backButtonCallback = null;
      this.tg.BackButton.hide();
    }
  },

  /**
   * Hide native Telegram BackButton
   */
  hideBackButton() {
    this.setBackButton(null);
  },

  /**
   * Trigger Telegram Haptic Feedback (requires 6.1+)
   * @param {'light'|'medium'|'heavy'|'rigid'|'soft'|'success'|'warning'|'error'} type
   */
  haptic(type = 'light') {
    if (!this.isAvailable || !this.tg.HapticFeedback) return;
    const hasV61 = typeof this.tg.isVersionAtLeast === 'function' && this.tg.isVersionAtLeast('6.1');
    if (!hasV61) return; // Silent return on version 6.0 without throwing console warnings

    try {
      if (['success', 'warning', 'error'].includes(type)) {
        this.tg.HapticFeedback.notificationOccurred(type);
      } else {
        this.tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Haptics fail silently on unsupported platforms
    }
  },

  /**
   * Open external link through Telegram's safe openLink or standard window.open
   */
  openLink(url) {
    if (!url) return;
    if (this.isAvailable && typeof this.tg.openLink === 'function') {
      this.tg.openLink(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};
