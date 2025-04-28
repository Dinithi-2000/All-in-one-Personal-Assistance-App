
export const formatServiceType = (serviceType) => {
    // Split camelCase or concatenated strings into separate words
    return serviceType
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim(); // Remove any leading/trailing spaces
  };