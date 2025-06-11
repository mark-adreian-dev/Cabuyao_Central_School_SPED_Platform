import axios from 'axios'


const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 60000,
    withCredentials: true,
    headers: {
        "Accept": "application/json",
    },
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
})


export const setCSRFHeader = () => {
    const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
    api.defaults.headers.common["X-XSRF-TOKEN"] = match
        ? decodeURIComponent(match[2])
        : "";
};

export default api