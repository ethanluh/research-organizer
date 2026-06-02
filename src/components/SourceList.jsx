import { SearchIcon } from '../icons'

const TYPE_LABEL = { book: 'Book', article: 'Article', thesis: 'Thesis', website: 'Web' }
const TYPE_COLOR = { book: '#2563eb', article: '#16a34a', thesis: '#7c3aed', website: '#c2410c' }

export default function SourceList({
  sources, quotes, allTags,
  selectedId, search, activeTag,
  onSelect, onSearchChange, onTagChange, onNewSource,
}) {
  return (
    <>
      <div className="search-wrap">
        <SearchIcon className="search-icon" />
        <input
          className="search"
          placeholder="Search sources…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {allTags.length > 0 && (
        <div className="tag-filter">
          <button
            className={`tag-pill ${!activeTag ? 'active' : ''}`}
            onClick={() => onTagChange(null)}
          >All</button>
          {allTags.map(t => (
            <button
              key={t}
              className={`tag-pill ${activeTag === t ? 'active' : ''}`}
              onClick={() => onTagChange(activeTag === t ? null : t)}
            >{t}</button>
          ))}
        </div>
      )}

      <nav className="source-list">
        {sources.map(s => {
          const quoteCount = quotes.filter(q => q.sourceId === s.id).length
          return (
            <button
              key={s.id}
              className={`source-item ${s.id === selectedId ? 'selected' : ''}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="source-type-badge" style={{ background: TYPE_COLOR[s.type] }}>
                {TYPE_LABEL[s.type]}
              </span>
              <span className="source-item-title">{s.title}</span>
              <span className="source-item-meta">{s.authors}{s.year ? ` · ${s.year}` : ''}</span>
              {quoteCount > 0 && (
                <span className="quote-count">{quoteCount} quote{quoteCount !== 1 ? 's' : ''}</span>
              )}
            </button>
          )
        })}

        {/* Fix #12: always-visible add source button at the bottom of the list */}
        <button className="add-source-list-btn" onClick={onNewSource}>
          + Add source
        </button>
      </nav>
    </>
  )
}
