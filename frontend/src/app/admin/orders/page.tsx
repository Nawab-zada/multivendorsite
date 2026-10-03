"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminOrders, type AdminOrder } from "@/services/adminService";

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<AdminOrder[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => { const load = async () => { try { setOrders(await getAdminOrders()); } finally { setLoading(false); } }; void load(); }, []);

	return <main className="px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">Back to dashboard</Link><h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Order Management</h1><p className="mt-2 text-sm text-slate-600">Monitor marketplace orders and payment status.</p><div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="hidden grid-cols-4 gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid"><span>Order</span><span>Customer</span><span>Status</span><span>Total</span></div>{loading && <p className="p-5 text-sm text-slate-500">Loading orders...</p>}{!loading && orders.map((order) => <div key={order._id} className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-4 sm:items-center sm:gap-4"><p className="font-medium text-slate-900">{order.orderNumber}</p><p className="text-sm text-slate-600">{order.customer?.name || order.customer?.email || "Customer"}</p><span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">{order.paymentStatus}</span><p className="font-semibold text-slate-900">PKR {order.totalAmount.toLocaleString()}</p></div>)}{!loading && orders.length === 0 && <p className="p-5 text-sm text-slate-500">No orders found.</p>}</div></div></main>;
}
