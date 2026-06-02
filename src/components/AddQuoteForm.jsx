import { useState } from 'react'

export default function AddQuoteForm({ onSave, onCancel }) {
  const [text, setText]             = useState('')
  const [page, setPage]             = useState('')
  const [annotation, setAnnotation] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSave({ text: text.trim(), page: page.trim(), annotation: annotation.trim() })
  }

  return (
    <form className="add-quote-form" onSubmit={submit}>
      <textarea
        className="form-input"
        placeholder="Paste the quote here…"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        autoFocus
      />
      <div className="form-row">
        <input
          className="form-input"
          placeholder="Page / location"
          value={page}
          onChange={e => setPage(e.target.value)}
        />
        <input
          className="form-input"
          placeholder="Your annotation (optional)"
          value={annotation}
          onChange={e => setAnnotation(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="action-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="action-btn primary" disabled={!text.trim()}>Save quote</button>
      </div>
    </form>
  )
}
