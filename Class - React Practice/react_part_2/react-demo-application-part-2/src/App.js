import { useState } from "react";
import "./app.css";
import Company from "./components/company/company";
import { companies } from "./dataset";

export default function App() {
  const department = ["Engineering", "HR", "Sales"];
  const [selectedCompany, setSelectedCompany] = useState("Select Company");

  const handleCompanySelection = (selectedCompany) => {
    setSelectedCompany(selectedCompany);
  };
  return (
    <div className="container">
      <h1 className="main-title">{selectedCompany} </h1>
      {companies.map((company, index) => {
        return (
          <Company
            key={index}
            companyName={company.companyName}
            details={company.details}
            departments={company.departments}
            onCompanySelect={handleCompanySelection}
          />
        );
      })}

      {/* <Company /> */}
      {/* <Company>
        <div>
          <h1>I'm from app component but i'll load from the company component</h1>
        </div>
      </Company> */}
    </div>
  );
}
