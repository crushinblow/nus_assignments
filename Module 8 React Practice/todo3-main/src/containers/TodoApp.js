import { useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import "../todo.css";

function TodoApp() {
  const [data, setData] = useState([]);

  //a map to capture the current editMode of data
  //if no entry found => not in edit mode
  const [editModes, setEditModes] = useState({});

  function addNewEntry(value) {
    setData([...data, { id: data.length + 1, value: value }]);
  }

  function deleteEntry(id) {
    setData(data.filter((entry) => entry.id !== id));
  }

  function editEntry(id, value) {
    const newData = data.map((entry) => {
      if (entry.id === id) {
        entry.value = value;
      }
      return entry;
    });
    changeEditMode(id, false);
    setData(newData);
  }

  //function to change the status of a todo to be edit mode
  function changeEditMode(id, editMode) {
    //we clone the data and avoid modify the data directly
    const newEditModes = Object.assign({}, editModes);
    newEditModes[id] = editMode;
    setEditModes(newEditModes);
  }

  return (
    <div className="container">
      <h2>Todo:</h2>
      <TodoList
        todos={data}
        editModes={editModes}
        onChangeEditMode={changeEditMode}
        onEdit={editEntry}
        onDelete={deleteEntry}
      />
      <br />
      <TodoForm editMode={false} onAdd={addNewEntry} />
    </div>
  );
}

export default TodoApp;
