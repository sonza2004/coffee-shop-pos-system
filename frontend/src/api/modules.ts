import api from "./client";

// AUTH
export const AuthAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
};

// PRODUCTS
export const ProductAPI = {
  getAll: () => api.get("/products"),
};

// ORDERS
export const OrderAPI = {
  create: (items: { productId: string; qty: number }[]) =>
    api.post("/orders", { items }),
};

// PAYMENTS
export const PaymentAPI = {
  uploadSlip: (formData: FormData) =>
    api.post("/payments/slip", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  approve: (id: string) => api.post(`/payments/${id}/approve`),
  reject: (id: string) => api.post(`/payments/${id}/reject`),

  getPending: () => api.get("/payments/pending"),
};

// REPORTS
export const ReportAPI = {
  getDaily: () => api.get("/reports/daily"),
};
