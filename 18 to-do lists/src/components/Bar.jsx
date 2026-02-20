import { useState } from 'react'

function Bar({ onAdd }) {
  const [text, setText] = useState('')

  function handleAdd() {
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <div className="border-b border-green-900/50 bg-[#161b22] flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3">
      <span className="text-green-500 font-bold shrink-0 text-sm sm:text-base">~/todos $</span>
      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="add task..."
          className="w-full bg-transparent text-green-400 placeholder-green-800 outline-none caret-transparent"
        />
        <span className="absolute top-0 left-0 pointer-events-none text-transparent">{text}<span className="cursor-blink" /></span>
      </div>
      <button
        onClick={handleAdd}
        aria-label="Add task"
        className="w-8 h-8 rounded-full border border-green-700 text-green-500 text-lg flex items-center justify-center hover:bg-green-900/30 cursor-pointer"
      >
        +
      </button>
    </div>
  )
}

export default Bar