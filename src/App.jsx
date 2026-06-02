import { useState } from 'react'
import './App.css'

const SOURCES = [
  {
    id: 1,
    title: 'The Structural Transformation of the Public Sphere',
    authors: 'Habermas, J.',
    year: 1989,
    type: 'book',
    publisher: 'MIT Press',
    tags: ['public sphere', 'modernity', 'democracy'],
    abstract: 'An inquiry into a category of bourgeois society, tracing the historical genesis and transformation of the public sphere from the 18th century salons to the mass media of the 20th century.',
    quotes: [
      {
        id: 101,
        text: 'The bourgeois public sphere may be conceived above all as the sphere of private people come together as a public.',
        page: '27',
        annotation: 'Key definition — contrast with Arendt\'s conception of the public/private split. Good for Ch. 2 framing.',
      },
      {
        id: 102,
        text: 'Public opinion can by definition only come into existence when a reasoning public is presupposed.',
        page: '89',
        annotation: 'Links to my argument about algorithmic feeds collapsing deliberative space.',
      },
    ],
  },
  {
    id: 2,
    title: 'Filter Bubble: What the Internet Is Hiding from You',
    authors: 'Pariser, E.',
    year: 2011,
    type: 'book',
    publisher: 'Penguin Press',
    tags: ['algorithms', 'democracy', 'media'],
    abstract: 'Pariser argues that the personalization algorithms used by platforms like Google and Facebook create isolated information environments that undermine shared civic reality.',
    quotes: [
      {
        id: 201,
        text: 'A world constructed from the familiar is a world in which there\'s nothing to learn.',
        page: '15',
        annotation: 'Good epigraph candidate. Simple but captures the epistemic stakes.',
      },
    ],
  },
  {
    id: 3,
    title: 'Imagined Communities: Reflections on the Origin and Spread of Nationalism',
    authors: 'Anderson, B.',
    year: 1983,
    type: 'book',
    publisher: 'Verso',
    tags: ['nationalism', 'print capitalism', 'modernity'],
    abstract: 'Anderson argues that nations are socially constructed communities, imagined by the people who perceive themselves as part of that group.',
    quotes: [],
  },
  {
    id: 4,
    title: 'Social Media and the Transformation of Public Space',
    authors: 'Papacharissi, Z.',
    year: 2014,
    type: 'article',
    journal: 'Social Media + Society',
    doi: '10.1177/2056305114526512',
    tags: ['public sphere', 'social media', 'algorithms'],
    abstract: 'Examines how social media platforms produce a hybrid public/private space that challenges classical models of the public sphere.',
    quotes: [
      {
        id: 401,
        text: 'Networked publics are simultaneously (1) the space constructed through networked technologies and (2) the imagined collective that emerges as a result.',
        page: '4',
        annotation: 'Better than Habermas for digital contexts — less normative baggage.',
      },
    ],
  },
]

const TYPE_LABEL = { book: 'Book', article: 'Article', thesis: 'Thesis', website: 'Web' }
const TYPE_COLOR = { book: 'var(--tag-blue)', article: 'var(--tag-green)', thesis: 'var(--tag-purple)', website: 'var(--tag-orange)' }

export default function App() {
  const [selectedId, setSelectedId] = useState(1)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [expandedQuote, setExpandedQuote] = useState(null)

  const allTags = [...new Set(SOURCES.flatMap(s => s.tags))].sort()

  const filtered = SOURCES.filter(s => {
    const matchesSearch = !search || [s.title, s.authors, ...s.tags].some(f =>
      f.toLowerCase().includes(search.toLowerCase())
    )
    const matchesTag = !activeTag || s.tags.includes(activeTag)
    return matchesSearch && matchesTag
  })

  const source = SOURCES.find(s => s.id === selectedId)

  return (
    <div className="app">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="app-name">Marginalia</span>
          <button className="icon-btn" title="New source">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <line x1="8" y1="3" x2="8" y2="13" /><line x1="3" y1="8" x2="13" y2="8" />
            </svg>
          </button>
        </div>

        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="4" /><line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          <input
            className="search"
            placeholder="Search sources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="tag-filter">
          <button
            className={`tag-pill ${!activeTag ? 'active' : ''}`}
            onClick={() => setActiveTag(null)}
          >All</button>
          {allTags.map(t => (
            <button
              key={t}
              className={`tag-pill ${activeTag === t ? 'active' : ''}`}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
            >{t}</button>
          ))}
        </div>

        <nav className="source-list">
          {filtered.map(s => (
            <button
              key={s.id}
              className={`source-item ${s.id === selectedId ? 'selected' : ''}`}
              onClick={() => setSelectedId(s.id)}
            >
              <span className="source-type-badge" style={{ background: TYPE_COLOR[s.type] }}>
                {TYPE_LABEL[s.type]}
              </span>
              <span className="source-item-title">{s.title}</span>
              <span className="source-item-meta">{s.authors} · {s.year}</span>
              {s.quotes.length > 0 && (
                <span className="quote-count">{s.quotes.length} quote{s.quotes.length !== 1 ? 's' : ''}</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="empty-state">No sources match.</p>
          )}
        </nav>

        <div className="sidebar-footer">
          <span>{SOURCES.length} sources · {SOURCES.reduce((n, s) => n + s.quotes.length, 0)} quotes</span>
        </div>
      </aside>

      {/* ── Main ── */}
      {source ? (
        <main className="main">
          <div className="source-header">
            <div className="source-header-top">
              <span className="source-type-badge large" style={{ background: TYPE_COLOR[source.type] }}>
                {TYPE_LABEL[source.type]}
              </span>
              <div className="source-actions">
                <button className="action-btn">Export BibTeX</button>
                <button className="action-btn">Summarize</button>
                <button className="action-btn icon-only" title="Edit">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" />
                  </svg>
                </button>
              </div>
            </div>
            <h1 className="source-title">{source.title}</h1>
            <p className="source-byline">
              {source.authors} · {source.year}
              {source.publisher && ` · ${source.publisher}`}
              {source.journal && ` · ${source.journal}`}
              {source.doi && <> · <a className="doi-link" href="#">{source.doi}</a></>}
            </p>
            <div className="source-tags">
              {source.tags.map(t => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
              <button className="tag-chip add-tag">+ tag</button>
            </div>
          </div>

          <section className="abstract-section">
            <h2 className="section-label">Abstract</h2>
            <p className="abstract-text">{source.abstract}</p>
          </section>

          <section className="quotes-section">
            <div className="section-row">
              <h2 className="section-label">Quotes & Annotations</h2>
              <button className="action-btn small">+ Add quote</button>
            </div>

            {source.quotes.length === 0 && (
              <div className="empty-quotes">
                <p>No quotes yet. Highlight a passage and add it here.</p>
              </div>
            )}

            {source.quotes.map(q => (
              <div
                key={q.id}
                className={`quote-card ${expandedQuote === q.id ? 'expanded' : ''}`}
                onClick={() => setExpandedQuote(expandedQuote === q.id ? null : q.id)}
              >
                <div className="quote-mark">"</div>
                <div className="quote-body">
                  <blockquote className="quote-text">{q.text}</blockquote>
                  <span className="quote-page">p. {q.page}</span>
                  {q.annotation && (
                    <div className="annotation">
                      <svg className="annotation-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 2h12v9H9l-3 3v-3H2z" />
                      </svg>
                      <p className="annotation-text">{q.annotation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </main>
      ) : (
        <main className="main empty-main">
          <p>Select a source to view details.</p>
        </main>
      )}
    </div>
  )
}
