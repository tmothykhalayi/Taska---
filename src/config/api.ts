const PRODUCTION_FALLBACK_API_URL = 'https://healthcare-connect-dwg6.onrender.com';

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, '');

const envApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = envApiUrl
  ? normalizeBaseUrl(envApiUrl)
  : import.meta.env.DEV
    ? '/api'
    : PRODUCTION_FALLBACK_API_URL;