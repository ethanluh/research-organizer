import { useState } from 'react'
import './App.css'
import { useStore } from './useStore'
import Sidebar from './components/Sidebar'
import SourceDetail from './components/SourceDetail'
import AddSourceModal from './components/AddSourceModal'

export default function App() {
  const store = useStore()

  const [activeProjectId, setActiveProjectId] = useState(null)
  const [selectedSourceId, setSelectedSourceId] = useState(store.sources[0]?.id ?? null)
  const [search, setSearch]               = useState('')
  const [activeTag, setActiveTag]         = useState(null)
  const [showAddSource, setShowAddSource] = useState(false)

  const visibleSources = store.sources.filter(s => {
    const inProject = !activeProjectId || s.projectId === activeProjectId
    const inSearch  = !search || [s.title, s.authors, ...s.tags].some(f =>
      f.toLowerCase().includes(search.toLowerCase())
    )
    const hasTag    = !activeTag || s.tags.includes(activeTag)
    return inProject && inSearch && hasTag
  })

  const effectiveId = visibleSources.find(s => s.id === selectedSourceId)
    ? selectedSourceId
    : visibleSources[0]?.id ?? null

  const source  = store.sources.find(s => s.id === effectiveId) ?? null
  const quotes  = source ? store.quotes.filter(q => q.sourceId === source.id) : []
  const project = source ? store.projects.find(p => p.id === source.projectId) ?? null : null

  // Fix #4: tag pills scope to the active project
  const tagSourcePool = activeProjectId
    ? store.sources.filter(s => s.projectId === activeProjectId)
    : store.sources
  const allTags = [...new Set(tagSourcePool.flatMap(s => s.tags))].sort()

  function handleSelectProject(id) {
    setActiveProjectId(id)
    setActiveTag(null)
    setSearch('')
  }

  function handleDeleteSource(id) {
    if (!window.confirm('Delete this source and all its quotes? This cannot be undone.')) return
    store.deleteSource(id)
    setSelectedSourceId(visibleSources.find(s => s.id !== id)?.id ?? null)
  }

  function handleAddSource(data) {
    const id = store.addSource(data)
    setSelectedSourceId(id)
    setShowAddSource(false)
  }

  return (
    <div className="app">
      <Sidebar
        projects={store.projects}
        allSources={store.sources}
        sources={visibleSources}
        allQuotes={store.quotes}
        allTags={allTags}
        activeProjectId={activeProjectId}
        selectedSourceId={effectiveId}
        search={search}
        activeTag={activeTag}
        onSelectProject={handleSelectProject}
        onSelectSource={setSelectedSourceId}
        onSearchChange={setSearch}
        onTagChange={setActiveTag}
        onAddProject={store.addProject}
        onDeleteProject={store.deleteProject}
        onNewSource={() => setShowAddSource(true)}
      />

      {source ? (
        // Fix #1: key resets all local state (tag editing, add-quote form, edit mode) on source change
        <SourceDetail
          key={effectiveId}
          source={source}
          quotes={quotes}
          project={project}
          projects={store.projects}
          onDelete={handleDeleteSource}
          onAddQuote={store.addQuote}
          onDeleteQuote={store.deleteQuote}
          onUpdateSource={store.updateSource}
        />
      ) : (
        <main className="main empty-main">
          <p>
            Select a source or{' '}
            <button className="link-btn" onClick={() => setShowAddSource(true)}>add one</button>.
          </p>
        </main>
      )}

      {showAddSource && (
        <AddSourceModal
          projects={store.projects}
          defaultProjectId={activeProjectId}
          onSave={handleAddSource}
          onClose={() => setShowAddSource(false)}
        />
      )}
    </div>
  )
}
