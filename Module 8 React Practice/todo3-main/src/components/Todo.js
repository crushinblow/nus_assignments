function Todo({ todo, onChangeEditMode, onDelete }) {
  const { id, value } = todo;
  return (
    <div className="entry" key={id}>
      <div className="entry-text">{value}</div>
      <div className="right">
        <button
          onClick={() => {
            onChangeEditMode(id, true);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm("Do you want to delete?")) {
              onDelete(id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Todo;
