import API from "./axios";

// Login User
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// Register User
export const registerUser = (data) => {
  return API.post("/auth/register", data);
};
