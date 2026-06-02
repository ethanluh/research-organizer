import { useState } from 'react'

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function persist(key, setter, value) {
  setter(value)
  localStorage.setItem(key, JSON.stringify(value))
}

const SEED_PROJECTS = [
  { id: 'p1', name: 'Public Sphere Paper', color: '#6b8afd' },
  { id: 'p2', name: 'Media Theory Seminar', color: '#22c55e' },
]

const SEED_SOURCES = [
  { id: 's1', projectId: 'p1', title: 'The Structural Transformation of the Public Sphere', authors: 'Habermas, J.', year: 1989, type: 'book', publisher: 'MIT Press', doi: '', abstract: 'An inquiry into a category of bourgeois society, tracing the historical genesis and transformation of the public sphere from the 18th century salons to the mass media of the 20th century.', tags: ['public sphere', 'modernity', 'democracy'] },
  { id: 's2', projectId: 'p1', title: 'Filter Bubble: What the Internet Is Hiding from You', authors: 'Pariser, E.', year: 2011, type: 'book', publisher: 'Penguin Press', doi: '', abstract: 'Pariser argues that personalization algorithms create isolated information environments that undermine shared civic reality.', tags: ['algorithms', 'democracy', 'media'] },
  { id: 's3', projectId: 'p2', title: 'Imagined Communities: Reflections on the Origin and Spread of Nationalism', authors: 'Anderson, B.', year: 1983, type: 'book', publisher: 'Verso', doi: '', abstract: 'Anderson argues that nations are socially constructed communities, imagined by the people who perceive themselves as part of that group.', tags: ['nationalism', 'print capitalism', 'modernity'] },
  { id: 's4', projectId: 'p1', title: 'Social Media and the Transformation of Public Space', authors: 'Papacharissi, Z.', year: 2014, type: 'article', journal: 'Social Media + Society', doi: '10.1177/2056305114526512', abstract: 'Examines how social media platforms produce a hybrid public/private space that challenges classical models of the public sphere.', tags: ['public sphere', 'social media', 'algorithms'] },
]

const SEED_QUOTES = [
  { id: 'q1', sourceId: 's1', text: 'The bourgeois public sphere may be conceived above all as the sphere of private people come together as a public.', page: '27', annotation: "Key definition — contrast with Arendt's conception of the public/private split. Good for Ch. 2 framing." },
  { id: 'q2', sourceId: 's1', text: 'Public opinion can by definition only come into existence when a reasoning public is presupposed.', page: '89', annotation: 'Links to my argument about algorithmic feeds collapsing deliberative space.' },
  { id: 'q3', sourceId: 's2', text: "A world constructed from the familiar is a world in which there's nothing to learn.", page: '15', annotation: 'Good epigraph candidate. Simple but captures the epistemic stakes.' },
  { id: 'q4', sourceId: 's4', text: 'Networked publics are simultaneously (1) the space constructed through networked technologies and (2) the imagined collective that emerges as a result.', page: '4', annotation: 'Better than Habermas for digital contexts — less normative baggage.' },
]

export const PROJECT_COLORS = [
  '#6b8afd', '#22c55e', '#f59e0b', '#ef4444',
  '#ec4899', '#14b8a6', '#8b5cf6', '#f97316',
]

export function useStore() {
  const [projects, setProjects] = useState(() => load('mg_projects', SEED_PROJECTS))
  const [sources, setSources]   = useState(() => load('mg_sources', SEED_SOURCES))
  const [quotes, setQuotes]     = useState(() => load('mg_quotes', SEED_QUOTES))

  function addProject(name, color) {
    const next = [...projects, { id: crypto.randomUUID(), name, color }]
    persist('mg_projects', setProjects, next)
  }

  function deleteProject(id) {
    persist('mg_projects', setProjects, projects.filter(p => p.id !== id))
    persist('mg_sources', setSources, sources.map(s => s.projectId === id ? { ...s, projectId: '' } : s))
  }

  function addSource(data) {
    const s = { id: crypto.randomUUID(), ...data }
    persist('mg_sources', setSources, [...sources, s])
    return s.id
  }

  function updateSource(id, patch) {
    persist('mg_sources', setSources, sources.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  function deleteSource(id) {
    persist('mg_sources', setSources, sources.filter(s => s.id !== id))
    persist('mg_quotes', setQuotes, quotes.filter(q => q.sourceId !== id))
  }

  function addQuote(data) {
    persist('mg_quotes', setQuotes, [...quotes, { id: crypto.randomUUID(), ...data }])
  }

  function deleteQuote(id) {
    persist('mg_quotes', setQuotes, quotes.filter(q => q.id !== id))
  }

  return {
    projects, sources, quotes,
    addProject, deleteProject,
    addSource, updateSource, deleteSource,
    addQuote, deleteQuote,
  }
}
