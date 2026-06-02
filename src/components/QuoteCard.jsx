import { useState } from 'react'
import { TrashIcon, AnnotationIcon } from '../icons'

// Fix #10: chevron icon to signal expandability
function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`quote-chevron ${expanded ? 'expanded' : ''}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <polyline points="4,6 8,10 12,6" />
    </svg>
  )
}

export default function QuoteCard({ quote, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`quote-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(x => !x)}
      title={expanded ? 'Click to collapse' : 'Click to expand'}
    >
      <div className="quote-mark">"</div>
      <div className="quote-body">
        <blockquote className="quote-text">{quote.text}</blockquote>
        {quote.page && <span className="quote-page">p. {quote.page}</span>}
        {quote.annotation && (
          <div className="annotation">
            <AnnotationIcon className="annotation-icon" />
            <p className="annotation-text">{quote.annotation}</p>
          </div>
        )}
      </div>
      <div className="quote-card-aside">
        <ChevronIcon expanded={expanded} />
        {expanded && (
          <button
            className="quote-delete"
            title="Delete quote"
            onClick={e => { e.stopPropagation(); onDelete(quote.id) }}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  )
}
