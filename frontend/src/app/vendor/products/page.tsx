"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteProduct } from "@/services/productService";
import { getVendorProducts } from "@/services/vendorProductService";
import type { ProductDetails } from "@/store/features/productDetailsSlice";

export default function VendorProductsPage() {
	const [products, setProducts] = useState<ProductDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadProducts = async () => {
		setLoading(true);
		try {
			const response = await getVendorProducts();
			setProducts(response.products);
			setError(null);
		} catch {
			setError("Unable to load your products.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let active = true;

		const loadInitialProducts = async () => {
			setLoading(true);
			try {
				const response = await getVendorProducts();
				if (active) {
					setProducts(response.products);
					setError(null);
				}
			} catch {
				if (active) setError("Unable to load your products.");
			} finally {
				if (active) setLoading(false);
			}
		};

		void loadInitialProducts();
		return () => {
			active = false;
		};
	}, []);

	const handleDelete = async (id: string) => {
		if (!window.confirm("Delete this product?")) return;

		try {
			await deleteProduct(id);
			setProducts((current) => current.filter((product) => product._id !== id));
		} catch {
			setError("Unable to delete this product.");
		}
	};

	return (
		<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div><p className="text-sm text-slate-500">Inventory</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Products</h1></div>
				<div className="flex gap-3"><button type="button" onClick={() => void loadProducts()} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button><Link href="/vendor/products/create" className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Add product</Link></div>
			</div>

			{error && <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
			{loading && <p className="mt-8 text-sm text-slate-500">Loading products...</p>}
			{!loading && products.length === 0 && <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No products yet. Add your first product to start selling.</div>}
			{!loading && products.length > 0 && (
				<div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
					<div className="hidden grid-cols-[1fr_140px_140px_120px] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid"><span>Product</span><span>Price</span><span>Stock</span><span>Actions</span></div>
					{products.map((product) => <div key={product._id} className="grid gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_140px_140px_120px] sm:items-center sm:gap-4"><div><p className="font-semibold text-slate-900">{product.name}</p><p className="mt-1 text-sm text-slate-500">{product.description}</p></div><p className="text-sm">PKR {product.price.toLocaleString()}</p><p className={`text-sm font-medium ${product.stock <= 5 ? "text-amber-700" : "text-emerald-700"}`}>{product.stock} available</p><button type="button" onClick={() => void handleDelete(product._id)} className="w-fit text-sm font-semibold text-red-600 hover:text-red-800">Delete</button></div>)}
				</div>
			)}
		</main>
	);
}
