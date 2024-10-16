import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { setCredentials } from './features/auth/authSlice'; // Import action untuk set credentials
import App from './App';

// Cek token dari localStorage atau sessionStorage
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = localStorage.getItem('user') || sessionStorage.getItem('user');

// Jika token ada, pulihkan ke Redux state
if (token && user) {
  store.dispatch(setCredentials({ token, user: JSON.parse(user) }));
}

// Render aplikasi dengan Redux store
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
