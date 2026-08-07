const I18N_DEFAULT_LANG = 'en';
const I18N_STORAGE_KEY = 'bp_language';

const i18nState = {
  currentLang: I18N_DEFAULT_LANG,
  translations: {}
};

function obterIdiomaAtual() {
  return localStorage.getItem(I18N_STORAGE_KEY) || I18N_DEFAULT_LANG;
}

async function carregarIdioma(lang) {
  try {
    const response = await fetch(`./data/i18n/${lang}.json?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar idioma: ${response.statusText}`);
    }
    const translations = await response.json();
    i18nState.currentLang = lang;
    i18nState.translations = translations;
    localStorage.setItem(I18N_STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    aplicarTraducoes();
    return true;
  } catch (error) {
    if (lang !== I18N_DEFAULT_LANG) {
      return carregarIdioma(I18N_DEFAULT_LANG);
    }
    return false;
  }
}

function traduzir(chave) {
  if (!chave) return '';
  const chaves = chave.split('.');
  let resultado = i18nState.translations;
  for (const k of chaves) {
    if (resultado && Object.prototype.hasOwnProperty.call(resultado, k)) {
      resultado = resultado[k];
    } else {
      return chave;
    }
  }
  return typeof resultado === 'string' ? resultado : chave;
}

function aplicarTraducoes() {
  document.documentElement.lang = i18nState.currentLang;

  const tituloPagina = traduzir('meta.title');
  if (tituloPagina && tituloPagina !== 'meta.title') {
    document.title = tituloPagina;
  }

  const descricaoPagina = traduzir('meta.description');
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && descricaoPagina && descricaoPagina !== 'meta.description') {
    metaDescription.setAttribute('content', descricaoPagina);
  }

  const cvBtn = document.getElementById('bp-cv-download-btn');
  if (cvBtn) {
    const langCode = i18nState.currentLang === 'pt' ? 'PT' : 'EN';
    cvBtn.setAttribute('href', `assets/documents/${langCode}/Bruno_Pinto_${langCode}_CV.pdf`);
  }

  const elementosTexto = document.querySelectorAll('[data-i18n]');
  elementosTexto.forEach((el) => {
    const chave = el.getAttribute('data-i18n');
    if (chave) {
      el.textContent = traduzir(chave);
    }
  });

  const elementosAtributo = document.querySelectorAll('[data-i18n-attr]');
  elementosAtributo.forEach((el) => {
    const attrConfig = el.getAttribute('data-i18n-attr');
    if (attrConfig) {
      const partes = attrConfig.split(';');
      partes.forEach((par) => {
        const [attr, chave] = par.split(':').map((s) => s.trim());
        if (attr && chave) {
          el.setAttribute(attr, traduzir(chave));
        }
      });
    }
  });
}

async function alternarIdioma(lang) {
  if (lang === i18nState.currentLang && Object.keys(i18nState.translations).length > 0) {
    return;
  }
  await carregarIdioma(lang);
}

async function inicializarI18n() {
  const lang = obterIdiomaAtual();
  await carregarIdioma(lang);
}