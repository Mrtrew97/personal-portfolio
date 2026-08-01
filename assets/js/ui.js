const UI_THEME_STORAGE_KEY = 'bp_theme';
const UI_DEFAULT_THEME = 'light';

const uiState = {
  theme: UI_DEFAULT_THEME,
  initialized: false
};

function escaparHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function obterTemaAtual() {
  return localStorage.getItem(UI_THEME_STORAGE_KEY) || UI_DEFAULT_THEME;
}

function definirTema(theme) {
  uiState.theme = theme;
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem(UI_THEME_STORAGE_KEY, theme);

  const themeToggle = document.getElementById('bp-theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
      } else {
        icon.className = 'bi bi-moon-stars-fill';
      }
    }
  }
}

function alternarTema() {
  const novoTema = uiState.theme === 'dark' ? 'light' : 'dark';
  definirTema(novoTema);
}

function inicializarTema() {
  const temaSalvo = obterTemaAtual();
  definirTema(temaSalvo);

  const themeToggle = document.getElementById('bp-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', alternarTema);
  }
}

function renderizarLoadingState(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const loadingText = typeof traduzir === 'function' ? traduzir('common.loading') : 'Loading...';
  container.innerHTML = `
    <div class="bp-loading-state col-12">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <p class="mb-0">${escaparHTML(loadingText)}</p>
    </div>
  `;
}

function renderizarErrorState(containerId, msgKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const errorMsg = typeof traduzir === 'function' ? traduzir(msgKey || 'contact.form.error_msg') : 'Error loading data.';
  container.innerHTML = `
    <div class="bp-error-state col-12">
      <i class="bi bi-exclamation-triangle-fill fs-3 mb-2"></i>
      <p class="mb-0">${escaparHTML(errorMsg)}</p>
    </div>
  `;
}

function renderizarEmptyState(containerId, msgKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emptyText = typeof traduzir === 'function' ? traduzir(msgKey || 'projects.coming_soon') : 'No items found.';
  container.innerHTML = `
    <div class="bp-empty-state col-12">
      <i class="bi bi-inbox fs-3 mb-2"></i>
      <p class="mb-0">${escaparHTML(emptyText)}</p>
    </div>
  `;
}

function renderizarProjetos(projetos, containerId = 'bp-projects-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!projetos || projetos.length === 0) {
    renderizarEmptyState(containerId, 'projects.coming_soon');
    return;
  }

  const lang = (typeof i18nState !== 'undefined' && i18nState.currentLang) ? i18nState.currentLang : 'en';

  const html = projetos
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(proj => {
      const title = proj.title && proj.title[lang] ? proj.title[lang] : (proj.title?.en || '');
      const desc = proj.description && proj.description[lang] ? proj.description[lang] : (proj.description?.en || '');
      const techHtml = (proj.technologies || [])
        .map(t => `<span class="bp-tech-badge">${escaparHTML(t)}</span>`)
        .join('');

      const demoBtnText = typeof traduzir === 'function' ? traduzir('projects.live_demo') : 'Live Demo';
      const repoBtnText = typeof traduzir === 'function' ? traduzir('projects.view_repository') : 'Repository';

      const demoBtn = proj.demoUrl 
        ? `<a href="${escaparHTML(proj.demoUrl)}" target="_blank" rel="noopener noreferrer" class="bp-btn-primary btn-sm"><i class="bi bi-box-arrow-up-right"></i> ${escaparHTML(demoBtnText)}</a>` 
        : '';
      const repoBtn = proj.repoUrl 
        ? `<a href="${escaparHTML(proj.repoUrl)}" target="_blank" rel="noopener noreferrer" class="bp-btn-outline btn-sm"><i class="bi bi-github"></i> ${escaparHTML(repoBtnText)}</a>` 
        : '';

      return `
        <div class="col-md-6 col-lg-4 mb-4">
          <article class="bp-project-card">
            <div class="bp-project-img-wrapper">
              <img src="${escaparHTML(proj.image || 'assets/images/projects/placeholder.webp')}" alt="${escaparHTML(title)}" class="bp-project-img" loading="lazy">
            </div>
            <div class="p-4 d-flex flex-column flex-grow-1">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="bp-category-badge">${escaparHTML(proj.category || 'Web')}</span>
              </div>
              <h3 class="bp-project-title">${escaparHTML(title)}</h3>
              <p class="bp-text-muted flex-grow-1 fs-6">${escaparHTML(desc)}</p>
              <div class="bp-project-tech-stack mb-3">
                ${techHtml}
              </div>
              <div class="d-flex gap-2 mt-auto">
                ${demoBtn}
                ${repoBtn}
              </div>
            </div>
          </article>
        </div>
      `;
    })
    .join('');

  container.innerHTML = html;
}

function renderizarCompetencias(categorias, containerId = 'bp-skills-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!categorias || categorias.length === 0) {
    renderizarEmptyState(containerId, 'projects.coming_soon');
    return;
  }

  const lang = (typeof i18nState !== 'undefined' && i18nState.currentLang) ? i18nState.currentLang : 'en';

  const html = categorias
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(cat => {
      const catTitle = typeof traduzir === 'function' ? traduzir(cat.categoryKey) : cat.category;
      const skillsHtml = (cat.skills || []).map(sk => {
        const desc = sk.description && sk.description[lang] ? sk.description[lang] : '';
        const levelKey = sk.level ? `skills.level.${sk.level}` : '';
        const levelText = levelKey && typeof traduzir === 'function' ? traduzir(levelKey) : (sk.level || '');
        const levelBadge = sk.level ? `<span class="bp-badge mt-2">${escaparHTML(levelText)}</span>` : '';
        return `
          <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="bp-skill-card h-100 d-flex flex-column align-items-center text-center">
              <i class="${escaparHTML(sk.icon)} bp-skill-icon"></i>
              <h4 class="fs-6 fw-bold mb-1">${escaparHTML(sk.name)}</h4>
              ${desc ? `<p class="bp-text-muted small mb-1">${escaparHTML(desc)}</p>` : ''}
              ${levelBadge}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="bp-skills-category col-12 mb-4">
          <h3 class="fs-5 fw-bold mb-3 bp-text-primary">${escaparHTML(catTitle)}</h3>
          <div class="row">
            ${skillsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = html;
}

function renderizarExperiencia(experiencias, containerId = 'bp-experience-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!experiencias || experiencias.length === 0) {
    renderizarEmptyState(containerId, 'projects.coming_soon');
    return;
  }

  const lang = (typeof i18nState !== 'undefined' && i18nState.currentLang) ? i18nState.currentLang : 'en';

  const html = experiencias
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(exp => {
      const role = exp.role && exp.role[lang] ? exp.role[lang] : (exp.role?.en || '');
      const desc = exp.description && exp.description[lang] ? exp.description[lang] : (exp.description?.en || '');
      const presentText = typeof traduzir === 'function' ? traduzir('experience.present') : 'Present';
      const endDateStr = exp.isCurrent ? presentText : (exp.endDate || '');
      const dateRange = `${exp.startDate || ''} - ${endDateStr}`;

      const achievementsList = (exp.achievements && exp.achievements[lang])
        ? exp.achievements[lang].map(a => `<li>${escaparHTML(a)}</li>`).join('')
        : '';

      const techStack = (exp.technologies || [])
        .map(t => {
          const translatedTech = typeof traduzir === 'function' ? traduzir(t) : t;
          return `<span class="bp-tech-badge">${escaparHTML(translatedTech)}</span>`;
        })
        .join('');

      return `
        <div class="bp-timeline-item">
          <div class="bp-timeline-dot"></div>
          <div class="bp-timeline-content">
            <div class="bp-experience-header">
              <div>
                <h3 class="fs-5 fw-bold mb-0">${escaparHTML(role)}</h3>
                <span class="bp-experience-company">${escaparHTML(exp.company)}</span>
              </div>
              <div class="bp-experience-meta">
                <span><i class="bi bi-calendar3"></i> ${escaparHTML(dateRange)}</span>
                <span><i class="bi bi-geo-alt"></i> ${escaparHTML(exp.location || '')}</span>
              </div>
            </div>
            <p class="bp-text-muted fs-6 mb-2">${escaparHTML(desc)}</p>
            ${achievementsList ? `<ul class="bp-text-muted fs-6 ps-3 mb-3">${achievementsList}</ul>` : ''}
            <div class="bp-experience-technologies">
              ${techStack}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `<div class="bp-timeline">${html}</div>`;
}

function renderizarEducacao(educacao, containerId = 'bp-education-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!educacao || educacao.length === 0) {
    renderizarEmptyState(containerId, 'projects.coming_soon');
    return;
  }

  const lang = (typeof i18nState !== 'undefined' && i18nState.currentLang) ? i18nState.currentLang : 'en';

  const html = educacao
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(edu => {
      const title = edu.title && edu.title[lang] ? edu.title[lang] : (edu.title?.en || '');
      const desc = edu.description && edu.description[lang] ? edu.description[lang] : (edu.description?.en || '');
      
      let statusText = '';
      if (edu.isCurrent) {
        statusText = typeof traduzir === 'function' ? traduzir('education.in_progress') : 'In Progress';
      } else if (edu.completed) {
        statusText = typeof traduzir === 'function' ? traduzir('education.completed') : 'Completed';
      } else {
        statusText = typeof traduzir === 'function' ? traduzir('education.not_completed') : 'Not completed';
      }

      const presentText = typeof traduzir === 'function' ? traduzir('experience.present') : 'Present';
      const endDateStr = edu.isCurrent ? presentText : (edu.endDate || '');
      const dateRange = `${edu.startDate || ''} - ${endDateStr}`;

      const skillsBadges = (edu.skills || [])
        .map(s => {
          const transKey = s.startsWith('edu.skills.') ? s.replace('edu.skills.', 'education.skills_list.') : s;
          const translatedSkill = typeof traduzir === 'function' ? traduzir(transKey) : s;
          return `<span class="bp-tech-badge">${escaparHTML(translatedSkill)}</span>`;
        })
        .join('');

      const techBadges = (edu.technologies || [])
        .map(t => {
          const translatedTech = typeof traduzir === 'function' ? traduzir(t) : t;
          return `<span class="bp-category-badge">${escaparHTML(translatedTech)}</span>`;
        })
        .join('');

      return `
        <div class="bp-timeline-item">
          <div class="bp-timeline-dot"></div>
          <div class="bp-timeline-content">
            <div class="bp-experience-header">
              <div>
                <h3 class="fs-5 fw-bold mb-0">${escaparHTML(title)}</h3>
                <span class="bp-experience-company">${escaparHTML(edu.institution)}</span>
              </div>
              <div class="bp-experience-meta">
                <span><i class="bi bi-calendar3"></i> ${escaparHTML(dateRange)}</span>
                <span><i class="bi bi-geo-alt"></i> ${escaparHTML(edu.location || '')}</span>
              </div>
            </div>
            <div class="mb-2">
              <span class="badge bg-secondary">${escaparHTML(statusText)}</span>
            </div>
            <p class="bp-text-muted fs-6 mb-3">${escaparHTML(desc)}</p>
            <div class="d-flex flex-wrap gap-1 mb-2">
              ${skillsBadges}
            </div>
            <div class="bp-experience-technologies">
              ${techBadges}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `<div class="bp-timeline">${html}</div>`;
}

function renderizarCertificados(certificados, containerId = 'bp-certificates-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!certificados || certificados.length === 0) {
    renderizarEmptyState(containerId, 'projects.coming_soon');
    return;
  }

  const lang = (typeof i18nState !== 'undefined' && i18nState.currentLang) ? i18nState.currentLang : 'en';

  const html = certificados
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(cert => {
      const title = cert.title && cert.title[lang] ? cert.title[lang] : (cert.title?.en || '');
      const desc = cert.description && cert.description[lang] ? cert.description[lang] : (cert.description?.en || '');
      const viewText = typeof traduzir === 'function' ? traduzir('certifications.view_certificate') : 'View Certificate';

      const certLink = cert.credentialUrl 
        ? `<a href="${escaparHTML(cert.credentialUrl)}" target="_blank" rel="noopener noreferrer" class="bp-btn-outline btn-sm mt-auto"><i class="bi bi-award"></i> ${escaparHTML(viewText)}</a>`
        : '';

      return `
        <div class="col-md-6 col-lg-4 mb-4">
          <article class="bp-certificate-card h-100 d-flex flex-column p-4">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="bp-category-badge">${escaparHTML(typeof traduzir === 'function' ? traduzir(cert.category) : cert.category)}</span>
              <span class="bp-certificate-meta mb-0"><i class="bi bi-calendar-check"></i> ${escaparHTML(cert.issueDate || '')}</span>
            </div>
            <h3 class="fs-5 fw-bold mb-1">${escaparHTML(title)}</h3>
            <p class="bp-text-primary small fw-semibold mb-2">${escaparHTML(cert.issuer || '')}</p>
            ${desc ? `<p class="bp-text-muted small flex-grow-1 mb-3">${escaparHTML(desc)}</p>` : ''}
            ${certLink}
          </article>
        </div>
      `;
    })
    .join('');

  container.innerHTML = html;
}

function inicializarScrollTop() {
  const btnScrollTop = document.getElementById('bp-scroll-top');
  if (!btnScrollTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnScrollTop.classList.add('bp-is-active');
    } else {
      btnScrollTop.classList.remove('bp-is-active');
    }
  });

  btnScrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function inicializarFormularioContacto(formId = 'bp-contact-form') {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const statusMsgContainer = document.getElementById('bp-form-status');

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    const sendingText = typeof traduzir === 'function' ? traduzir('contact.form.sending_btn') : 'Sending...';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> ${escaparHTML(sendingText)}`;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        if (statusMsgContainer) {
          const successText = typeof traduzir === 'function' ? traduzir('contact.form.success_msg') : 'Message sent successfully!';
          statusMsgContainer.className = 'alert alert-success mt-3';
          statusMsgContainer.textContent = successText;
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      if (statusMsgContainer) {
        const errorText = typeof traduzir === 'function' ? traduzir('contact.form.error_msg') : 'An error occurred. Please try again.';
        statusMsgContainer.className = 'alert alert-danger mt-3';
        statusMsgContainer.textContent = errorText;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

function inicializarAnoAtual() {
  const yearEl = document.getElementById('bp-current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function atualizarAnoAtual() {
  const yearEl = document.getElementById('bp-current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function inicializarUI() {
  if (uiState.initialized) return;
  inicializarTema();
  inicializarScrollTop();
  inicializarFormularioContacto();
  atualizarAnoAtual();
  uiState.initialized = true;
}