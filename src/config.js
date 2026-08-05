// Centralized API Base URL configuration
// Points to live Render backend API: https://simtechon-react.onrender.com
export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://simtechon-react.onrender.com' : '')
