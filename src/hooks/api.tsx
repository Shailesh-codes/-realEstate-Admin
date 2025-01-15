// Define the API base URL as a constant
const api: string = `${import.meta.env.VITE_BACKEND_URL}`;

// Export as a named export
export { api };

// Also provide a default export for backward compatibility
export default api;