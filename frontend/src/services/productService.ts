import api from "@/lib/axios";
import type { AdminCategory } from "@/services/adminService";

export const getProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const getCategories = async (): Promise<AdminCategory[]> => {
  const response = await api.get<{ categories: AdminCategory[] }>("/categories");

  return response.data.categories;
};

export interface CreateProductPayload {
  name: string;
  description: string;
  brand?: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

export const createProduct = async (data: CreateProductPayload) => {
  const response = await api.post("/products", data);

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};
