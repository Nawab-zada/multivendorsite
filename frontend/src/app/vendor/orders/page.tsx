"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getVendorOrders, type VendorOrder } from "@/services/vendorOrderService";

export default function VendorOrdersPage() {
	const [orders, setOrders] = useState<VendorOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getVendorOrders().then((response) => setOrders(response.orders)).catch(() => setError("Unable to load vendor orders.")).finally(() => setLoading(false));
	}, []);

	return (
		<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<p className="text-sm text-slate-500">Fulfillment</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Vendor Orders</h1>
			{error && <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
			{loading && <p className="mt-8 text-sm text-slate-500">Loading orders...</p>}
			{!loading && !error && orders.length === 0 && <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No vendor orders yet.</div>}
			{!loading && orders.length > 0 && <div className="mt-8 space-y-3">{orders.map((order) => <Link key={order._id} href={`/vendor/orders/${order._id}`} className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-400"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="font-semibold">{order.customerOrder?.orderNumber || order._id}</p><p className="mt-1 text-sm text-slate-500">{order.customer?.name || "Customer"}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">{order.orderStatus}</span><p className="font-semibold">PKR {(order.totalAmount || 0).toLocaleString()}</p></div></Link>)}</div>}
		</main>
	);
}
