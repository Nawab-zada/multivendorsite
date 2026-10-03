"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  PackageCheck,
  Plus,
  ShoppingBag,
  Store,
} from "lucide-react";

import { getVendorOrders, type VendorOrder } from "@/services/vendorOrderService";
import { getVendorProducts } from "@/services/vendorProductService";
import type { ProductDetails } from "@/store/features/productDetailsSlice";

const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;
const normalize = (value?: string) => String(value || "pending").toLowerCase();

export default function VendorDashboardPage() {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productResult, orderResult] = await Promise.allSettled([
        getVendorProducts(),
        getVendorOrders(),
      ]);

      if (productResult.status === "fulfilled") {
        setProducts(productResult.value.products);
      }
      if (orderResult.status === "fulfilled") {
        setOrders(orderResult.value.orders);
      }

      const failedResult = [productResult, orderResult].find(
        (result) => result.status === "rejected"
      );
      if (failedResult?.status === "rejected") {
        setError(
          (failedResult.reason as { response?: { data?: { message?: string } } })
            .response?.data?.message || "Unable to load some dashboard data."
        );
      }
    } catch (requestError: unknown) {
      setError(
        (requestError as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      await loadDashboard();
    };
    void initializeDashboard();
  }, [loadDashboard]);

  const analytics = useMemo(() => {
    const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 5);
    const outOfStockProducts = products.filter((product) => product.stock <= 0);
    const pendingOrders = orders.filter((order) => ["pending", "confirmed", "processing"].includes(normalize(order.orderStatus)));
    const deliveredOrders = orders.filter((order) => normalize(order.orderStatus) === "delivered");
    const revenue = orders
      .filter((order) => normalize(order.paymentStatus || order.customerOrder?.paymentStatus) === "paid")
      .reduce((total, order) => total + Number(order.totalAmount || 0), 0);

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders: pendingOrders.length,
      deliveredOrders: deliveredOrders.length,
      lowStockProducts,
      outOfStockProducts,
      revenue,
    };
  }, [orders, products]);

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-10">
        <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A98552]">Vendor workspace</p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.03em] text-[#181714] md:text-5xl">Your store at a glance</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#777168]">Manage products, follow orders and keep an eye on the health of your store.</p>
          </div>
          <Link href="/vendor/products/create" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#34382F] px-5 text-sm font-semibold text-white transition hover:bg-[#272B24] lg:self-auto"><Plus className="h-4 w-4" />Add product</Link>
        </header>

        {error && <div role="alert" className="mt-7 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => void loadDashboard()} className="font-semibold underline underline-offset-4">Try again</button></div>}

        <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Orders" value={analytics.totalOrders} loading={loading} icon={ShoppingBag} tone="green" />
          <MetricCard title="Revenue" value={formatCurrency(analytics.revenue)} loading={loading} icon={CircleDollarSign} tone="gold" />
          <MetricCard title="Products" value={analytics.totalProducts} loading={loading} icon={Boxes} tone="stone" />
          <MetricCard title="Pending Orders" value={analytics.pendingOrders} loading={loading} icon={ClipboardList} tone="gold" />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_370px]">
          <div className="rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] p-6 lg:p-7">
            <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A98552]">Store performance</p><h2 className="mt-2 text-xl font-semibold text-[#181714]">Sales overview</h2><p className="mt-1 text-sm text-[#777168]">Current performance based on your vendor orders.</p></div><Store className="h-5 w-5 text-[#A98552]" /></div>
            <div className="mt-7 rounded-2xl bg-[#34382F] p-6 text-white sm:p-7"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[0.16em] text-[#CFC9BE]">Paid order revenue</p><p className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{loading ? "-" : formatCurrency(analytics.revenue)}</p></div><CircleDollarSign className="h-9 w-9 text-[#B89560]" strokeWidth={1.5} /></div></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3"><SmallMetric title="Delivered" value={analytics.deliveredOrders} icon={PackageCheck} /><SmallMetric title="Pending" value={analytics.pendingOrders} icon={ClipboardList} /><SmallMetric title="Products" value={analytics.totalProducts} icon={Boxes} /></div>
          </div>

          <aside className="rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] p-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A98552]">Workspace</p><h2 className="mt-2 text-xl font-semibold text-[#181714]">Quick actions</h2><div className="mt-6 space-y-2"><QuickAction href="/vendor/products/create" title="Add new product" icon={Plus} /><QuickAction href="/vendor/products" title="Manage products" icon={Boxes} /><QuickAction href="/vendor/orders" title="View orders" icon={ShoppingBag} /></div><div className="mt-6 rounded-xl bg-[#F1E8D8] p-5"><Store className="h-5 w-5 text-[#9A743C]" /><h3 className="mt-4 font-semibold text-[#181714]">Grow your store</h3><p className="mt-2 text-sm leading-6 text-[#777168]">Keep your catalogue current and make sure products remain in stock for customers.</p><Link href="/vendor/products/create" className="mt-5 flex items-center justify-between rounded-lg bg-[#A98552] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#927344]">Add product<ArrowRight className="h-4 w-4" /></Link></div></aside>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3"><InventoryCard title="In stock" value={analytics.totalProducts - analytics.lowStockProducts.length - analytics.outOfStockProducts.length} description="Products with healthy inventory." status="good" /><InventoryCard title="Low stock" value={analytics.lowStockProducts.length} description="Products with 5 or fewer units remaining." status="warning" /><InventoryCard title="Out of stock" value={analytics.outOfStockProducts.length} description="Products currently unavailable to customers." status="danger" /></section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3]"><div className="flex items-center justify-between gap-4 border-b border-[#E7E1D7] px-6 py-5 lg:px-7"><div><div className="flex items-center gap-2.5"><ShoppingBag className="h-4 w-4 text-[#A98552]" /><h2 className="font-semibold text-[#181714]">Recent orders</h2></div><p className="mt-1.5 text-xs text-[#777168]">Your latest customer orders.</p></div><Link href="/vendor/orders" className="group flex items-center gap-2 text-sm font-medium text-[#777168] transition hover:text-[#181714]">View all<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link></div><div className="hidden grid-cols-[1.2fr_1fr_120px_150px] border-b border-[#E7E1D7] bg-[#F5F1E9] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A847B] md:grid"><span>Order</span><span>Status</span><span>Items</span><span className="text-right">Amount</span></div>{loading ? <OrdersSkeleton /> : orders.length > 0 ? <div>{orders.slice(0, 5).map((order) => <Link key={order._id} href={`/vendor/orders/${order._id}`} className="group grid gap-3 border-b border-[#EEE8DE] px-6 py-5 transition last:border-b-0 hover:bg-[#F7F3EC] md:grid-cols-[1.2fr_1fr_120px_150px] md:items-center lg:px-7"><div><p className="font-medium text-[#181714]">{order.customerOrder?.orderNumber ? `#${order.customerOrder.orderNumber}` : `#${order._id.slice(-6).toUpperCase()}`}</p>{order.customer?.name && <p className="mt-1 text-xs text-[#777168]">{order.customer.name}</p>}</div><div><OrderStatus status={order.orderStatus} /></div><p className="text-sm text-[#5E594F]">{order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? "item" : "items"}</p><div className="flex items-center justify-between md:justify-end"><span className="text-xs text-[#8A847B] md:hidden">Amount</span><span className="font-semibold text-[#181714]">{formatCurrency(Number(order.totalAmount ?? 0))}</span></div></Link>)}</div> : <EmptyOrders />}</section>

        {(analytics.lowStockProducts.length > 0 || analytics.outOfStockProducts.length > 0) && <section className="mt-5 rounded-2xl border border-[#DFCDA7] bg-[#F7F0E2] p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EADDBE]"><AlertTriangle className="h-5 w-5 text-[#906E38]" /></div><div><h2 className="font-semibold text-[#181714]">Inventory needs attention</h2><p className="mt-1 text-sm leading-6 text-[#777168]">{analytics.lowStockProducts.length} low-stock and {analytics.outOfStockProducts.length} out-of-stock products may need updating.</p></div></div><Link href="/vendor/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E542F] transition hover:text-[#181714]">Manage inventory<ArrowRight className="h-4 w-4" /></Link></div></section>}
      </div>
    </main>
  );
}

function MetricCard({ title, value, icon: Icon, loading, tone }: { title: string; value: string | number; icon: typeof ShoppingBag; loading: boolean; tone: "green" | "gold" | "stone" }) {
  const tones = { green: "bg-[#E5ECE5] text-[#44614A]", gold: "bg-[#F0E7D7] text-[#9B753E]", stone: "bg-[#E9E8E4] text-[#5D615D]" };
  return <article className="group rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#CEC4B4]"><div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-[18px] w-[18px]" /></div><ArrowRight className="h-4 w-4 text-[#C5BEB3] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" /></div><div className="mt-7"><p className="text-sm text-[#777168]">{title}</p>{loading ? <div className="mt-2 h-9 w-24 animate-pulse rounded bg-[#ECE7DE]" /> : <p className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[#181714]">{value}</p>}</div></article>;
}

function SmallMetric({ title, value, icon: Icon }: { title: string; value: number; icon: typeof Boxes }) {
  return <div className="rounded-xl border border-[#E8E2D8] bg-[#F5F2EC] p-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAE5DC]"><Icon className="h-4 w-4 text-[#777168]" /></div><p className="mt-5 text-xs text-[#777168]">{title}</p><p className="mt-1.5 text-lg font-semibold text-[#181714]">{value}</p></div>;
}

function QuickAction({ href, title, icon: Icon }: { href: string; title: string; icon: typeof Plus }) {
  return <Link href={href} className="group flex items-center justify-between rounded-xl border border-[#E6DFD4] px-4 py-3.5 transition hover:border-[#CBBEA9] hover:bg-white"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1ECE2]"><Icon className="h-4 w-4 text-[#8B6A37]" /></div><span className="text-sm font-medium text-[#34382F]">{title}</span></div><ArrowRight className="h-4 w-4 text-[#AAA296] transition-transform group-hover:translate-x-0.5" /></Link>;
}

function InventoryCard({ title, value, description, status }: { title: string; value: number; description: string; status: "good" | "warning" | "danger" }) {
  const dot = { good: "bg-emerald-600", warning: "bg-[#C18B32]", danger: "bg-red-500" };
  return <article className="rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] p-6"><div className="flex items-center justify-between"><p className="text-sm font-medium text-[#4D4942]">{title}</p><span className={`h-2.5 w-2.5 rounded-full ${dot[status]}`} /></div><p className="mt-5 text-3xl font-semibold tracking-tight text-[#181714]">{value}</p><p className="mt-2 text-xs leading-5 text-[#777168]">{description}</p></article>;
}

function OrderStatus({ status }: { status?: string }) {
  const normalized = normalize(status);
  const styles: Record<string, string> = { pending: "bg-[#F4E8C8] text-[#87651F]", confirmed: "bg-[#E7EBE4] text-[#53634C]", processing: "bg-[#E8E5D9] text-[#69624F]", packed: "bg-[#E5E8E9] text-[#566066]", shipped: "bg-[#E1E9ED] text-[#486776]", delivered: "bg-[#E1EDE4] text-[#397049]", cancelled: "bg-[#F2E2E0] text-[#99483E]" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[normalized] || "bg-[#ECE9E3] text-[#68635B]"}`}>{normalized}</span>;
}

function OrdersSkeleton() {
  return <div className="divide-y divide-[#EEE8DE]">{[1, 2, 3, 4].map((row) => <div key={row} className="grid gap-4 px-7 py-5 md:grid-cols-[1.2fr_1fr_120px_150px]"><div className="h-5 w-28 animate-pulse rounded bg-[#ECE7DE]" /><div className="h-5 w-20 animate-pulse rounded bg-[#ECE7DE]" /><div className="h-5 w-12 animate-pulse rounded bg-[#ECE7DE]" /><div className="h-5 w-24 animate-pulse rounded bg-[#ECE7DE] md:ml-auto" /></div>)}</div>;
}

function EmptyOrders() {
  return <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0ECE4]"><ShoppingBag className="h-5 w-5 text-[#8B857B]" /></div><h3 className="mt-4 text-sm font-semibold text-[#181714]">No orders yet</h3><p className="mt-1 max-w-sm text-sm leading-6 text-[#777168]">New customer orders will appear here when people begin purchasing your products.</p></div>;
}
