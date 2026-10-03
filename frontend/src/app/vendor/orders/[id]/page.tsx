"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getVendorOrderById, updateVendorOrderStatus, type VendorOrder } from "@/services/vendorOrderService";

const nextActions = [
	{ status: "confirm", label: "Confirm order", current: "pending" },
	{ status: "pack", label: "Mark packed", current: "confirmed" },
	{ status: "ship", label: "Mark shipped", current: "packed" },
	{ status: "deliver", label: "Mark delivered", current: "shipped" },
] as const;

export default function VendorOrderDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const [order, setOrder] = useState<VendorOrder | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadOrder = async () => {
		try {
			const response = await getVendorOrderById(id);
			setOrder(response.order);
		} catch {
			setError("Unable to load this vendor order.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!id) return;

		let active = true;
		const loadInitialOrder = async () => {
			try {
				const response = await getVendorOrderById(id);
				if (active) setOrder(response.order);
			} catch {
				if (active) setError("Unable to load this vendor order.");
			} finally {
				if (active) setLoading(false);
			}
		};

		void loadInitialOrder();
		return () => {
			active = false;
		};
	}, [id]);

	const updateStatus = async (status: (typeof nextActions)[number]["status"]) => {
		if (!order) return;
		try {
			const response = await updateVendorOrderStatus(order._id, status);
			setOrder(response.order);
		} catch {
			setError("Unable to update the order status.");
		}
	};

	if (loading) return <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-500">Loading order...</main>;
	if (!order) return <main className="mx-auto max-w-4xl px-4 py-10"><div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error || "Order not found."}</div><Link href="/vendor/orders" className="mt-5 inline-block text-sm font-semibold underline">Back to orders</Link></main>;

	const action = nextActions.find((item) => item.current === order.orderStatus);

	return <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"><Link href="/vendor/orders" className="text-sm text-slate-500 hover:text-slate-900">Back to orders</Link><div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">Customer order</p><h1 className="mt-1 text-3xl font-bold">{order.customerOrder?.orderNumber || order._id}</h1><p className="mt-2 text-sm text-slate-500">{order.customer?.name} {order.customer?.email ? `(${order.customer.email})` : ""}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">{order.orderStatus}</span></div>{error && <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<section className="mt-8 rounded-lg border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold">Items</h2><div className="mt-5 divide-y divide-slate-200">{(order.items || []).map((item, index) => <div key={`${item.snapshot?.name || "item"}-${index}`} className="flex justify-between gap-4 py-4 first:pt-0"><div><p className="font-medium">{item.snapshot?.name || "Product"}</p><p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p></div><p className="font-semibold">PKR {item.subtotal.toLocaleString()}</p></div>)}</div></section><section className="mt-6 flex flex-wrap gap-3">{action && <button type="button" onClick={() => void updateStatus(action.status)} className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{action.label}</button>}{order.orderStatus === "delivered" && <span className="rounded-md bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">Order delivered</span>}<button type="button" onClick={() => void loadOrder()} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Refresh</button></section></main>;
}
