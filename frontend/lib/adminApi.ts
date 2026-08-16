// Typed fetch wrapper around the /api/admin/* endpoints.

import { getAdminToken, setAdminToken, ApiError } from "@/lib/apiClient";
import type { Product, Category, Bundle, DeliveryZone, Settings, Order } from "@/lib/apiClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message ?? data.title ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type AdminAuthResponse = { token: string; username: string; displayName: string | null; role: "Admin" | "Delivery" };

export type StaffUser = { id: number; username: string; displayName: string | null; role: string; isActive: boolean };

export type AdminOrderListItem = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  deliveryMethod: string;
  placedAt: string;
};

export type Stats = {
  revenue: number;
  ordersCount: number;
  pendingCount: number;
  productsCount: number;
  lowStockCount: number;
  ordersByDay: { date: string; count: number }[];
  recentOrders: { orderNumber: string; customerName: string; total: number; status: string; placedAt: string }[];
  topProducts: { name: string; unitsSold: number }[];
  lowStockProducts: { name: string; stock: number }[];
};

export type CustomerAdmin = { id: number; name: string; email: string; phone: string | null; joinedDate: string; ordersCount: number; totalSpent: number };

export type ProductWrite = {
  categoryId: number;
  name: string;
  description: string | null;
  ingredients: string | null;
  servingSize: string | null;
  calories: number | null;
  fat: string | null;
  carbs: string | null;
  protein: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  stock: number;
  sku: string;
  weight: string | null;
  flavorTags: string[];
  candyColor: string;
  status: "active" | "inactive";
  variants: { id?: number; name: string; price: number }[];
};

export type CategoryWrite = { name: string; description: string | null; displayOrder: number; status: "active" | "inactive" };

export type BundleWrite = {
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  status: "active" | "inactive";
  items: { productId: number; quantity: number }[];
};

export type DeliveryZoneWrite = { name: string; description: string | null; cost: number; enabled: boolean };

export const adminApi = {
  login: (username: string, password: string) =>
    request<AdminAuthResponse>("/api/admin/auth/login", { method: "POST", body: { username, password } }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>("/api/admin/password", { method: "POST", body: { currentPassword, newPassword } }),

  // Staff (Admin-only)
  getStaff: () => request<StaffUser[]>("/api/admin/staff"),
  createStaff: (data: { username: string; password: string; displayName: string; role: string }) =>
    request<StaffUser>("/api/admin/staff", { method: "POST", body: data }),
  updateStaff: (id: number, data: { displayName: string; role: string; isActive: boolean }) =>
    request<StaffUser>(`/api/admin/staff/${id}`, { method: "PUT", body: data }),
  resetStaffPassword: (id: number, newPassword: string) =>
    request<{ message: string }>(`/api/admin/staff/${id}/reset-password`, { method: "POST", body: { newPassword } }),
  deleteStaff: (id: number) => request<void>(`/api/admin/staff/${id}`, { method: "DELETE" }),

  // Stats (Admin-only)
  getStats: () => request<Stats>("/api/admin/stats"),

  // Products (Admin-only)
  getProducts: () => request<Product[]>("/api/admin/products"),
  getProduct: (id: number) => request<Product>(`/api/admin/products/${id}`),
  createProduct: (data: ProductWrite) => request<Product>("/api/admin/products", { method: "POST", body: data }),
  updateProduct: (id: number, data: ProductWrite) => request<Product>(`/api/admin/products/${id}`, { method: "PUT", body: data }),
  deleteProduct: (id: number) => request<void>(`/api/admin/products/${id}`, { method: "DELETE" }),

  // Categories (Admin-only)
  getCategories: () => request<Category[]>("/api/admin/categories"),
  createCategory: (data: CategoryWrite) => request<Category>("/api/admin/categories", { method: "POST", body: data }),
  updateCategory: (id: number, data: CategoryWrite) => request<Category>(`/api/admin/categories/${id}`, { method: "PUT", body: data }),
  reorderCategory: (id: number, displayOrder: number) =>
    request<Category>(`/api/admin/categories/${id}/display-order`, { method: "PATCH", body: { displayOrder } }),
  deleteCategory: (id: number) => request<void>(`/api/admin/categories/${id}`, { method: "DELETE" }),

  // Bundles (Admin-only)
  getBundles: () => request<Bundle[]>("/api/admin/bundles"),
  createBundle: (data: BundleWrite) => request<Bundle>("/api/admin/bundles", { method: "POST", body: data }),
  updateBundle: (id: number, data: BundleWrite) => request<Bundle>(`/api/admin/bundles/${id}`, { method: "PUT", body: data }),
  deleteBundle: (id: number) => request<void>(`/api/admin/bundles/${id}`, { method: "DELETE" }),

  // Delivery zones (Admin-only)
  getDeliveryZones: () => request<DeliveryZone[]>("/api/admin/delivery-zones"),
  createDeliveryZone: (data: DeliveryZoneWrite) => request<DeliveryZone>("/api/admin/delivery-zones", { method: "POST", body: data }),
  updateDeliveryZone: (id: number, data: DeliveryZoneWrite) =>
    request<DeliveryZone>(`/api/admin/delivery-zones/${id}`, { method: "PUT", body: data }),
  deleteDeliveryZone: (id: number) => request<void>(`/api/admin/delivery-zones/${id}`, { method: "DELETE" }),

  // Customers (Admin-only)
  getCustomers: (params?: { search?: string; sort?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.sort) qs.set("sort", params.sort);
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<CustomerAdmin[]>(`/api/admin/customers${suffix}`);
  },
  updateCustomer: (id: number, data: { name: string; phone: string | null }) =>
    request<CustomerAdmin>(`/api/admin/customers/${id}`, { method: "PUT", body: data }),

  // Settings (Admin-only)
  getSettings: () => request<Settings>("/api/admin/settings"),
  updateSettings: (data: Omit<Settings, "currency">) => request<Settings>("/api/admin/settings", { method: "PUT", body: data }),

  // Orders (Admin + Delivery)
  getOrders: (params?: { status?: string; search?: string; from?: string; to?: string }) => {
    const qs = new URLSearchParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    }
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<AdminOrderListItem[]>(`/api/admin/orders${suffix}`);
  },
  getOrder: (id: number) => request<Order>(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: number, status: string) =>
    request<Order>(`/api/admin/orders/${id}/status`, { method: "PUT", body: { status } }),
};

export { setAdminToken, getAdminToken };
