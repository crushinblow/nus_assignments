import "./Department.css";

export default function Department(props) {
  const { departments, onDepartmentSelect, children } = props;
  console.log(departments);
  return (
    <div>
      {children}
      <ol className="list">
        {departments.map((item, index) => {
          return (
            <li key={index}>
              <button
                className="btn-sm"
                onClick={() => {
                  onDepartmentSelect(item);
                }}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
