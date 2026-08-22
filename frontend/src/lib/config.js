const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || (isDevelopment ? "http://localhost:5001/api" : "/api");

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || (isDevelopment ? "http://localhost:5001" : window.location.origin);
