import { useState } from 'react'
import { TrashIcon, EditIcon } from '../icons'
import QuoteCard from './QuoteCard'
import AddQuoteForm from './AddQuoteForm'

const TYPE_LABEL = { book: 'Book', article: 'Article', thesis: 'Thesis', website: 'Web' }
const TYPE_COLOR = { book: '#2563eb', article: '#16a34a', thesis: '#7c3aed', website: '#c2410c' }

// Fix #7 + #8: inline edit form for source metadata + project reassignment
function EditForm({ source, projects, onSave, onCancel }) {
  const [form, setForm] = useState({
    title:     source.title,
    authors:   source.authors   || '',
    year:      source.year      ? String(source.year) : '',
    type:      source.type,
    publisher: source.publisher || '',
    journal:   source.journal   || '',
    doi:       source.doi       || '',
    abstract:  source.abstract  || '',
    projectId: source.projectId || '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, year: form.year ? parseInt(form.year) : null })
  }

  return (
    <form className="edit-source-form" onSubmit={submit}>
      <div className="form-field">
        <label className="form-label">Title *</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required autoFocus />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Author(s)</label>
          <input className="form-input" value={form.authors} onChange={e => set('authors', e.target.value)} />
        </div>
        <div className="form-field narrow">
          <label className="form-label">Year</label>
          <input className="form-input" type="number" value={form.year} onChange={e => set('year', e.target.value)} />
        </div>
        <div className="form-field narrow">
          <label className="form-label">Type</label>
          <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="book">Book</option>
            <option value="article">Article</option>
            <option value="thesis">Thesis</option>
            <option value="website">Website</option>
          </select>
        </div>
      </div>
      {(form.type === 'book' || form.type === 'thesis') && (
        <div className="form-field">
          <label className="form-label">Publisher</label>
          <input className="form-input" value={form.publisher} onChange={e => set('publisher', e.target.value)} />
        </div>
      )}
      {form.type === 'article' && (
        <div className="form-field">
          <label className="form-label">Journal</label>
          <input className="form-input" value={form.journal} onChange={e => set('journal', e.target.value)} />
        </div>
      )}
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">DOI / URL</label>
          <input className="form-input" value={form.doi} onChange={e => set('doi', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Project</label>
          <select className="form-input" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
            <option value="">— None —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Abstract</label>
        <textarea className="form-input" rows={3} value={form.abstract} onChange={e => set('abstract', e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="button" className="action-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="action-btn primary" disabled={!form.title.trim()}>Save changes</button>
      </div>
    </form>
  )
}

export default function SourceDetail({ source, quotes, project, projects, onDelete, onAddQuote, onDeleteQuote, onUpdateSource }) {
  const [addingQuote, setAddingQuote] = useState(false)
  const [editingTag, setEditingTag]   = useState(false)
  const [newTag, setNewTag]           = useState('')
  const [editing, setEditing]         = useState(false)

  function saveQuote(data) {
    onAddQuote({ ...data, sourceId: source.id })
    setAddingQuote(false)
  }

  function addTag(e) {
    e.preventDefault()
    const tag = newTag.trim().toLowerCase()
    if (tag && !source.tags.includes(tag)) {
      onUpdateSource(source.id, { tags: [...source.tags, tag] })
    }
    setNewTag('')
    setEditingTag(false)
  }

  function removeTag(tag) {
    onUpdateSource(source.id, { tags: source.tags.filter(t => t !== tag) })
  }

  function saveEdit(patch) {
    onUpdateSource(source.id, patch)
    setEditing(false)
  }

  // Fix #5: confirm before delete
  function handleDelete() {
    onDelete(source.id)
  }

  return (
    <main className="main">
      {editing ? (
        <EditForm
          source={source}
          projects={projects}
          onSave={saveEdit}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="source-header">
            <div className="source-header-top">
              <div className="source-header-left">
                <span className="source-type-badge large" style={{ background: TYPE_COLOR[source.type] }}>
                  {TYPE_LABEL[source.type]}
                </span>
                {project && (
                  <span className="project-badge" style={{ borderColor: project.color, color: project.color }}>
                    <span className="project-dot small" style={{ background: project.color }} />
                    {project.name}
                  </span>
                )}
              </div>
              <div className="source-actions">
                {/* Fix #9: stub buttons show "Coming soon" and are visually disabled */}
                <button className="action-btn coming-soon" title="Coming soon — BibTeX export">Export BibTeX</button>
                <button className="action-btn coming-soon" title="Coming soon — AI summarization">Summarize</button>
                <button className="action-btn icon-only" title="Edit source" onClick={() => setEditing(true)}>
                  <EditIcon />
                </button>
                <button className="action-btn icon-only danger" title="Delete source" onClick={handleDelete}>
                  <TrashIcon />
                </button>
              </div>
            </div>

            <h1 className="source-title">{source.title}</h1>

            <p className="source-byline">
              {[source.authors, source.year, source.publisher, source.journal]
                .filter(Boolean).join(' · ')}
              {source.doi && (
                <> · <a
                  className="doi-link"
                  href={source.doi.startsWith('http') ? source.doi : `https://doi.org/${source.doi}`}
                  target="_blank"
                  rel="noreferrer"
                >{source.doi}</a></>
              )}
            </p>

            <div className="source-tags">
              {source.tags.map(t => (
                <span key={t} className="tag-chip removable" onClick={() => removeTag(t)}>
                  {t} <span className="tag-remove">×</span>
                </span>
              ))}
              {editingTag ? (
                <form onSubmit={addTag} className="inline-tag-form">
                  <input
                    autoFocus
                    className="tag-input"
                    placeholder="new tag…"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onBlur={() => { if (!newTag.trim()) setEditingTag(false) }}
                    onKeyDown={e => e.key === 'Escape' && setEditingTag(false)}
                  />
                </form>
              ) : (
                <button className="tag-chip add-tag" onClick={() => setEditingTag(true)}>+ tag</button>
              )}
            </div>
          </div>

          {/* Abstract */}
          {source.abstract && (
            <section>
              <h2 className="section-label">Abstract</h2>
              <p className="abstract-text">{source.abstract}</p>
            </section>
          )}

          {/* Quotes */}
          <section>
            <div className="section-row">
              <h2 className="section-label">Quotes & Annotations</h2>
              <button className="action-btn small" onClick={() => setAddingQuote(true)}>+ Add quote</button>
            </div>

            {addingQuote && (
              <AddQuoteForm onSave={saveQuote} onCancel={() => setAddingQuote(false)} />
            )}

            {quotes.length === 0 && !addingQuote && (
              <div className="empty-quotes">
                <p>No quotes yet. Add a passage to get started.</p>
              </div>
            )}

            {quotes.map(q => (
              <QuoteCard key={q.id} quote={q} onDelete={onDeleteQuote} />
            ))}
          </section>
        </>
      )}
    </main>
  )
}
