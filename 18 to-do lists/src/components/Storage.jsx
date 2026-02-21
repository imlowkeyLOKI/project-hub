import Item from './Item'

function Storage({ todos, onEdit, onDelete }) {
  return (
    <div className="min-h-[200px]">
      {todos.length === 0 ? (
        <p className="text-green-800 px-6 py-4">no tasks. use the prompt above to add one.</p>
      ) : (
        todos.map((todo, i) => (
          <Item
            key={todo.id}
            id={todo.id}
            text={todo.text}
            line={i + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

export default Storage
