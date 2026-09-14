import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api/v1",
});

export default api;