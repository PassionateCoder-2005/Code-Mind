
import axios from "axios";
import { store } from "../store/store";
import { setAccessToken } from "../store/slices/authSlice";
export const axiosIntance = axios.create({
    baseURL: "http://localhost:3000/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosIntance.interceptors.request.use(
    (config) => {

const isAuthRequest =
    config.url?.includes("auth/login") ||
    config.url?.includes("auth/signup") ||
    config.url?.includes("auth/refresh");

if (!isAuthRequest) {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
}

        return config;
    },
    (error) => Promise.reject(error)
);

axiosIntance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("auth/refresh") ||
            originalRequest.url?.includes("auth/login")
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosIntance(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axiosIntance.post("auth/refresh");
            const newAccessToken = response.data.accessToken;
store.dispatch(setAccessToken(newAccessToken));
            if (!newAccessToken) {
                throw new Error("New access token was not returned");
            }

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return axiosIntance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
