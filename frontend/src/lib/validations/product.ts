import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters."),
  description: z.string().trim().min(5, "Description must be at least 5 characters."),
  price: z.number().positive("Price must be greater than zero."),
  stock: z.number().int().min(0, "Stock cannot be negative."),
  category: z.string().min(1, "Please select a category."),
  images: z.array(z.string().url("Enter valid image URLs.")).default([]),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;