import axios from "axios";

export const axiosIntance = axios.create({
    baseURL: "http://localhost:3000/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let getAccessToken = () => null;
let updateAccessToken = () => {};

export const injectAuthDependencies = ({
    getToken,
    setToken,
}) => {
    getAccessToken = getToken;
    updateAccessToken = setToken;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
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
            const accessToken = getAccessToken();

            if (accessToken) {
                config.headers.Authorization =
                    `Bearer ${accessToken}`;
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
                originalRequest.headers =
                    originalRequest.headers || {};

                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return axiosIntance(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axiosIntance.post(
                "auth/refresh"
            );

            const newAccessToken =
                response.data.accessToken;

            if (!newAccessToken) {
                throw new Error(
                    "New access token was not returned"
                );
            }

            updateAccessToken(newAccessToken);

            processQueue(null, newAccessToken);

            originalRequest.headers =
                originalRequest.headers || {};

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