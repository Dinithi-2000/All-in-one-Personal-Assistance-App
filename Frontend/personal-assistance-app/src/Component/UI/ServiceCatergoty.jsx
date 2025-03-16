import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function ServiceCatergoty() {
  const [catergories, setCatergories] = useState([
    { id: 1, name: "Baby sitting" },
    { id: 2, name: "Nanny" },
  ]);
  const [selectCategory, setSelectCategory] = useState("");
  const [serviceProvider, setServiceProvider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //handling function
  const hanldeCategoryChange = (event) => {
    setSelectCategory(event.target.value);
  };
  const handleChangeProvider = (event) => {
    setServiceProvider(event.target.value);
  };
  return (
    <div>
      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="category-select-label">Service Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="caategory-select"
            value={selectCategory}
            label="Srvice Catergory"
            onChange={hanldeCategoryChange}
          >
            <MenuItem value="">
              <em>Select a Service Category</em>
            </MenuItem>
            {catergories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectCategory && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="provider-select-label">Service Category</InputLabel>
            <Select
              labelId="provider-select-label"
              id="provider-select"
              value=""
              label="Srvice Provider"
              onChange={handleChangeProvider}
              disabled={isLoading}
            >
              <MenuItem value="">
                <em> Service provider</em>
              </MenuItem>
              {serviceProvider.map((provider) => (
                <MenuItem key={provider._id} value={provider._id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </div>
  );
}
