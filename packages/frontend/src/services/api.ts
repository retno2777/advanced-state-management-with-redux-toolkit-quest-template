/**
 * This file is used to create a new instance of axios to communicate with the API.
 * This instance is configured to set the Content-Type to application/json and to
 * include the Authorization header with the token if the user is authenticated.
 * The instance is also configured to remove the Content-Type header when sending a
 * FormData request.
 * The instance is then exported and used in all the API calls throughout the application.
 */
import axios from 'axios';
import { store } from '../app/store';

const api = axios.create({
  baseURL: 'http://localhost:4040/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {

    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {

      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
