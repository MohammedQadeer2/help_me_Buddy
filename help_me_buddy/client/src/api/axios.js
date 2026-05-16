import axios from "axios";

const API = axios.create({
  baseURL: " https://help-me-buddy-backend.onrender.com/api",
  withCredentials: true, // This allows cookies to be sent back and forth securely
});

export default API;