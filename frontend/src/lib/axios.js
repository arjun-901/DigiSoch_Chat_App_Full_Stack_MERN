import axios from "axios";

const BASE_URL = "https://digi-soch-chat-app-full-stack-mern-mauve.vercel.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
