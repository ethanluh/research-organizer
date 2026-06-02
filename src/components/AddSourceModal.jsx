import { useState, useEffect } from 'react'
import { CloseIcon } from '../icons'
import { extractDoi, fetchByDoi, searchByTitle } from '../utils/fetchMetadata'

const INITIAL = {
  title: '', authors: '', year: '', type: 'book',
  publisher: '', journal: '', doi: '', abstract: '',
  projectId: '', tags: '',
}

export default function AddSourceModal({ projects, defaultProjectId, onSave, onClose }) {
  const [form, setForm]           = useState({ ...INITIAL, projectId: defaultProjectId ?? projects[0]?.id ?? '' })
  const [fetching, setFetching]   = useState(false) // which field is loading: 'doi' | 'title' | null
  const [suggestion, setSuggestion] = useState(null) // { title, authors, year, … } from CrossRef title search
  const [lookupError, setLookupError] = useState(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function applyMetadata(meta) {
    setForm(f => ({
      ...f,
      title:     meta.title     || f.title,
      authors:   meta.authors   || f.authors,
      year:      meta.year      ? String(meta.year) : f.year,
      type:      meta.type      || f.type,
      publisher: meta.publisher || f.publisher,
      journal:   meta.journal   || f.journal,
      abstract:  meta.abstract  || f.abstract,
      doi:       meta.doi       || f.doi,
    }))
    setSuggestion(null)
    setLookupError(null)
  }

  async function handleDoiBlur(e) {
    const val = e.target.value.trim()
    if (!val) return
    const doi = extractDoi(val)
    if (!doi) return
    setFetching('doi')
    setLookupError(null)
    try {
      const meta = await fetchByDoi(doi)
      if (meta) applyMetadata(meta)
      else setLookupError('No record found for that DOI.')
    } catch {
      setLookupError('Could not reach CrossRef. Check your connection.')
    } finally {
      setFetching(null)
    }
  }

  async function handleTitleBlur(e) {
    const val = e.target.value.trim()
    // Only search if title is substantial and other key fields are still empty
    if (val.length < 10 || form.authors || form.year) return
    setFetching('title')
    setLookupError(null)
    try {
      const results = await searchByTitle(val)
      if (results.length > 0) setSuggestion(results[0])
    } catch {
      // Title search failures are silent — user can still fill manually
    } finally {
      setFetching(null)
    }
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      year: form.year ? parseInt(form.year) : null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add source</h2>
          <button className="icon-btn" onClick={onClose}><CloseIcon /></button>
        </div>

        <form className="modal-form" onSubmit={submit}>
          {/* DOI / URL — primary lookup trigger */}
          <div className="form-field">
            <label className="form-label">
              DOI / URL
              {fetching === 'doi' && <span className="lookup-spinner" />}
            </label>
            <input
              className="form-input"
              placeholder="10.xxxx/… or https://doi.org/…"
              value={form.doi}
              onChange={e => { set('doi', e.target.value); setLookupError(null) }}
              onBlur={handleDoiBlur}
            />
            {lookupError && <p className="lookup-error">{lookupError}</p>}
          </div>

          {/* Title */}
          <div className="form-field">
            <label className="form-label">
              Title *
              {fetching === 'title' && <span className="lookup-spinner" />}
            </label>
            <input
              className="form-input"
              placeholder="Full title of the work"
              value={form.title}
              onChange={e => { set('title', e.target.value); setSuggestion(null) }}
              onBlur={handleTitleBlur}
              autoFocus
              required
            />
          </div>

          {/* CrossRef suggestion card */}
          {suggestion && (
            <div className="suggestion-card">
              <div className="suggestion-body">
                <p className="suggestion-label">Found on CrossRef</p>
                <p className="suggestion-title">{suggestion.title}</p>
                <p className="suggestion-meta">
                  {[suggestion.authors, suggestion.year, suggestion.publisher || suggestion.journal]
                    .filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="suggestion-actions">
                <button type="button" className="action-btn small" onClick={() => setSuggestion(null)}>Dismiss</button>
                <button type="button" className="action-btn small primary" onClick={() => applyMetadata(suggestion)}>Use this</button>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Author(s)</label>
              <input className="form-input" placeholder="Last, F. · Last, F." value={form.authors} onChange={e => set('authors', e.target.value)} />
            </div>
            <div className="form-field narrow">
              <label className="form-label">Year</label>
              <input className="form-input" type="number" placeholder="2024" value={form.year} onChange={e => set('year', e.target.value)} />
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

          <div className="form-field">
            <label className="form-label">Abstract</label>
            <textarea className="form-input" rows={3} value={form.abstract} onChange={e => set('abstract', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Project</label>
              <select className="form-input" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                <option value="">— None —</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-input" placeholder="democracy, media, …" value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="action-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="action-btn primary" disabled={!form.title.trim()}>Add source</button>
          </div>
        </form>
      </div>
    </div>
  )
}
