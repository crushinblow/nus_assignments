import "./company.css";
import Department from "../department/Department";

export default function Company(props) {
  const {
    companyName = "UnKnown Company",
    details = "No details available",
    departments,
    onCompanySelect,
  } = props;
  //   console.log(props);
  //   function demo() {
  //     return "I am from function";
  //   }
  //   const demo = () => {
  //     return "I am from arrow function";
  //   };
  const buttonHandler = (companyName) => {
    console.log("button Clicked " + companyName);
  };
  return (
    <div className="details">
      <h1>
        Company Name: <span> {companyName} </span>
      </h1>
      <p>{details}</p>
      <button
        className="primary-btn-md"
        onClick={() => {
          onCompanySelect(companyName);
        }}
      >
        Select {companyName}
      </button>
      <Department
        departments={departments}
        onDepartmentSelect={(department) => {
          onCompanySelect(`${companyName} - ${department}`);
        }}
      >
        <h5> Department </h5>
      </Department>
      {/* {children} */}
    </div>
  );
}

// export default Company;
