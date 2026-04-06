const FALLBACK_API_URL = 'https://healthcare-connect-dwg6.onrender.com';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || FALLBACK_API_URL;