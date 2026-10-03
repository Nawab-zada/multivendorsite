import api from "@/services/api";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  vendorStatus?: string;
  isVerified?: boolean;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt?: string;
  customer?: { name?: string; email?: string };
}

export interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive?: boolean;
  vendor?: { name?: string; email?: string } | string;
  category?: { name?: string } | string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CreateAdminCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface AdminTopVendor {
  _id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface AdminDashboard {
  totalCustomers: number;
  totalVendors: number;
  pendingVendors: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  topVendors: AdminTopVendor[];
}

interface AdminDashboardResponse {
  dashboard: AdminDashboard;
}

interface PendingVendorsResponse {
  vendors: Array<{
    _id: string;
    name: string;
    email: string;
    vendorStatus: string;
  }>;
}

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const response = await api.get<AdminDashboardResponse>("/admin/dashboard");

  return response.data.dashboard;
};

export const getPendingVendors = async () => {
  const response = await api.get<PendingVendorsResponse>("/admin/vendors/pending");

  return response.data.vendors;
};

export const approveVendor = async (vendorId: string) => {
  const response = await api.patch(`/admin/vendors/${vendorId}/approve`);

  return response.data;
};

export const rejectVendor = async (vendorId: string) => {
  const response = await api.patch(`/admin/vendors/${vendorId}/reject`);

  return response.data;
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get<{ users: AdminUser[] }>("/admin/users");

  return response.data.users;
};

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  const response = await api.get<{ orders: AdminOrder[] }>("/admin/orders");

  return response.data.orders;
};

export const getAdminProducts = async (): Promise<AdminProduct[]> => {
  const response = await api.get<{ products: AdminProduct[] }>("/products?limit=100");

  return response.data.products;
};

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const response = await api.get<{ categories: AdminCategory[] }>("/categories/manage/all");

  return response.data.categories;
};

export const createAdminCategory = async (data: CreateAdminCategoryPayload) => {
  const response = await api.post("/categories", data);

  return response.data.category as AdminCategory;
};

export const updateAdminCategoryStatus = async (id: string, isActive: boolean) => {
  const response = await api.patch<{ category: AdminCategory }>(`/categories/${id}`, { isActive });

  return response.data.category;
};
