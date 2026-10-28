/**
 * HilGaming Mini App - Central Monetag Ads Manager
 * Zone ID: 9590572
 * 
 * Supports:
 *  1. In-App Interstitial (Initialized once on launch)
 *  2. Rewarded Interstitial (show_9590572() - for protected download links)
 *  3. Rewarded Popup (show_9590572('pop') - for VIP supporter / support channel)
 */

export const HilAds = {
  zoneId: '9590572',
  hasInitializedInApp: false,
  isAdRunning: false,
  lastAdTimestamp: 0,

  /**
   * Checks if Monetag SDK function is available on window
   * @returns {boolean}
   */
  isSdkAvailable() {
    return typeof window.show_9590572 === 'function';
  },

  /**
   * Initializes the In-App Interstitial format once on app load
   * Complies with exact parameters requested:
   * frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false
   */
  initInAppInterstitial() {
    if (this.hasInitializedInApp) {
      return;
    }

    if (!this.isSdkAvailable()) {
      // SDK might still be downloading asynchronously, schedule a single deferred check
      const checkSdkInterval = setInterval(() => {
        if (this.isSdkAvailable() && !this.hasInitializedInApp) {
          clearInterval(checkSdkInterval);
          this._executeInAppInit();
        }
      }, 500);

      // Stop checking after 10s to prevent background polling
      setTimeout(() => clearInterval(checkSdkInterval), 10000);
      return;
    }

    this._executeInAppInit();
  },

  _executeInAppInit() {
    if (this.hasInitializedInApp) return;
    try {
      window.show_9590572({
        type: 'inApp',
        inAppSettings: {
          frequency: 2,
          capping: 0.1,
          interval: 30,
          timeout: 5,
          everyPage: false
        }
      });
      this.hasInitializedInApp = true;
      console.log('[Monetag] In-App Interstitial initialized successfully (Zone 9590572)');
    } catch (err) {
      console.warn('[Monetag] In-App Interstitial init warning:', err);
    }
  },

  /**
   * Rewarded Interstitial for file downloads
   * @returns {Promise<any>} Resolves only if ad successfully completed/verified
   */
  async showRewardedInterstitial() {
    if (this.isAdRunning) {
      const err = new Error('Outro anúncio já está sendo exibido. Por favor, aguarde.');
      err.code = 'AD_CONCURRENT_BLOCKED';
      throw err;
    }

    if (!this.isSdkAvailable()) {
      const err = new Error('O SDK de anúncios não está carregado ou foi bloqueado por um AdBlocker.');
      err.code = 'SDK_UNAVAILABLE';
      throw err;
    }

    this.isAdRunning = true;
    console.log('[Monetag] Requesting Rewarded Interstitial for download verification...');

    try {
      // Direct call as specified in Monetag documentation
      const result = await window.show_9590572();
      this.lastAdTimestamp = Date.now();
      console.log('[Monetag] Rewarded Interstitial completed successfully.');
      return result;
    } catch (error) {
      console.warn('[Monetag] Rewarded Interstitial rejected or failed:', error);
      const customErr = new Error('O anúncio não foi concluído com sucesso. Tente novamente para liberar o download.');
      customErr.originalError = error;
      customErr.code = 'AD_FAILED_OR_SKIPPED';
      throw customErr;
    } finally {
      this.isAdRunning = false;
    }
  },

  /**
   * Rewarded Popup for Supporting HilGaming / Creator Perks
   * @returns {Promise<any>}
   */
  async showRewardedPopup() {
    if (this.isAdRunning) {
      const err = new Error('Outro anúncio já está em andamento. Aguarde um instante.');
      err.code = 'AD_CONCURRENT_BLOCKED';
      throw err;
    }

    if (!this.isSdkAvailable()) {
      const err = new Error('O sistema de anúncios não está acessível no momento.');
      err.code = 'SDK_UNAVAILABLE';
      throw err;
    }

    this.isAdRunning = true;
    console.log('[Monetag] Requesting Rewarded Popup (pop)...');

    try {
      const result = await window.show_9590572('pop');
      this.lastAdTimestamp = Date.now();
      console.log('[Monetag] Rewarded Popup completed successfully.');
      return result;
    } catch (error) {
      console.warn('[Monetag] Rewarded Popup failed or cancelled:', error);
      const customErr = new Error('O anúncio Popup não pôde ser completado.');
      customErr.originalError = error;
      customErr.code = 'POPUP_FAILED';
      throw customErr;
    } finally {
      this.isAdRunning = false;
    }
  }
};
