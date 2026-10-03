"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminProducts, type AdminProduct } from "@/services/adminService";

export default function AdminProductsPage() {
	const [products, setProducts] = useState<AdminProduct[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => { const load = async () => { try { setProducts(await getAdminProducts()); } finally { setLoading(false); } }; void load(); }, []);

	return <main className="px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">Back to dashboard</Link><h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Product Management</h1><p className="mt-2 text-sm text-slate-600">Review catalog inventory and product availability.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{loading && <p className="text-sm text-slate-500">Loading products...</p>}{!loading && products.map((product) => <article key={product._id} className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-semibold text-slate-950">{product.name}</h2><span className={`rounded-full px-2 py-1 text-xs font-medium ${product.stock <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{product.stock} in stock</span></div><p className="mt-4 text-lg font-bold text-slate-950">PKR {product.price.toLocaleString()}</p><p className="mt-2 text-sm text-slate-500">{typeof product.vendor === "object" ? product.vendor?.name : "Vendor product"}</p></article>)}{!loading && products.length === 0 && <p className="text-sm text-slate-500">No products found.</p>}</div></div></main>;
}
