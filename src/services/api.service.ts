import router from "@/router";
import { UserStore } from "@/store/user.store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const { user } = UserStore;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.setItem('redirectPath', location.pathname)
      router.push({ name: 'login' })
    }
    return Promise.reject(error);
  }
);
export default api;
