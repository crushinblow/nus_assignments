import { useEffect, useRef, useState } from "react";

function TodoForm({
  editMode = false,
  todo = { id: 0, value: "" },
  onAdd,
  onEdit,
  onChangeEditMode,
}) {
  const { id, value } = todo;
  const textboxRef = useRef(null);
  const [entry, setEntry] = useState(value);

  useEffect(() => {
    textboxRef.current.focus();
    textboxRef.current.select();
  }, []);

  function resetState() {
    setEntry(value);
  }

  function renderCancelBtn() {
    if (editMode) {
      //edit case
      return (
        <button
          onClick={() => {
            onChangeEditMode(id, false);
            resetState();
          }}
        >
          Cancel
        </button>
      );
    } else {
      //add new case
      if (entry.length > 0) {
        return <button onClick={() => setEntry("")}>Cancel</button>;
      } else {
        return <div></div>;
      }
    }
  } //end renderCancelBtn

  function renderAddOrEditBtn() {
    let buttonText = "Add";
    let buttonHandler = () => {
      onAdd(entry);
      resetState();
    };

    if (editMode) {
      buttonText = "Confirm Edit";

      buttonHandler = () => {
        onEdit(id, entry);
      };
    }

    return <button onClick={buttonHandler}>{buttonText}</button>;
  } //end renderAddOrEditBtn

  const cancelBtn = renderCancelBtn();
  const addOrEditBtn = renderAddOrEditBtn();

  return (
    <>
      <textarea
        className="form-text"
        onChange={(e) => setEntry(e.target.value)}
        value={entry}
        ref={textboxRef}
      ></textarea>
      <div className="form-action">
        {cancelBtn}
        {addOrEditBtn}
      </div>
    </>
  );
}

export default TodoForm;
