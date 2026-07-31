const dataState = {
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certificates: []
};

async function carregarJSON(caminho) {
  try {
    const response = await fetch(caminho);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${caminho}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function carregarProjetos() {
  const dados = await carregarJSON('./data/projects.json');
  if (dados) {
    dataState.projects = dados;
  }
  return dataState.projects;
}

async function carregarCompetencias() {
  const dados = await carregarJSON('./data/skills.json');
  if (dados) {
    dataState.skills = dados;
  }
  return dataState.skills;
}

async function carregarExperiencia() {
  const dados = await carregarJSON('./data/experience.json');
  if (dados) {
    dataState.experience = dados;
  }
  return dataState.experience;
}

async function carregarEducacao() {
  const dados = await carregarJSON('./data/education.json');
  if (dados) {
    dataState.education = dados;
  }
  return dataState.education;
}

async function carregarCertificados() {
  const dados = await carregarJSON('./data/certificates.json');
  if (dados) {
    dataState.certificates = dados;
  }
  return dataState.certificates;
}

async function carregarTodosDados() {
  await Promise.all([
    carregarProjetos(),
    carregarCompetencias(),
    carregarExperiencia(),
    carregarEducacao(),
    carregarCertificados()
  ]);
  return dataState;
}