"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { fetchOrderById } from "@/store/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function OrderDetailsPage() {
	const params = useParams<{ id: string }>();
	const dispatch = useAppDispatch();
	const { selectedOrder, loading, error } = useAppSelector(
		(state) => state.orders
	);

	useEffect(() => {
		if (params.id) {
			void dispatch(fetchOrderById(params.id));
		}
	}, [dispatch, params.id]);

	if (loading) {
		return (
			<main className="mx-auto max-w-6xl px-4 py-10">
				<p className="text-sm text-muted-foreground">Loading order...</p>
			</main>
		);
	}

	if (error) {
		return (
			<main className="mx-auto max-w-6xl px-4 py-10">
				<div
					role="alert"
					className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
				>
					{error}
				</div>
				<Link
					href="/orders"
					className="mt-5 inline-block text-sm font-medium underline"
				>
					Back to My Orders
				</Link>
			</main>
		);
	}

	if (!selectedOrder) {
		return (
			<main className="mx-auto max-w-6xl px-4 py-10">
				<h1 className="text-2xl font-bold">Order not found</h1>
				<Link
					href="/orders"
					className="mt-5 inline-block text-sm font-medium underline"
				>
					Back to My Orders
				</Link>
			</main>
		);
	}

	const order = selectedOrder;

	return (
		<main className="mx-auto max-w-6xl px-4 py-10">
			<div className="mb-8">
				<Link
					href="/orders"
					className="text-sm text-muted-foreground hover:text-slate-900"
				>
					Back to My Orders
				</Link>

				<div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<p className="text-sm text-muted-foreground">Order</p>
						<h1 className="mt-1 text-3xl font-bold tracking-tight">
							{order.orderNumber}
						</h1>
					</div>

					<span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">
						{order.orderStatus}
					</span>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-[1fr_360px]">
				<div className="space-y-8">
					<section className="rounded-lg border border-slate-200 bg-white p-6">
						<h2 className="text-xl font-semibold">Ordered Products</h2>

						<div className="mt-6 divide-y divide-slate-200">
							{order.items.map((item, index) => (
								<div
									key={`${item.product}-${index}`}
									className="flex gap-4 py-5 first:pt-0 last:pb-0"
								>
									<div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
										{item.image ? (
											<Image
												src={item.image}
												alt={item.name}
												width={80}
												height={80}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full items-center justify-center text-xs text-muted-foreground">
												No image
											</div>
										)}
									</div>

									<div className="min-w-0 flex-1">
										<h3 className="font-medium">{item.name}</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											Quantity: {item.quantity}
										</p>
										<p className="mt-2 text-sm font-medium">
											PKR {item.price.toLocaleString()}
										</p>
									</div>

									<div className="text-right">
										<p className="text-sm text-muted-foreground">Subtotal</p>
										<p className="mt-1 font-semibold">
											PKR {item.subtotal.toLocaleString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</section>

					<section className="rounded-lg border border-slate-200 bg-white p-6">
						<h2 className="text-xl font-semibold">Shipping Address</h2>
						<div className="mt-5 text-sm text-slate-600">
							<p className="font-medium text-slate-900">
								{order.shippingAddress.fullName}
							</p>
							<p className="mt-2">{order.shippingAddress.phone}</p>
							<p className="mt-2">{order.shippingAddress.address}</p>
							<p className="mt-1">{order.shippingAddress.city}</p>
						</div>
					</section>
				</div>

				<aside className="h-fit rounded-lg border border-slate-200 bg-white p-6">
					<h2 className="text-xl font-semibold">Order Summary</h2>

					<div className="mt-6 space-y-4 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span>PKR {order.subtotal.toLocaleString()}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Shipping</span>
							<span>PKR {order.shippingFee.toLocaleString()}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Tax</span>
							<span>PKR {order.tax.toLocaleString()}</span>
						</div>
						<div className="flex justify-between border-t pt-4 text-base">
							<span className="font-semibold">Total</span>
							<span className="font-bold">
								PKR {order.totalAmount.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="mt-6 border-t pt-5 text-sm">
						<p className="text-muted-foreground">Payment</p>
						<p className="mt-1 font-medium capitalize">{order.paymentMethod}</p>
						<p className="mt-3 text-muted-foreground">Payment Status</p>
						<p className="mt-1 font-medium capitalize">{order.paymentStatus}</p>
					</div>
				</aside>
			</div>
		</main>
	);
}
