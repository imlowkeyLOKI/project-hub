import { useState } from 'react'

function Item({ id, text, onEdit, onDelete, line }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)

  function save() {
    if (!draft.trim()) return
    onEdit(id, draft.trim())
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 border-b border-gray-800 group">
      <span className="text-gray-600 select-none text-xs w-5 text-right">{line}</span>
      {editing ? (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          autoFocus
          className="flex-1 bg-transparent text-green-400 outline-none border-b border-green-700 caret-green-500"
        />
      ) : (
        <span className="flex-1">{text}</span>
      )}
      <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {editing ? (
          <button
            onClick={save}
            title="Save"
            aria-label="Save"
            className="p-1 text-green-600 hover:text-green-400 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            aria-label="Edit"
            className="p-1 text-gray-500 hover:text-green-400 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onDelete(id)}
          title="Delete"
          aria-label="Delete"
          className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Item
