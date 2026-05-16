import API from "./axios";

// Get all providers with filters
export const getProviders = (params) => {
  return API.get("/providers", { params });
};

// Get single provider
export const getProviderById = (id) => {
  return API.get(`/providers/${id}`);
};

// Create provider (for dashboard)
export const createProvider = (data, token) => {
  return API.post("/providers", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};