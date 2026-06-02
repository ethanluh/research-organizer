const CROSSREF = 'https://api.crossref.org/works'

function stripJats(str) {
  return str?.replace(/<[^>]+>/g, '').trim() ?? ''
}

function mapWork(work) {
  const authors = (work.author ?? [])
    .map(a => [a.family, a.given ? a.given[0] + '.' : ''].filter(Boolean).join(', '))
    .join(' · ')

  const dateParts =
    work['published-print']?.['date-parts']?.[0] ??
    work['published-online']?.['date-parts']?.[0]

  const typeMap = {
    'journal-article': 'article',
    'book': 'book',
    'monograph': 'book',
    'dissertation': 'thesis',
    'posted-content': 'article',
    'book-chapter': 'article',
    'proceedings-article': 'article',
  }

  return {
    title:     work.title?.[0] ?? '',
    authors,
    year:      dateParts?.[0] ?? null,
    type:      typeMap[work.type] ?? 'article',
    publisher: work.publisher ?? '',
    journal:   work['container-title']?.[0] ?? '',
    abstract:  stripJats(work.abstract),
    doi:       work.DOI ?? '',
  }
}

// Returns the bare DOI (e.g. "10.1177/…") from a DOI URL or bare DOI string, or null.
export function extractDoi(input) {
  const m = input.match(/(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:)?(10\.\d{4,}\/\S+)/i)
  return m?.[1] ?? null
}

export async function fetchByDoi(doi) {
  const res = await fetch(`${CROSSREF}/${encodeURIComponent(doi)}`, {
    headers: { 'User-Agent': 'Marginalia/1.0 (research organizer)' },
  })
  if (!res.ok) return null
  const json = await res.json()
  return mapWork(json.message)
}

// Returns up to 3 candidate works ranked by CrossRef relevance score.
export async function searchByTitle(title) {
  const params = new URLSearchParams({
    'query.bibliographic': title,
    rows: '3',
    select: 'title,author,published-print,published-online,publisher,container-title,abstract,DOI,type,score',
  })
  const res = await fetch(`${CROSSREF}?${params}`)
  if (!res.ok) return []
  const json = await res.json()
  return (json.message?.items ?? []).map(mapWork)
}
