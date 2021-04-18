import axios from "axios";
import { Constants } from "../constants";
export const apiClient = axios.create({
    baseURL: `${Constants.BASE_API_URL}`,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8"
    }
});
