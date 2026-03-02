const I18N_KEY = 'tunkul_lang_v1';

function applyPrivacyLanguage(lang) {
  const safeLang = ['es', 'en', 'fr'].includes(lang) ? lang : 'es';

  document.documentElement.lang = safeLang;
  document.querySelectorAll('.legal-content').forEach((section) => {
    section.classList.add('hidden');
  });

  const active = document.querySelector(`.legal-content.lang-${safeLang}`);
  active?.classList.remove('hidden');

  const switcher = document.getElementById('legalLangSwitcher');
  if (switcher) switcher.value = safeLang;

  const home = document.getElementById('legal-home');
  const book = document.getElementById('legal-book');

  if (safeLang === 'en') {
    document.title = 'Privacy Notice | Casa Tunkul';
    if (home) home.textContent = 'Home';
    if (book) book.textContent = 'Book';
  } else if (safeLang === 'fr') {
    document.title = 'Avis de confidentialité | Casa Tunkul';
    if (home) home.textContent = 'Accueil';
    if (book) book.textContent = 'Réserver';
  } else {
    document.title = 'Aviso de Privacidad | Casa Tunkul';
    if (home) home.textContent = 'Inicio';
    if (book) book.textContent = 'Reservar';
  }

  localStorage.setItem(I18N_KEY, safeLang);
}

const initial = localStorage.getItem(I18N_KEY) || 'es';
applyPrivacyLanguage(initial);

document.getElementById('legalLangSwitcher')?.addEventListener('change', (event) => {
  applyPrivacyLanguage(event.target.value);
});
