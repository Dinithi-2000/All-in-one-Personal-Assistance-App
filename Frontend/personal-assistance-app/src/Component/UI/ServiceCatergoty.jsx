import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AgreementDetails from "./AgreementDetails";

export default function ServiceCatergoty() {
  const [catergories, setCatergories] = useState([
    { id: 1, name: "Baby sitting" },
    { id: 2, name: "Nanny" },
  ]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [serviceProvider, setServiceProvider] = useState([
    {
      id: 1,
      name: "Kasun",
      catId: 1,
    },
    { id: 2, name: "Manik", catId: 2 },
    { id: 3, name: "Amali", catId: 1 },
  ]);
  const [filteredProvider, setFilteredProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectProvider, setSelectProvider] = useState(null);
  const [hireDetails, setHireDetails] = useState(false);

  //handling function
  const handleCategory = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = catergories.find(
      (cat) => cat.id === parseInt(selectedCategoryId),
    );
    setSelectCategory(selectedCategory);

    const filtered = serviceProvider.filter(
      (provider) => provider.catId === parseInt(selectedCategoryId),
    );
    setFilteredProvider(filtered);
  };

  const handleChangeProvider = (event) => {
    const providerID = event.target.value;

    const provider = serviceProvider.find(
      (provi) => provi.id === parseInt(providerID),
    );
    setSelectProvider(provider);
  };

  const handleHirdetails = () => {
    setHireDetails(true);
  };

  return (
    <div>
      {hireDetails ? (
        <AgreementDetails
          serviceCategory={selectCategory}
          selectProvider={selectProvider}
        />
      ) : (
        <form>
          <h5 style={{ color: "#000080" }}>Select Service Category</h5>
          <div>
            <select
              className="form-select"
              aria-label="service Category"
              onChange={handleCategory}
              value={selectCategory ? selectCategory.id : ""}
            >
              <option value="">Category</option>
              {catergories.map((catergory) => (
                <option key={catergory.id} value={catergory.id}>
                  {catergory.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <h5 style={{ color: "#000080" }}>
              Select Service Provider Your hired
            </h5>
            <select
              className="form-select"
              aria-label="service Provider"
              onChange={handleChangeProvider}
              value={selectProvider ? selectProvider.id : ""}
              disabled={!selectCategory}
            >
              <option value="">Service Provider</option>
              {filteredProvider.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleHirdetails}
              disabled={!selectCategory || !selectProvider}
            >
              Browse Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
