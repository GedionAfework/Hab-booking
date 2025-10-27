import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3131/hab-booking",
});

export default API;