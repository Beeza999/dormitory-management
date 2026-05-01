import axios from 'axios';

const ເອພີໄອ = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

const ອ່ານໂທເຄັນ = () => sessionStorage.getItem('token') || '';

ເອພີໄອ.interceptors.request.use((config) => {
  const token = ອ່ານໂທເຄັນ();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAssetUrl = (path = '') => {
  if (!path) return '';
  const rawBase = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';
  if (path.startsWith('http')) return path;
  return `${rawBase}${path}`;
};

export default ເອພີໄອ;
