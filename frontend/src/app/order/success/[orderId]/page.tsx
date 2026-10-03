"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { getOrderById } from "@/services/orderService";
import { useAppSelector } from "@/store/hooks";
import type { Order } from "@/types/order";

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const cachedOrder = useAppSelector((state) => state.checkout.order);
  const matchingCachedOrder =
    cachedOrder?._id === orderId || cachedOrder?.orderNumber === orderId
      ? cachedOrder
      : null;
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId) && !matchingCachedOrder);
  const order = matchingCachedOrder || fetchedOrder;

  useEffect(() => {
    if (!orderId) {
      return;
    }

    if (matchingCachedOrder) {
      return;
    }

    let active = true;

    const loadOrder = async () => {
      try {
        const response = await getOrderById(orderId);

        if (active) {
          setFetchedOrder(response.order);
        }
      } catch {
        if (active) {
          setFetchedOrder(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      active = false;
    };
  }, [matchingCachedOrder, orderId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Loading your order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Order information is unavailable
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Please check your orders to view your recent purchase.
        </p>

        <Link
          href="/orders"
          className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          View My Orders
        </Link>
      </main>
    );
  }

  const orderNumber = order.orderNumber || orderId;
  const paymentMethod = order.paymentMethod || order.paymentStatus || "COD";
  const orderStatus = order.orderStatus || "Processing";

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            Order Placed Successfully
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <div className="mt-10 grid gap-6 border-y border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="mt-1 font-semibold text-slate-900">{orderNumber}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="mt-1 font-semibold capitalize text-slate-900">
              {paymentMethod}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Order Status</p>
            <p className="mt-1 font-semibold capitalize text-slate-900">
              {orderStatus}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="mt-1 font-semibold text-slate-900">
              PKR {order.totalAmount?.toLocaleString() ?? "0"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Shipping Address</h2>

          <div className="mt-3 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            <p>{order.shippingAddress?.fullName || "-"}</p>
            <p className="mt-1">{order.shippingAddress?.phone || "-"}</p>
            <p className="mt-1">{order.shippingAddress?.address || "-"}</p>
            <p className="mt-1">{order.shippingAddress?.city || "-"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="flex-1 rounded-md bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-slate-800"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-md border border-slate-200 px-5 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
