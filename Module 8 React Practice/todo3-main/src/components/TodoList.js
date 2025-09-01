import Todo from "./Todo";
import TodoForm from "./TodoForm";

function TodoList({ todos, editModes, onChangeEditMode, onEdit, onDelete }) {
  const list = todos.map((todo) => {
    const { id } = todo;

    if (editModes[id]) {
      //edit mode
      return (
        <TodoForm
          key={id}
          todo={todo}
          editMode={true}
          onChangeEditMode={onChangeEditMode}
          onEdit={onEdit}
        />
      );
    } else {
      return (
        <Todo
          key={id}
          todo={todo}
          onChangeEditMode={onChangeEditMode}
          onDelete={onDelete}
        />
      );
    }
  });
  return <>{list}</>;
}

export default TodoList;
