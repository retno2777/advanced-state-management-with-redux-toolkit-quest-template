import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { setCredentials } from './features/auth/authSlice'; 
import App from './App';


const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = localStorage.getItem('user') || sessionStorage.getItem('user');

//fetch toke and user from local storage to store in redux
if (token && user) {
  store.dispatch(setCredentials({ token, user: JSON.parse(user) }));
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
