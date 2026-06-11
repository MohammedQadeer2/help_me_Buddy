import axios from "axios";

const API = axios.create({
  baseURL: "https://help-me-buddy.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  withCredentials: true, // This allows cookies to be sent back and forth securely
});

export default API;