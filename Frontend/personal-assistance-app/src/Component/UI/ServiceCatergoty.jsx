import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function ServiceCatergoty() {
  const [catergories, setCatergories] = useState([
    { id: 1, name: "Baby sitting" },
    { id: 2, name: "Nanny" },
  ]);
  const [selectCategory, setSelectCategory] = useState("");
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
  const [selectProvider, setSelectProvider] = useState("");

  //handling function
  const handleCategory = (event) => {
    const selectedCategory = event.target.value;
    setSelectCategory(selectedCategory);

    const filtered = serviceProvider.filter(
      (provider) => provider.catId === parseInt(selectedCategory),
    );
    setFilteredProvider(filtered);
  };

  const handleChangeProvider = (event) => {
    setSelectProvider(event.target.value);
  };

  return (
    <div>
      <form>
        <h5 style={{ color: "#000080" }}>Select Service Category</h5>
        <div>
          <select
            className="form-select"
            aria-label="service Category"
            onChange={handleCategory}
            value={selectCategory}
          >
            <option value="">Category</option>
            {catergories.map((catergory) => (
              <option key={catergory.id} value={catergory.id}>
                {catergory.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h5 style={{ color: "#000080" }}>
            Select Service Provider Your hired
          </h5>
          <select
            className="form-select"
            aria-label="service Provider"
            onChange={handleChangeProvider}
            value={selectProvider}
          >
            <option value="">Service Provider</option>
            {filteredProvider.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
