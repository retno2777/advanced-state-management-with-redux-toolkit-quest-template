import axios from 'axios';
import { store } from '../app/store'; // Mengimpor store Redux untuk mendapatkan state

const api = axios.create({
  baseURL: 'http://localhost:4040/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // Tetap default untuk JSON, tetapi kita akan biarkan diubah jika mengirim FormData
  },
});

// Interceptor untuk menambahkan token ke setiap permintaan
api.interceptors.request.use(
  (config) => {
    // Ambil token dari Redux state
    const state = store.getState();
    const token = state.auth.token;

    // Jika ada token, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Jika data yang dikirim adalah FormData, hapus 'Content-Type' agar axios dapat mengatur otomatis
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']; // Hapus 'Content-Type' agar multipart/form-data ditetapkan otomatis
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
