import { useState } from 'react'
import { PROJECT_COLORS } from '../useStore'

export default function ProjectList({ projects, allSources, activeProjectId, onSelect, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [name, setName]     = useState('')

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), PROJECT_COLORS[projects.length % PROJECT_COLORS.length])
    setName('')
    setAdding(false)
  }

  // Fix #6: confirm before deleting a project
  function handleDelete(e, id) {
    e.stopPropagation()
    if (!window.confirm('Delete this project? Sources will be unassigned but not deleted.')) return
    onDelete(id)
  }

  return (
    <div className="project-section">
      <button
        className={`project-item ${!activeProjectId ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        <span className="project-dot" style={{ background: 'var(--text-faint)' }} />
        <span className="project-name">All Sources</span>
        {/* Fix #2: always use allSources for counts */}
        <span className="project-count">{allSources.length}</span>
      </button>

      {projects.map(p => {
        const count = allSources.filter(s => s.projectId === p.id).length
        return (
          <button
            key={p.id}
            className={`project-item ${activeProjectId === p.id ? 'active' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <span className="project-dot" style={{ background: p.color }} />
            <span className="project-name">{p.name}</span>
            <span className="project-count">{count}</span>
            <span
              className="project-delete"
              role="button"
              title="Delete project"
              onClick={e => handleDelete(e, p.id)}
            >×</span>
          </button>
        )
      })}

      {/* Fix #11: add a ✓ confirm button alongside the input */}
      {adding ? (
        <form className="new-project-form" onSubmit={submit}>
          <input
            autoFocus
            className="new-project-input"
            placeholder="Project name…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setAdding(false)}
            onBlur={() => { if (!name.trim()) setAdding(false) }}
          />
          <button type="submit" className="new-project-confirm" title="Add project">✓</button>
        </form>
      ) : (
        <button className="add-project-btn" onClick={() => setAdding(true)}>
          + New project
        </button>
      )}
    </div>
  )
}
