const COOKIE_CONSENT_KEY = 'tunkul_cookie_consent_v1';
const COOKIE_LANG_KEY = 'tunkul_lang_v1';

const COOKIE_TEXTS = {
  es: {
    title: 'Cookies y privacidad',
    body: 'Usamos cookies para medir visitas y mejorar tu experiencia. Puedes aceptar o rechazar el uso de cookies analíticas y publicitarias.',
    accept: 'Aceptar',
    reject: 'Rechazar'
  },
  en: {
    title: 'Cookies and privacy',
    body: 'We use cookies to measure visits and improve your experience. You can accept or reject analytics and advertising cookies.',
    accept: 'Accept',
    reject: 'Reject'
  },
  fr: {
    title: 'Cookies et confidentialité',
    body: 'Nous utilisons des cookies pour mesurer les visites et améliorer votre expérience. Vous pouvez accepter ou refuser les cookies analytiques et publicitaires.',
    accept: 'Accepter',
    reject: 'Refuser'
  }
};

function safeGetLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // no-op on restricted browsers
  }
}

function updateGoogleConsent(state) {
  if (typeof window.gtag !== 'function') return;

  const granted = state === 'accepted';
  window.gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied'
  });
}

function getCurrentLang() {
  const langFromStorage = safeGetLocalStorage(COOKIE_LANG_KEY);
  if (langFromStorage && COOKIE_TEXTS[langFromStorage]) return langFromStorage;
  const htmlLang = document.documentElement.lang;
  if (htmlLang && COOKIE_TEXTS[htmlLang]) return htmlLang;
  return 'es';
}

function applyCookieText() {
  const lang = getCurrentLang();
  const dict = COOKIE_TEXTS[lang] || COOKIE_TEXTS.es;
  const title = document.getElementById('cookieTitle');
  const body = document.getElementById('cookieText');
  const accept = document.getElementById('cookieAccept');
  const reject = document.getElementById('cookieReject');
  if (title) title.textContent = dict.title;
  if (body) body.textContent = dict.body;
  if (accept) accept.textContent = dict.accept;
  if (reject) reject.textContent = dict.reject;
}

function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');
  if (!banner || !acceptBtn || !rejectBtn) return;

  function showBanner() {
    banner.classList.add('visible');
    document.body.classList.add('cookie-modal-open');
  }

  function hideBanner() {
    banner.classList.remove('visible');
    document.body.classList.remove('cookie-modal-open');
  }

  applyCookieText();

  const saved = safeGetLocalStorage(COOKIE_CONSENT_KEY);
  const hasDecision = saved === 'accepted' || saved === 'rejected';
  if (hasDecision) {
    hideBanner();
    updateGoogleConsent(saved);
  } else {
    showBanner();
  }

  acceptBtn.addEventListener('click', () => {
    safeSetLocalStorage(COOKIE_CONSENT_KEY, 'accepted');
    updateGoogleConsent('accepted');
    hideBanner();
  });

  rejectBtn.addEventListener('click', () => {
    safeSetLocalStorage(COOKIE_CONSENT_KEY, 'rejected');
    updateGoogleConsent('rejected');
    hideBanner();
  });

  document.querySelectorAll('[data-cookie-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      showBanner();
    });
  });

  document.getElementById('langSwitcher')?.addEventListener('change', applyCookieText);
  document.getElementById('legalLangSwitcher')?.addEventListener('change', applyCookieText);
}

initCookieConsent();
