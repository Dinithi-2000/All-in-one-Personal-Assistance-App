import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AgreementDetails from "./AgreementDetails";
import axios from "axios";

export default function ServiceCatergoty() {
  const [catergories, setCatergories] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [filteredProvider, setFilteredProvider] = useState([]);
  const [selectedCategoryObject, setSelectedCategoryObject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectProvider, setSelectProvider] = useState(null);
  const [hireDetails, setHireDetails] = useState(false);

  //useEffect to retrieve categories.
  useEffect(() => {
    const getStudents = () => {
      axios
        .get("http://localhost:8070/home/payment/")
        .then((res) => {
          console.log(res);
          setCatergories(res.data);
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    getStudents();
  }, []);

  //useEffect for retriev provider
  useEffect(() => {
    if (selectCategory) {
      const getProviders = () => {
        axios
          .get(
            `http://localhost:8070/home/payment/category/provider/${selectCategory}`,
          )
          .then((res) => {
            console.log(res);
            setFilteredProvider(res.data);
          })
          .catch((error) => {
            alert(error.message);
          });
      };
      getProviders();
    }
  }, [selectCategory]);

  //handling function/category/provider/:categoryID
  const handleCategory = (event) => {
    const selectedCategoryId = event.target.value;
    console.log(selectedCategoryId);
    setSelectCategory(selectedCategoryId);

    const selectedCategory = catergories.find(
      (category) => category.CategoryID === selectedCategoryId,
    );
    console.log(selectedCategory);
    setSelectedCategoryObject(selectedCategory || null);
  };

  const handleChangeProvider = (event) => {
    const providerID = event.target.value;
    const provider = filteredProvider.find((p) => p.ProviderID === providerID);

    setSelectProvider(provider || null);
  };

  const handleHirdetails = () => {
    setHireDetails(true);
  };

  return (
    <div>
      {hireDetails ? (
        <AgreementDetails
          selectCategory={selectedCategoryObject}
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
              value={selectCategory ? selectCategory.CategoryID : ""}
            >
              <option value="">Category</option>
              {catergories.map((catergory) => (
                <option key={catergory.CategoryID} value={catergory.CategoryID}>
                  {catergory.Type}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <h5 style={{ color: "#000080" }} className="whitespace-nowrap">
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
                <option key={provider.ProviderID} value={provider.ProviderID}>
                  {provider.FirstName} {provider.LastName}
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
