/**
 * HilGaming Mini App - Internationalization (i18n) Engine
 * Supported Languages:
 *   - en: English (Primary Default)
 *   - es: Español (Spanish)
 *   - fr: Français (French)
 *   - ar: العربية (Arabic, RTL)
 *   - id: Bahasa Indonesia (Indonesian)
 *   - pt: Português (Portuguese)
 */

import { HilStorage } from './storage.js';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', isRTL: false, isDefault: true },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷', isRTL: false }
];

const TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_games: 'Games',
    nav_categories: 'Categories',
    nav_favorites: 'Favorites',
    nav_about: 'About',

    // Top Bar
    refresh_tooltip: 'Refresh Catalog',
    language_select_title: 'Select Language',
    offline_banner: 'Offline Mode — Displaying cached local catalog.',

    // Search & Filters
    search_placeholder: 'Search by title, ID or game (e.g. PES, FIFA, DFL)...',
    search_clear: 'Clear search',
    sort_recent: 'Most Recent',
    sort_az: 'Name A-Z',
    sort_za: 'Name Z-A',
    sort_downloads: 'Most Files',

    // Categories
    cat_all: 'All Mods',
    cat_pes: 'PES & eFootball',
    cat_fifa: 'EA FC & FIFA',
    cat_dfl: 'DFL (RoberFL)',
    cat_fts: 'FTS Mobile',
    cat_other: 'Other Mods',
    cat_count_suffix: 'mods available',
    categories_title: 'Football Mod Categories',

    // Home view
    spotlight_kicker: 'Spotlight of the Week',
    available_files: 'Files Available',
    video_included: 'Video Included',
    quick_categories: 'Quick Categories',
    view_all: 'View All',
    recent_releases: 'Recent Releases',
    all_mods_title: 'All Mods',
    files_links_count: 'links',

    // Empty States
    no_results_title: 'No mods found',
    no_results_desc: 'Try adjusting your search query or choosing another category.',
    favorites_empty_title: 'No saved favorites',
    favorites_empty_desc: 'Tap the heart icon on any game page to save it here on your device.',

    // Details View
    back_to_catalog: 'Back to Catalog',
    add_favorite_toast: 'Added to Favorites!',
    remove_favorite_toast: 'Removed from Favorites',
    features_title: 'Features & Highlights',
    how_to_install: 'How to Install on Android',
    copy_btn: 'Copy',
    copied_toast: 'Instructions copied to clipboard!',
    manual_copy_toast: 'Please select and copy instructions manually.',
    watch_gameplay: 'Watch Gameplay / Tutorial',
    description_title: 'Description',
    protected_downloads: 'Protected Downloads',
    dl_note: 'Downloads are unlocked after watching a quick Monetag ad.',
    touch_to_unlock: 'Tap to unlock',
    secure_server: 'Secure Server',

    // Download Modal (Rewarded Interstitial)
    modal_dl_title: 'Protected Download',
    modal_dl_desc: 'To unlock this direct link and support HilGaming servers, please watch the short ad until completion.',
    modal_dl_start: 'Watch Ad & Download',
    modal_dl_cancel: 'Cancel',
    modal_dl_connecting: 'Connecting to Ad...',
    modal_dl_watching: 'Showing secure ad. Please watch until the end...',
    modal_dl_success: 'Ad verified! Starting download...',
    modal_dl_success_btn: 'Download Unlocked!',
    modal_dl_failed: 'The ad was not completed. Please watch until the end to unlock the download.',
    modal_dl_adblock: 'Adblocker detected. Please disable AdBlock to download for free.',
    modal_dl_retry: 'Try Again',

    // VIP Supporter / About View
    about_app_title: 'HilGaming Mini App',
    about_app_desc: 'Your ultimate hub for Android offline football mods: eFootball PES, EA Sports FC / FIFA, DFL, and FTS. Daily updates with fresh rosters, kits, stadiums, and career modes.',
    official_channel: 'Official Channel',
    vip_support_title: 'Support HilGaming',
    vip_support_desc: 'Enjoying our free catalog? Watch a quick Popup ad to support the creators and unlock the exclusive VIP Supporter badge on this device!',
    vip_support_btn: 'Support with Popup Ad',
    vip_active_badge: 'VIP Supporter Active',
    vip_congrats_title: 'Thank You for Supporting!',
    vip_congrats_desc: 'You successfully watched the support Popup ad. Your VIP Supporter badge is now active!',
    continue_browsing: 'Continue Browsing',

    // Install Guide Steps
    guide_title: 'Basic Android Installation Guide',
    guide_step_1: 'Download required files: APK, OBB and DATA (if any) using our secure links.',
    guide_step_2: 'Install ZArchiver: Free file manager on Google Play to extract .zip and .rar archives.',
    guide_step_3: 'Extract game data: Move the OBB folder to Android/obb/ and DATA to Android/data/.',
    guide_step_4: 'Install and Launch APK: Grant necessary storage permissions and enjoy offline football!',
    transparency_title: 'Monetag Integrity & Ad Transparency',
    transparency_desc: 'To keep all mods, high-speed servers, and links 100% free for Telegram users, HilGaming uses certified Monetag ads. All downloads point to verified community modders and original file hosts.',

    // Language modal
    lang_modal_title: 'Select Language',
    lang_modal_subtitle: 'Choose your preferred language for the HilGaming Mini App',
    lang_modal_confirm: 'Confirm & Continue',
    lang_changed_toast: 'Language changed to English',

    // General Toasts & Messages
    catalog_refreshing: 'Updating mods catalog...',
    catalog_refreshed: 'Catalog updated successfully!',
    catalog_error: 'Unable to sync with server. Using local cache.',
    ad_in_progress: 'Another ad is currently running. Please wait.'
  },

  es: {
    nav_home: 'Inicio',
    nav_games: 'Juegos',
    nav_categories: 'Categorías',
    nav_favorites: 'Favoritos',
    nav_about: 'Acerca de',

    refresh_tooltip: 'Actualizar catálogo',
    language_select_title: 'Seleccionar idioma',
    offline_banner: 'Modo sin conexión — Mostrando catálogo guardado en caché local.',

    search_placeholder: 'Buscar por título, ID o juego (ej: PES, FIFA, DFL)...',
    search_clear: 'Borrar búsqueda',
    sort_recent: 'Más recientes',
    sort_az: 'Nombre A-Z',
    sort_za: 'Nombre Z-A',
    sort_downloads: 'Más archivos',

    cat_all: 'Todos los mods',
    cat_pes: 'PES & eFootball',
    cat_fifa: 'EA FC & FIFA',
    cat_dfl: 'DFL (RoberFL)',
    cat_fts: 'FTS Mobile',
    cat_other: 'Otros mods',
    cat_count_suffix: 'mods disponibles',
    categories_title: 'Categorías de fútbol',

    spotlight_kicker: 'Destacado de la semana',
    available_files: 'Archivos disponibles',
    video_included: 'Video incluido',
    quick_categories: 'Categorías rápidas',
    view_all: 'Ver todos',
    recent_releases: 'Lanzamientos recientes',
    all_mods_title: 'Todos los mods',
    files_links_count: 'enlaces',

    no_results_title: 'No se encontraron mods',
    no_results_desc: 'Intenta cambiar el término de búsqueda o selecciona otra categoría.',
    favorites_empty_title: 'Sin favoritos guardados',
    favorites_empty_desc: 'Toca el icono del corazón en cualquier juego para guardarlo aquí.',

    back_to_catalog: 'Volver al catálogo',
    add_favorite_toast: '¡Añadido a favoritos!',
    remove_favorite_toast: 'Eliminado de favoritos',
    features_title: 'Características y novedades',
    how_to_install: 'Cómo instalar en Android',
    copy_btn: 'Copiar',
    copied_toast: '¡Instrucciones copiadas al portapapeles!',
    manual_copy_toast: 'Selecciona y copia las instrucciones manualmente.',
    watch_gameplay: 'Ver Gameplay / Tutorial',
    description_title: 'Descripción',
    protected_downloads: 'Descargas protegidas',
    dl_note: 'Las descargas se desbloquean tras ver un breve anuncio de Monetag.',
    touch_to_unlock: 'Toca para desbloquear',
    secure_server: 'Servidor seguro',

    modal_dl_title: 'Descarga protegida',
    modal_dl_desc: 'Para desbloquear el enlace directo y apoyar a HilGaming, mira el anuncio corto hasta el final.',
    modal_dl_start: 'Ver anuncio y descargar',
    modal_dl_cancel: 'Cancelar',
    modal_dl_connecting: 'Conectando con el anuncio...',
    modal_dl_watching: 'Mostrando anuncio seguro. Mira hasta el final...',
    modal_dl_success: '¡Anuncio verificado! Iniciando descarga...',
    modal_dl_success_btn: '¡Descarga desbloqueada!',
    modal_dl_failed: 'El anuncio no se completó. Míralo hasta el final para desbloquear la descarga.',
    modal_dl_adblock: 'Bloqueador de anuncios detectado. Desactiva AdBlock para descargar gratis.',
    modal_dl_retry: 'Reintentar',

    about_app_title: 'HilGaming Mini App',
    about_app_desc: 'Tu centro oficial de mods de fútbol para Android offline: eFootball PES, EA Sports FC / FIFA, DFL y FTS. Actualizaciones diarias con plantillas, kits y modos carrera.',
    official_channel: 'Canal oficial',
    vip_support_title: 'Apoyar a HilGaming',
    vip_support_desc: '¿Te gusta nuestro catálogo gratuito? Mira un anuncio Popup para apoyar a los creadores y activar la insignia de Apoiador VIP.',
    vip_support_btn: 'Apoyar con anuncio Popup',
    vip_active_badge: 'Insignia VIP activa',
    vip_congrats_title: '¡Gracias por tu apoyo!',
    vip_congrats_desc: 'Has visto el anuncio Popup con éxito. ¡Tu insignia VIP ya está activa en este dispositivo!',
    continue_browsing: 'Continuar navegando',

    guide_title: 'Guía básica de instalación en Android',
    guide_step_1: 'Descarga los archivos: APK, OBB y DATA (si aplica) mediante nuestros enlaces.',
    guide_step_2: 'Instala ZArchiver: Administrador recomendado en Google Play para descomprimir .zip y .rar.',
    guide_step_3: 'Extrae los datos: Mueve la carpeta OBB a Android/obb/ y DATA a Android/data/.',
    guide_step_4: 'Instala y abre el APK: Concede los permisos necesarios y disfruta del fútbol offline.',
    transparency_title: 'Transparencia y publicidad Monetag',
    transparency_desc: 'Para mantener todos los mods y servidores gratuitos en Telegram, HilGaming utiliza anuncios Monetag certificados. Todos los enlaces apuntan a servidores oficiales.',

    lang_modal_title: 'Seleccionar idioma',
    lang_modal_subtitle: 'Elige tu idioma preferido para HilGaming Mini App',
    lang_modal_confirm: 'Confirmar y continuar',
    lang_changed_toast: 'Idioma cambiado a Español',

    catalog_refreshing: 'Actualizando catálogo...',
    catalog_refreshed: '¡Catálogo actualizado con éxito!',
    catalog_error: 'No se pudo sincronizar. Usando caché local.',
    ad_in_progress: 'Ya hay otro anuncio en curso. Espera un momento.'
  },

  fr: {
    nav_home: 'Accueil',
    nav_games: 'Jeux',
    nav_categories: 'Catégories',
    nav_favorites: 'Favoris',
    nav_about: 'À propos',

    refresh_tooltip: 'Actualiser le catalogue',
    language_select_title: 'Choisir la langue',
    offline_banner: 'Mode hors ligne — Affichage du catalogue en cache local.',

    search_placeholder: 'Rechercher par titre, ID ou jeu (ex: PES, FIFA, DFL)...',
    search_clear: 'Effacer la recherche',
    sort_recent: 'Plus récents',
    sort_az: 'Nom A-Z',
    sort_za: 'Nom Z-A',
    sort_downloads: 'Plus de fichiers',

    cat_all: 'Tous les mods',
    cat_pes: 'PES & eFootball',
    cat_fifa: 'EA FC & FIFA',
    cat_dfl: 'DFL (RoberFL)',
    cat_fts: 'FTS Mobile',
    cat_other: 'Autres mods',
    cat_count_suffix: 'mods disponibles',
    categories_title: 'Catégories de football',

    spotlight_kicker: 'À la une cette semaine',
    available_files: 'Fichiers disponibles',
    video_included: 'Vidéo incluse',
    quick_categories: 'Catégories rapides',
    view_all: 'Voir tout',
    recent_releases: 'Sorties récentes',
    all_mods_title: 'Tous les mods',
    files_links_count: 'liens',

    no_results_title: 'Aucun mod trouvé',
    no_results_desc: 'Modifiez votre recherche ou sélectionnez une autre catégorie.',
    favorites_empty_title: 'Aucun favori enregistré',
    favorites_empty_desc: 'Appuyez sur le cœur sur une fiche de jeu pour la sauvegarder ici.',

    back_to_catalog: 'Retour au catalogue',
    add_favorite_toast: 'Ajouté aux favoris !',
    remove_favorite_toast: 'Retiré des favoris',
    features_title: 'Fonctionnalités et nouveautés',
    how_to_install: 'Comment installer sur Android',
    copy_btn: 'Copier',
    copied_toast: 'Instructions copiées dans le presse-papiers !',
    manual_copy_toast: 'Veuillez sélectionner et copier manuellement.',
    watch_gameplay: 'Voir le Gameplay / Tutoriel',
    description_title: 'Description',
    protected_downloads: 'Téléchargements sécurisés',
    dl_note: 'Les téléchargements sont débloqués après une courte publicité Monetag.',
    touch_to_unlock: 'Appuyez pour débloquer',
    secure_server: 'Serveur sécurisé',

    modal_dl_title: 'Téléchargement protégé',
    modal_dl_desc: 'Pour débloquer le lien et soutenir HilGaming, veuillez regarder la publicité jusqu’à la fin.',
    modal_dl_start: 'Regarder la pub & Télécharger',
    modal_dl_cancel: 'Annuler',
    modal_dl_connecting: 'Connexion à la pub...',
    modal_dl_watching: 'Publicité en cours. Merci de regarder jusqu’au bout...',
    modal_dl_success: 'Publicité validée ! Lancement du téléchargement...',
    modal_dl_success_btn: 'Téléchargement débloqué !',
    modal_dl_failed: 'La publicité n’a pas été terminée. Regardez-la en entier pour débloquer.',
    modal_dl_adblock: 'Bloqueur de publicité détecté. Désactivez AdBlock pour continuer.',
    modal_dl_retry: 'Réessayer',

    about_app_title: 'HilGaming Mini App',
    about_app_desc: 'Votre hub complet de mods football Android hors ligne : eFootball PES, EA Sports FC / FIFA, DFL et FTS. Mises à jour quotidiennes des effectifs, maillots et modes carrière.',
    official_channel: 'Chaîne officielle',
    vip_support_title: 'Soutenir HilGaming',
    vip_support_desc: 'Vous appréciez notre catalogue gratuit ? Regardez une courte pub Popup pour soutenir les créateurs et débloquer le badge VIP.',
    vip_support_btn: 'Soutenir via pub Popup',
    vip_active_badge: 'Badge VIP actif',
    vip_congrats_title: 'Merci pour votre soutien !',
    vip_congrats_desc: 'Vous avez visionné la publicité Popup. Votre badge VIP est maintenant débloqué !',
    continue_browsing: 'Continuer la navigation',

    guide_title: 'Guide d’installation Android',
    guide_step_1: 'Téléchargez les fichiers requis : APK, OBB et DATA (le cas échéant).',
    guide_step_2: 'Installez ZArchiver : Disponible sur Google Play pour extraire les .zip et .rar.',
    guide_step_3: 'Extrayez les données : Déplacez le dossier OBB dans Android/obb/ et DATA dans Android/data/.',
    guide_step_4: 'Installez et lancez l’APK : Accordez les autorisations et jouez hors ligne !',
    transparency_title: 'Transparence publicitaire Monetag',
    transparency_desc: 'Pour maintenir l’accès gratuit à tous les mods et serveurs sur Telegram, HilGaming utilise des publicités Monetag vérifiées.',

    lang_modal_title: 'Choisir la langue',
    lang_modal_subtitle: 'Sélectionnez votre langue préférée pour l’application HilGaming',
    lang_modal_confirm: 'Confirmer et continuer',
    lang_changed_toast: 'Langue changée en Français',

    catalog_refreshing: 'Mise à jour du catalogue...',
    catalog_refreshed: 'Catalogue mis à jour avec succès !',
    catalog_error: 'Impossible de synchroniser. Utilisation du cache local.',
    ad_in_progress: 'Une autre publicité est en cours. Veuillez patienter.'
  },

  ar: {
    nav_home: 'الرئيسية',
    nav_games: 'الألعاب',
    nav_categories: 'الأقسام',
    nav_favorites: 'المفضلة',
    nav_about: 'حول التطبيق',

    refresh_tooltip: 'تحديث الدليل',
    language_select_title: 'اختر اللغة',
    offline_banner: 'وضع عدم الاتصال — يتم عرض المحتوى المحفوظ محلياً.',

    search_placeholder: 'ابحث بالاسم، المعرف أو اللعبة (مثال: PES, FIFA, DFL)...',
    search_clear: 'مسح البحث',
    sort_recent: 'الأحدث',
    sort_az: 'أبجدياً (أ-ي)',
    sort_za: 'أبجدياً (ي-أ)',
    sort_downloads: 'الأكثر ملفات',

    cat_all: 'جميع المودات',
    cat_pes: 'PES & eFootball',
    cat_fifa: 'EA FC & FIFA',
    cat_dfl: 'DFL (RoberFL)',
    cat_fts: 'FTS Mobile',
    cat_other: 'مودات أخرى',
    cat_count_suffix: 'مود متاح',
    categories_title: 'أقسام ألعاب كرة القدم',

    spotlight_kicker: 'مميز هذا الأسبوع',
    available_files: 'الملفات المتوفرة',
    video_included: 'فيديو توضيحي مرفق',
    quick_categories: 'أقسام سريعة',
    view_all: 'عرض الكل',
    recent_releases: 'أحدث الإضافات',
    all_mods_title: 'جميع المودات',
    files_links_count: 'روابط',

    no_results_title: 'لم يتم العثور على نتائج',
    no_results_desc: 'جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً.',
    favorites_empty_title: 'لا توجد عناصر مفضلة',
    favorites_empty_desc: 'اضغط على رمز القلب داخل أي لعبة لحفظها هنا على جهازك.',

    back_to_catalog: 'العودة للدليل',
    add_favorite_toast: 'تمت الإضافة إلى المفضلة!',
    remove_favorite_toast: 'تمت الإزالة من المفضلة',
    features_title: 'المميزات والتفاصيل',
    how_to_install: 'طريقة التثبيت على الأندرويد',
    copy_btn: 'نسخ',
    copied_toast: 'تم نسخ التعليمات بنجاح!',
    manual_copy_toast: 'يرجى تحديد النص ونسخه يدوياً.',
    watch_gameplay: 'مشاهدة تجربة اللعب / الشرح',
    description_title: 'الوصف',
    protected_downloads: 'روابط التحميل المباشرة',
    dl_note: 'يتم فتح روابط التحميل بعد مشاهدة إعلان قصير لدعم التطبيق.',
    touch_to_unlock: 'اضغط لفتح الرابط',
    secure_server: 'سيرفر آمن وسريع',

    modal_dl_title: 'تحميل مباشر وآمن',
    modal_dl_desc: 'لفتح الرابط المباشر ودعم سيرفرات HilGaming، يرجى مشاهدة الإعلان القصير حتى النهاية.',
    modal_dl_start: 'مشاهدة الإعلان والتحميل',
    modal_dl_cancel: 'إلغاء',
    modal_dl_connecting: 'جارٍ الاتصال بالإعلان...',
    modal_dl_watching: 'يتم عرض الإعلان. يرجى الانتظار حتى اكتماله...',
    modal_dl_success: 'تم التحقق من الإعلان! يبدأ التحميل الآن...',
    modal_dl_success_btn: 'تم فتح التحميل!',
    modal_dl_failed: 'لم يكتمل الإعلان. يرجى إكماله للنهاية لفتح التحميل.',
    modal_dl_adblock: 'تم اكتشاف مانع إعلانات. عطل AdBlock للاستمرار مجاناً.',
    modal_dl_retry: 'إعادة المحاولة',

    about_app_title: 'تطبيق HilGaming Mini App',
    about_app_desc: 'دليلك الشامل لمودات كرة القدم للأندرويد أوفلاين: eFootball PES و FIFA / EA FC و DFL و FTS. تحديثات يومية للأطقم والتشكيلات والملاعب.',
    official_channel: 'القناة الرسمية',
    vip_support_title: 'دعم مطوري HilGaming',
    vip_support_desc: 'هل يعجبك الدليل المجاني؟ شاهد إعلان Popup سريع لدعمنا وتفعيل شارة الداعم VIP على جهازك!',
    vip_support_btn: 'دعم بمشاهدة إعلان Popup',
    vip_active_badge: 'شارة VIP مفعلة',
    vip_congrats_title: 'شكراً جزيلاً لدعمك!',
    vip_congrats_desc: 'تمت مشاهدة الإعلان بنجاح. أصبحت الآن داعماً متميزاً VIP!',
    continue_browsing: 'متابعة التصفح',

    guide_title: 'خطوات التثبيت الأساسية',
    guide_step_1: 'تحميل الملفات: APK و OBB و DATA من الروابط الآمنة.',
    guide_step_2: 'تثبيت ZArchiver: تطبيق فك الضغط الموصى به من متجر Google Play.',
    guide_step_3: 'نقل الملفات: نقل مجلد OBB إلى مسار Android/obb/ ومجلد DATA إلى Android/data/.',
    guide_step_4: 'تثبيت وتشغيل APK: منح أذونات التخزين والاستمتاع باللعب دون إنترنت!',
    transparency_title: 'الشفافية وإعلانات Monetag',
    transparency_desc: 'للحفاظ على مجانية المودات وسيرفرات التحميل، يستخدم التطبيق إعلانات Monetag المعتمدة. جميع الروابط أصلية ومباشرة.',

    lang_modal_title: 'اختر لغة التطبيق',
    lang_modal_subtitle: 'حدد اللغة المفضلة لاستخدام تطبيق HilGaming',
    lang_modal_confirm: 'تأكيد واستمرار',
    lang_changed_toast: 'تم تغيير اللغة إلى العربية',

    catalog_refreshing: 'جارٍ تحديث الدليل...',
    catalog_refreshed: 'تم تحديث المودات بنجاح!',
    catalog_error: 'تعذر الاتصال بالسيرفر. يتم استخدام النسخة المحفوظة.',
    ad_in_progress: 'هناك إعلان آخر قيد التشغيل بالفعل. يرجى الانتظار.'
  },

  id: {
    nav_home: 'Beranda',
    nav_games: 'Game',
    nav_categories: 'Kategori',
    nav_favorites: 'Favorit',
    nav_about: 'Tentang',

    refresh_tooltip: 'Perbarui Katalog',
    language_select_title: 'Pilih Bahasa',
    offline_banner: 'Mode Offline — Menampilkan katalog tersimpan di memori lokal.',

    search_placeholder: 'Cari berdasarkan judul, ID, atau game (mis. PES, FIFA, DFL)...',
    search_clear: 'Hapus pencarian',
    sort_recent: 'Terbaru',
    sort_az: 'Nama A-Z',
    sort_za: 'Nama Z-A',
    sort_downloads: 'File Terbanyak',

    cat_all: 'Semua Mod',
    cat_pes: 'PES & eFootball',
    cat_fifa: 'EA FC & FIFA',
    cat_dfl: 'DFL (RoberFL)',
    cat_fts: 'FTS Mobile',
    cat_other: 'Mod Lainnya',
    cat_count_suffix: 'mod tersedia',
    categories_title: 'Kategori Mod Sepak Bola',

    spotlight_kicker: 'Pilihan Minggu Ini',
    available_files: 'File Tersedia',
    video_included: 'Termasuk Video',
    quick_categories: 'Kategori Cepat',
    view_all: 'Lihat Semua',
    recent_releases: 'Rilis Terbaru',
    all_mods_title: 'Semua Mod',
    files_links_count: 'tautan',

    no_results_title: 'Mod tidak ditemukan',
    no_results_desc: 'Coba ubah kata kunci pencarian atau pilih kategori lain.',
    favorites_empty_title: 'Belum ada favorit tersimpan',
    favorites_empty_desc: 'Ketuk ikon hati pada halaman game untuk menyimpannya di sini.',

    back_to_catalog: 'Kembali ke Katalog',
    add_favorite_toast: 'Ditambahkan ke Favorit!',
    remove_favorite_toast: 'Dihapus dari Favorit',
    features_title: 'Fitur & Keunggulan',
    how_to_install: 'Cara Pasang di Android',
    copy_btn: 'Salin',
    copied_toast: 'Instruksi berhasil disalin ke clipboard!',
    manual_copy_toast: 'Silakan pilih dan salin teks secara manual.',
    watch_gameplay: 'Tonton Gameplay / Tutorial',
    description_title: 'Deskripsi',
    protected_downloads: 'Unduhan Terlindungi',
    dl_note: 'Unduhan terbuka setelah menonton iklan singkat Monetag.',
    touch_to_unlock: 'Ketuk untuk membuka',
    secure_server: 'Server Aman',

    modal_dl_title: 'Unduhan Terlindungi',
    modal_dl_desc: 'Untuk membuka tautan langsung dan mendukung server HilGaming, tonton iklan singkat sampai selesai.',
    modal_dl_start: 'Tonton Iklan & Unduh',
    modal_dl_cancel: 'Batal',
    modal_dl_connecting: 'Menghubungkan ke Iklan...',
    modal_dl_watching: 'Menampilkan iklan aman. Harap tonton hingga selesai...',
    modal_dl_success: 'Iklan terverifikasi! Memulai unduhan...',
    modal_dl_success_btn: 'Unduhan Terbuka!',
    modal_dl_failed: 'Iklan belum selesai. Harap tonton sampai selesai untuk membuka unduhan.',
    modal_dl_adblock: 'AdBlock terdeteksi. Nonaktifkan pemblokir iklan untuk mengunduh gratis.',
    modal_dl_retry: 'Coba Lagi',

    about_app_title: 'HilGaming Mini App',
    about_app_desc: 'Pusat mod sepak bola Android offline terlengkap: eFootball PES, EA Sports FC / FIFA, DFL, dan FTS. Update harian dengan pemain, jersey, stadion, dan mode karir terbaru.',
    official_channel: 'Saluran Resmi',
    vip_support_title: 'Dukung HilGaming',
    vip_support_desc: 'Menyukai katalog gratis kami? Tonton iklan Popup untuk mendukung kreator dan membuka lencana VIP Supporter!',
    vip_support_btn: 'Dukung dengan Iklan Popup',
    vip_active_badge: 'Lencana VIP Aktif',
    vip_congrats_title: 'Terima Kasih atas Dukungan Anda!',
    vip_congrats_desc: 'Anda berhasil menonton iklan Popup. Lencana VIP Supporter telah aktif di perangkat ini!',
    continue_browsing: 'Lanjut Menjelajah',

    guide_title: 'Panduan Dasar Pemasangan Android',
    guide_step_1: 'Unduh file yang dibutuhkan: APK, OBB, dan DATA menggunakan tautan aman kami.',
    guide_step_2: 'Instal ZArchiver: Aplikasi pengelola file di Google Play untuk mengekstrak .zip dan .rar.',
    guide_step_3: 'Pindahkan file game: Ekstrak folder OBB ke Android/obb/ dan DATA ke Android/data/.',
    guide_step_4: 'Instal dan Buka APK: Berikan izin penyimpanan yang diminta dan mainkan sepak bola offline!',
    transparency_title: 'Transparansi Iklan Monetag',
    transparency_desc: 'Agar semua mod dan server tetap 100% gratis di Telegram, HilGaming menggunakan iklan Monetag resmi yang aman.',

    lang_modal_title: 'Pilih Bahasa',
    lang_modal_subtitle: 'Pilih bahasa pilihan Anda untuk aplikasi HilGaming',
    lang_modal_confirm: 'Konfirmasi & Lanjutkan',
    lang_changed_toast: 'Bahasa diubah ke Bahasa Indonesia',

    catalog_refreshing: 'Memperbarui katalog mod...',
    catalog_refreshed: 'Katalog berhasil diperbarui!',
    catalog_error: 'Gagal menyinkronkan dengan server. Menggunakan cache lokal.',
    ad_in_progress: 'Iklan lain sedang berlangsung. Harap tunggu sebentar.'
  },

  pt: {
    nav_home: 'Início',
    nav_games: 'Jogos',
    nav_categories: 'Categorias',
    nav_favorites: 'Favoritos',
    nav_about: 'Sobre',

    refresh_tooltip: 'Atualizar Catálogo',
    language_select_title: 'Selecionar Idioma',
    offline_banner: 'Modo Offline — Exibindo catálogo salvo em cache local.',

    search_placeholder: 'Pesquisar por título, ID ou jogo (ex: PES, FIFA, DFL)...',
    search_clear: 'Limpar pesquisa',
    sort_recent: 'Mais Recentes',
    sort_az: 'Ordem A-Z',
    sort_za: 'Ordem Z-A',
    sort_downloads: 'Mais Arquivos',

    cat_all: 'Todos os Mods',
    cat_pes: 'PES & eFootball',
    cat_fifa: 'EA FC & FIFA',
    cat_dfl: 'DFL (RoberFL)',
    cat_fts: 'FTS Mobile',
    cat_other: 'Outros Mods',
    cat_count_suffix: 'mods disponíveis',
    categories_title: 'Categorias de Futebol',

    spotlight_kicker: 'Destaque da Semana',
    available_files: 'Ficheiros Disponíveis',
    video_included: 'Vídeo Incluso',
    quick_categories: 'Categorias Rápidas',
    view_all: 'Ver Todas',
    recent_releases: 'Lançamentos Recentes',
    all_mods_title: 'Todos os Mods',
    files_links_count: 'links',

    no_results_title: 'Nenhum mod encontrado',
    no_results_desc: 'Tente ajustar o termo de pesquisa ou selecionar outra categoria.',
    favorites_empty_title: 'Nenhum favorito salvo',
    favorites_empty_desc: 'Ao abrir um jogo, toque no ícone de coração para salvá-lo aqui no seu dispositivo.',

    back_to_catalog: 'Voltar ao Catálogo',
    add_favorite_toast: 'Adicionado aos Favoritos!',
    remove_favorite_toast: 'Removido dos Favoritos',
    features_title: 'Recursos & Destaques',
    how_to_install: 'Como Instalar no Android',
    copy_btn: 'Copiar',
    copied_toast: 'Instruções copiadas para a área de transferência!',
    manual_copy_toast: 'Selecione e copie manualmente o texto.',
    watch_gameplay: 'Assistir Gameplay / Tutorial',
    description_title: 'Descrição',
    protected_downloads: 'Downloads Protegidos',
    dl_note: 'Os downloads são liberados após assistir a um anúncio rápido via Monetag.',
    touch_to_unlock: 'Toque para liberar',
    secure_server: 'Servidor Seguro',

    modal_dl_title: 'Download Protegido',
    modal_dl_desc: 'Para liberar o link direto e apoiar os servidores do HilGaming, assista ao anúncio rápido até a conclusão.',
    modal_dl_start: 'Assistir Anúncio & Descarregar',
    modal_dl_cancel: 'Cancelar',
    modal_dl_connecting: 'Conectando ao Anúncio...',
    modal_dl_watching: 'Exibindo anúncio seguro. Por favor, assista até o final...',
    modal_dl_success: 'Anúncio concluído com sucesso! Abrindo download...',
    modal_dl_success_btn: 'Download Liberado!',
    modal_dl_failed: 'O anúncio não foi concluído. Assista até o final para validar e desbloquear o download.',
    modal_dl_adblock: 'Bloqueador de anúncios detectado. Desative o AdBlock para poder baixar gratuitamente.',
    modal_dl_retry: 'Tentar Novamente',

    about_app_title: 'HilGaming Mini App',
    about_app_desc: 'O seu hub oficial de mods de futebol Android offline: eFootball PES, EA Sports FC / FIFA, DFL e FTS. Atualizações diárias com novos elencos, kits, estádios e modos carreira.',
    official_channel: 'Canal Oficial',
    vip_support_title: 'Apoiar o HilGaming',
    vip_support_desc: 'Gosta do nosso catálogo gratuito? Assista a um anúncio em formato Popup para apoiar os criadores e desbloquear o emblema de Apoiador VIP no app!',
    vip_support_btn: 'Apoiar com Anúncio Popup',
    vip_active_badge: 'Emblema VIP Ativo',
    vip_congrats_title: 'Obrigado pelo seu Apoio!',
    vip_congrats_desc: 'Você assistiu com sucesso ao anúncio Popup de apoio. Seu emblema de Apoiador VIP foi ativado neste dispositivo!',
    continue_browsing: 'Continuar Navegando',

    guide_title: 'Guia Básico de Instalação no Android',
    guide_step_1: 'Baixe os arquivos necessários: APK, OBB e DATA (se houver) usando nossos links seguros protegidos.',
    guide_step_2: 'Instale o ZArchiver: Gerenciador recomendado na Google Play para extrair arquivos .zip e .rar.',
    guide_step_3: 'Mova os arquivos de dados: Extraia a pasta OBB para Android/obb/ e a pasta DATA para Android/data/.',
    guide_step_4: 'Instale e Abra o APK: Conceda as permissões de armazenamento necessárias e aproveite o jogo offline!',
    transparency_title: 'Transparência de Anúncios Monetag',
    transparency_desc: 'Para manter todos os mods, servidores e links 100% gratuitos para os usuários do Telegram, o HilGaming utiliza anúncios Monetag certificados.',

    lang_modal_title: 'Selecionar Idioma',
    lang_modal_subtitle: 'Escolha o idioma preferido para o HilGaming Mini App',
    lang_modal_confirm: 'Confirmar e Continuar',
    lang_changed_toast: 'Idioma alterado para Português',

    catalog_refreshing: 'Atualizando catálogo de mods...',
    catalog_refreshed: 'Catálogo atualizado com sucesso!',
    catalog_error: 'Não foi possível sincronizar com o servidor.',
    ad_in_progress: 'Outro anúncio já está sendo exibido. Por favor, aguarde.'
  }
};

export const HilI18n = {
  currentLang: 'en', // Primary default language is English

  init() {
    // 1. Check if user already has a saved language
    const saved = HilStorage.getLanguage();
    if (saved && TRANSLATIONS[saved]) {
      this.currentLang = saved;
    } else {
      // Primary default is English as requested
      this.currentLang = 'en';
    }

    this.applyLanguage(this.currentLang, false);
  },

  /**
   * Translates a given key with optional fallback
   * @param {string} key
   * @param {string} fallback
   * @returns {string}
   */
  t(key, fallback = '') {
    const langDict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  },

  /**
   * Sets new language, updates HTML dir (RTL/LTR), and saves to storage
   * @param {string} langCode
   * @param {boolean} persist
   */
  setLanguage(langCode, persist = true) {
    if (!TRANSLATIONS[langCode]) {
      langCode = 'en';
    }
    this.currentLang = langCode;

    if (persist) {
      HilStorage.setLanguage(langCode);
    }

    this.applyLanguage(langCode);
  },

  /**
   * Applies language attributes to document and triggers DOM text refresh
   */
  applyLanguage(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = langCode;
    
    // Set RTL for Arabic, LTR for others
    if (langObj.isRTL) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl-layout');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl-layout');
    }

    // Refresh all elements with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key, el.textContent);
      }
    });

    // Refresh all inputs with [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', this.t(key, el.getAttribute('placeholder') || ''));
      }
    });

    // Refresh all elements with [data-i18n-title]
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', this.t(key, el.getAttribute('title') || ''));
      }
    });

    // Dispatch custom event for dynamic components to re-render
    window.dispatchEvent(new CustomEvent('hilgaming:languageChanged', {
      detail: { lang: langCode, isRTL: langObj.isRTL }
    }));
  },

  /**
   * Checks if current language is RTL
   */
  isRtl() {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === this.currentLang);
    return !!langObj?.isRTL;
  },

  /**
   * Returns current language object
   */
  getCurrentLanguage() {
    return SUPPORTED_LANGUAGES.find(l => l.code === this.currentLang) || SUPPORTED_LANGUAGES[0];
  }
};
