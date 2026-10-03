"use client";

import Link from "next/link";
import { useEffect } from "react";

import { fetchMyOrders } from "@/store/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function OrdersPage() {
	const dispatch = useAppDispatch();
	const { orders, loading, error } = useAppSelector(
		(state) => state.orders
	);

	useEffect(() => {
		void dispatch(fetchMyOrders());
	}, [dispatch]);

	return (
		<main className="mx-auto max-w-6xl px-4 py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					View and track your previous orders.
				</p>
			</div>

			{loading && (
				<div className="py-10 text-center text-sm text-muted-foreground">
					Loading your orders...
				</div>
			)}

			{error && (
				<div
					role="alert"
					className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
				>
					{error}
				</div>
			)}

			{!loading && !error && orders.length === 0 && (
				<div className="rounded-lg border border-slate-200 p-10 text-center">
					<h2 className="text-xl font-semibold">No orders yet</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Your completed purchases will appear here.
					</p>
					<Link
						href="/"
						className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
					>
						Start Shopping
					</Link>
				</div>
			)}

			{!loading && !error && orders.length > 0 && (
				<div className="space-y-4">
					{orders.map((order) => (
						<Link
							key={order._id}
							href={`/orders/${order._id}`}
							className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
						>
							<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
								<div>
									<p className="text-sm text-muted-foreground">Order</p>
									<p className="mt-1 font-semibold text-slate-900">
										{order.orderNumber}
									</p>
								</div>

								<div>
									<p className="text-sm text-muted-foreground">Status</p>
									<p className="mt-1 font-medium capitalize text-slate-900">
										{order.orderStatus}
									</p>
								</div>

								<div>
									<p className="text-sm text-muted-foreground">Total</p>
									<p className="mt-1 font-semibold text-slate-900">
										PKR {order.totalAmount.toLocaleString()}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</main>
	);
}
