const routes = {
  home: "pages/home.html",
  about: "pages/about.html",
  projects: "pages/projects.html",
  skills: "pages/skills.html",
  experience: "pages/experience.html",
  education: "pages/education.html",
  certifications: "pages/certifications.html",
  contact: "pages/contact.html"
};

const routerState = {
  currentRoute: "home"
};

function atualizarNavLinkAtivo(routeKey) {
  const links = document.querySelectorAll("[data-route]");
  links.forEach(link => {
    const route = link.getAttribute("data-route");
    if (route === routeKey) {
      link.classList.add("bp-is-active");
    } else {
      link.classList.remove("bp-is-active");
    }
  });
}

async function carregarPagina(routeKey) {
  const container = document.getElementById("bp-page");
  if (!container) return;

  const path = routes[routeKey] || routes.home;
  atualizarNavLinkAtivo(routeKey);

  try {
    const response = await fetch(`${path}?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar página: ${response.statusText}`);
    }
    const html = await response.text();
    container.innerHTML = html;
    routerState.currentRoute = routeKey;

    if (typeof aplicarTraducoes === "function") {
      aplicarTraducoes();
    }

    if (routeKey === "projects" && typeof dataState !== "undefined" && typeof renderizarProjetos === "function") {
      renderizarProjetos(dataState.projects, "bp-projects-grid");
    } else if (routeKey === "skills" && typeof dataState !== "undefined" && typeof renderizarCompetencias === "function") {
      renderizarCompetencias(dataState.skills, "bp-skills-grid");
    } else if (routeKey === "experience" && typeof dataState !== "undefined" && typeof renderizarExperiencia === "function") {
      renderizarExperiencia(dataState.experience, "bp-experience-container");
    } else if (routeKey === "education" && typeof dataState !== "undefined" && typeof renderizarEducacao === "function") {
      renderizarEducacao(dataState.education, "bp-education-container");
    } else if (routeKey === "certifications" && typeof dataState !== "undefined" && typeof renderizarCertificados === "function") {
      renderizarCertificados(dataState.certificates, "bp-certificates-grid");
    } else if (routeKey === "contact" && typeof inicializarFormularioContacto === "function") {
      inicializarFormularioContacto("bp-contact-form");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    container.innerHTML = `<div class="bp-error-state p-5 text-center">Failed to load page content.</div>`;
  }
}

function atualizarNavLinkAtivo(routeKey) {
  const links = document.querySelectorAll("[data-route]");
  links.forEach(link => {
    const route = link.getAttribute("data-route");
    if (route === routeKey) {
      link.classList.add("bp-is-active");
    } else {
      link.classList.remove("bp-is-active");
    }
  });
}

function inicializarRouter() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-route]");
    if (target) {
      e.preventDefault();
      const route = target.getAttribute("data-route");
      if (route && routes[route]) {
        history.pushState({ route }, "", `#${route}`);
        carregarPagina(route);
        atualizarNavLinkAtivo(route);
      }
    }
  });

  window.addEventListener("popstate", (e) => {
    const route = e.state?.route || "home";
    carregarPagina(route);
    atualizarNavLinkAtivo(route);
  });

  const hash = window.location.hash.replace("#", "");
  const initialRoute = routes[hash] ? hash : "home";
  carregarPagina(initialRoute);
  atualizarNavLinkAtivo(initialRoute);
}