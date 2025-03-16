const API_ENDPOINTS = {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
    },
    USER: {
      GET: (id) => `/users/${id}`,
      UPDATE: (id) => `/users/${id}`,
      DELETE: (id) => `/users/${id}`,
    },
    CATEGORY: {
      GET_ALL: "/categories",
      CREATE: "/categories",
      UPDATE: (id) => `/categories/${id}`,
      DELETE: (id) => `/categories/${id}`,
      BULK_UPDATE: "/categories/bulk-update", 
    },
  };
  
  export default API_ENDPOINTS;
  