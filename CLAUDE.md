# research-organizer

A research note and citation organizer for upper-level undergrads and grad students writing papers. Users track sources, quotes, and annotations in one place.

## Stack

- React 19 + Vite 8, plain JSX (no TypeScript)
- No UI library — custom CSS modules
- No backend — localStorage for persistence
- ESLint with react-hooks and react-refresh plugins

## Commands

```bash
npm run dev      # dev server (HMR)
npm run build    # production build
npm run preview  # serve production build locally
npm run lint     # ESLint
```

## Project status

Early scaffold — `src/App.jsx` is still the Vite default template. No features implemented yet.

## Core domain concepts

- **Source** — a cited work (book, article, website). Has title, author(s), year, URL/DOI, and optional abstract.
- **Quote** — an extracted passage from a source, with page/location reference.
- **Annotation** — a user's note attached to a source or quote.
- **Tag** — a theme or argument label applied to sources, quotes, or annotations for grouping.

## Planned expansion paths

- BibTeX export of sources
- AI summarization of pasted abstracts
- Tag-based filtering by theme or argument
