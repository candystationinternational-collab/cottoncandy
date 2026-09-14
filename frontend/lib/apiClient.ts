// Typed fetch wrapper around the CandyStation ASP.NET Core API (backend/CandyStation.Api).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";
const TOKEN_KEY = "cs_token";
const ADMIN_TOKEN_KEY = "cs_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: "customer" | "admin" } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (options.auth === "customer") {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } else if (options.auth === "admin") {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

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
      // ignore non-JSON error bodies
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---- Types (mirror backend DTOs) ----

export type ProductVariant = { id: number; name: string; price: number };
export type Product = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  description: string | null;
  ingredients: string | null;
  servingSize: string | null;
  calories: number | null;
  fat: string | null;
  carbs: string | null;
  protein: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string;
  weight: string | null;
  flavorTags: string[];
  images: string[];
  candyColor: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
};

export type Category = { id: number; name: string; description: string | null; displayOrder: number };

export type BundleItem = { productId: number; productName: string; candyColor: string; images: string[]; quantity: number };
export type Bundle = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  items: BundleItem[];
};

export type DeliveryZone = { id: number; name: string; description: string | null; cost: number; enabled: boolean };

export type HeroSlideItem = { productId: number; name: string; image: string | null; candyColor: string };
export type HeroSlide = {
  id: number;
  backgroundColor: string;
  itemType: "product" | "bundle";
  productId: number | null;
  bundleId: number | null;
  title: string;
  titleOverride: string | null;
  subtitle: string | null;
  subtitleOverride: string | null;
  ctaLabel: string;
  ctaLabelOverride: string | null;
  linkUrl: string;
  candyColor: string;
  images: string[];
  items: HeroSlideItem[];
  price: number;
  compareAtPrice: number | null;
  displayOrder: number;
  status: "active" | "inactive";
};

export type Settings = {
  storeName: string;
  storeAddress: string | null;
  storePhone: string | null;
  storeEmail: string | null;
  storeHours: string | null;
  currency: string;
  pickupAddress: string | null;
  pickupHours: string | null;
  codEnabled: boolean;
  codMinOrder: number;
  codMaxOrder: number;
  codInstructions: string | null;
  taxRate: number;
  shippingPolicy: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
  returnRefundPolicy: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
};

export type AuthResponse = { token: string; name: string; email: string };
export type RegisterResponse = { email: string; message: string };
export type AdminAuthResponse = { token: string; username: string; displayName: string | null };
export type Address = {
  id: number;
  label: string | null;
  name: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
export type CustomerMe = { name: string; email: string; phone: string | null; addresses: Address[] };

export type OrderLine = { kind: "product" | "bundle"; productId?: number; variantId?: number; bundleId?: number; quantity: number };
export type ShippingAddress = {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
export type OrderCreateRequest = {
  items: OrderLine[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryZoneId?: number;
  shippingAddress?: ShippingAddress;
};
export type OrderItem = { productName: string; variantName: string; unitPrice: number; quantity: number; lineTotal: number };
export type OrderTimelineEntry = { status: string; changedAt: string };
export type Order = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  deliveryMethod: "delivery" | "pickup";
  status: string;
  timeline: OrderTimelineEntry[];
  placedAt: string;
  shippingAddress: ShippingAddress | null;
};

// ---- Catalog ----

export const apiClient = {
  getProducts: (params?: { categoryId?: number; search?: string; minPrice?: number; maxPrice?: number; tag?: string; sort?: string }) => {
    const qs = new URLSearchParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== "") qs.set(k, String(v));
      }
    }
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<Product[]>(`/api/products${suffix}`);
  },
  getProduct: (id: number) => request<Product>(`/api/products/${id}`),
  getProductBySlug: (slug: string) => request<Product>(`/api/products/${slug}`),
  getCategories: () => request<Category[]>("/api/categories"),
  getBundles: () => request<Bundle[]>("/api/bundles"),
  getBundle: (id: number) => request<Bundle>(`/api/bundles/${id}`),
  getDeliveryZones: () => request<DeliveryZone[]>("/api/delivery-zones"),
  getSettings: () => request<Settings>("/api/settings"),
  getHeroSlides: () => request<HeroSlide[]>("/api/hero-slides"),

  // ---- Auth ----
  register: (name: string, email: string, phone: string, password: string) =>
    request<RegisterResponse>("/api/auth/register", { method: "POST", body: { name, email, phone, password } }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password } }),
  verifyEmail: (token: string) => request<AuthResponse>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
  resendVerification: (email: string) =>
    request<{ message: string }>("/api/auth/resend-verification", { method: "POST", body: { email } }),
  forgotPassword: (email: string) =>
    request<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>("/api/auth/reset-password", { method: "POST", body: { token, newPassword } }),
  getMe: () => request<CustomerMe>("/api/customers/me", { auth: "customer" }),

  adminLogin: (username: string, password: string) =>
    request<AdminAuthResponse>("/api/admin/auth/login", { method: "POST", body: { username, password } }),

  // ---- Orders ----
  createOrder: (req: OrderCreateRequest) =>
    request<Order>("/api/orders", { method: "POST", body: req, auth: "customer" }),
  trackOrder: (number: string, email: string) =>
    request<Order>(`/api/orders/track?number=${encodeURIComponent(number)}&email=${encodeURIComponent(email)}`),
  getMyOrders: () => request<Order[]>("/api/orders/mine", { auth: "customer" }),
};

export { ApiError as default };
