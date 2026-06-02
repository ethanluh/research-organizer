import { PlusIcon } from '../icons'
import ProjectList from './ProjectList'
import SourceList from './SourceList'

export default function Sidebar({
  projects, allSources, sources, allQuotes, allTags,
  activeProjectId, selectedSourceId, search, activeTag,
  onSelectProject, onSelectSource, onSearchChange, onTagChange,
  onAddProject, onDeleteProject, onNewSource,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="app-name">Marginalia</span>
      </div>


      {/* Fix #2: pass allSources so counts are never filtered */}
      <ProjectList
        projects={projects}
        allSources={allSources}
        activeProjectId={activeProjectId}
        onSelect={onSelectProject}
        onAdd={onAddProject}
        onDelete={onDeleteProject}
      />

      <div className="sidebar-divider" />

      <SourceList
        sources={sources}
        quotes={allQuotes}
        allTags={allTags}
        selectedId={selectedSourceId}
        search={search}
        activeTag={activeTag}
        onSelect={onSelectSource}
        onSearchChange={onSearchChange}
        onTagChange={onTagChange}
        onNewSource={onNewSource}
      />

      {/* Fix #3: footer always shows global totals */}
      <div className="sidebar-footer">
        <span>
          {allSources.length} source{allSources.length !== 1 ? 's' : ''} · {allQuotes.length} quote{allQuotes.length !== 1 ? 's' : ''}
        </span>
      </div>
    </aside>
  )
}
