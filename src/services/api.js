import axios from 'axios'

const api = axios.create({
    baseURL: 'https://backend-m2bd.onrender.com'
});

export default api