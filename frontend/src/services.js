import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3131/api",
});

export default API;