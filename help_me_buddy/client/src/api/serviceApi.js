import API from "./axios";

// Get all service categories
export const getServiceCategories = () => {
  return API.get("/service");
};
