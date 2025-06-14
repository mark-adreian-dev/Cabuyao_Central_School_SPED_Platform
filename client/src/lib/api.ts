import axios from 'axios'


const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 60000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },

})

export const setAuthToken = (token: string) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const resetAuthToken = () => {
    api.defaults.headers.common.Authorization = ''
}

export default api