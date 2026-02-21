import { useState } from 'react'
import Bar from './components/Bar'
import Storage from './components/Storage'

function App() {
  const [todos, setTodos] = useState([])

  function addTodo(text) {
    setTodos([...todos, { id: Date.now(), text }])
  }

  function editTodo(id, newText) {
    setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t))
  }

  function deleteTodo(id) {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto mt-0 sm:mt-8 sm:rounded-lg overflow-hidden border-0 sm:border border-gray-700/50 shadow-2xl">
      <div className="bg-[#1c2128] px-4 py-2 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-500 text-xs ml-3">todos — zsh — 80x24</span>
      </div>
      <Bar onAdd={addTodo} />
      <Storage todos={todos} onEdit={editTodo} onDelete={deleteTodo} />
    </div>
  )
}

export default App
