const appState = {
  initialized: false,
  dataLoaded: false
};

function tratarErroAplicacao(erro) {
  renderizarErrorState('bp-projects-grid', 'contact.form.error_msg');
  renderizarErrorState('bp-skills-grid', 'contact.form.error_msg');
  renderizarErrorState('bp-experience-container', 'contact.form.error_msg');
  renderizarErrorState('bp-certificates-grid', 'contact.form.error_msg');
}

function atualizarInterface() {
  if (typeof dataState === 'undefined') return;

  renderizarProjetos(dataState.projects, 'bp-projects-grid');
  renderizarCompetencias(dataState.skills, 'bp-skills-grid');
  renderizarExperiencia(dataState.experience, 'bp-experience-container');
  renderizarCertificados(dataState.certificates, 'bp-certificates-grid');
}

function configurarSeletoresIdioma() {
  const langBtns = document.querySelectorAll('.bp-lang-btn, [data-lang]');
  langBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        await alternarIdioma(lang);
        atualizarInterface();
      }
    });
  });
}

function configurarEventos() {
  configurarSeletoresIdioma();
}

async function inicializarAplicacao() {
  if (appState.initialized) return;

  try {
    inicializarUI();

    await inicializarI18n();
    await carregarTodosDados();

    appState.dataLoaded = true;
    inicializarRouter();
    configurarEventos();

    appState.initialized = true;
  } catch (erro) {
    tratarErroAplicacao(erro);
  }
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);