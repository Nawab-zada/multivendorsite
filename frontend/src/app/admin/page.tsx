"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  getAdminDashboard,
  type AdminDashboard,
} from "@/services/adminService";

const formatCurrency = (amount: number) =>
  `PKR ${amount.toLocaleString()}`;

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (requestError: unknown) {
      const message =
        (
          requestError as {
            response?: { data?: { message?: string } };
          }
        ).response?.data?.message ||
        "Unable to load the admin dashboard.";

      setError(message);
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

  const metrics = [
    { label: "Total Customers", value: dashboard?.totalCustomers, icon: Users, accent: "green" },
    { label: "Total Vendors", value: dashboard?.totalVendors, icon: Store, accent: "gold" },
    { label: "Total Products", value: dashboard?.totalProducts, icon: Boxes, accent: "stone" },
    { label: "Total Orders", value: dashboard?.totalOrders, icon: ClipboardList, accent: "gold" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-10">
        <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A98552]">Overview</p>
            <h1 className="font-serif text-4xl font-medium tracking-[-0.03em] text-[#181714] md:text-5xl">Welcome back, Admin</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#777168]">Here&apos;s what&apos;s happening across your marketplace today.</p>
          </div>
          <button type="button" onClick={() => void loadDashboard()} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg border border-[#D8D0C3] bg-[#FAF8F3] px-4 text-sm font-medium text-[#34382F] transition hover:border-[#A98552] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        </header>

        {error && <div role="alert" className="mt-7 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => void loadDashboard()} className="font-semibold underline underline-offset-4">Try again</button></div>}

        <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, accent }) => <MetricCard key={label} label={label} value={loading ? undefined : value} icon={Icon} accent={accent} />)}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_380px]">
          <div className="rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] p-6 lg:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1ECE2]"><TrendingUp className="h-5 w-5 text-[#A98552]" /></div><div><h2 className="font-semibold text-[#181714]">Marketplace performance</h2><p className="mt-0.5 text-xs text-[#777168]">Current marketplace activity</p></div></div>
              <span className="w-fit rounded-full border border-[#D8D0C3] px-3 py-1.5 text-xs text-[#777168]">Live overview</span>
            </div>
            <div className="mt-8 rounded-2xl bg-[#34382F] p-6 text-[#FAF8F3] sm:p-7"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.15em] text-[#C9C2B6]">Total marketplace revenue</p><p className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{loading ? "-" : formatCurrency(dashboard?.totalRevenue ?? 0)}</p></div><CircleDollarSign className="h-9 w-9 text-[#A98552]" strokeWidth={1.5} /></div></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3"><HealthItem label="Revenue" value={loading ? "-" : formatCurrency(dashboard?.totalRevenue ?? 0)} icon={CircleDollarSign} /><HealthItem label="Pending orders" value={loading ? "-" : dashboard?.pendingOrders ?? 0} icon={ClipboardList} /><HealthItem label="Vendor approvals" value={loading ? "-" : dashboard?.pendingVendors ?? 0} icon={ShieldCheck} /></div>
          </div>

          <aside className="flex flex-col rounded-2xl border border-[#DCC99F] bg-[#F6F0E3] p-6 lg:p-7"><div className="flex items-start justify-between gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE1C7]"><ShieldCheck className="h-5 w-5 text-[#8B6A37]" /></div>{!loading && (dashboard?.pendingVendors ?? 0) > 0 && <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#A98552] px-2 text-xs font-semibold text-white">{dashboard?.pendingVendors}</span>}</div><div className="mt-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B6A37]">Needs attention</p><h2 className="mt-3 text-xl font-semibold tracking-tight text-[#181714]">Vendor applications</h2><p className="mt-2 text-sm leading-6 text-[#777168]">Review businesses waiting to become part of the Velora marketplace.</p></div><div className="my-8 border-t border-[#DED0B2]" /><div><p className="text-5xl font-semibold tracking-[-0.04em] text-[#181714]">{loading ? "-" : dashboard?.pendingVendors ?? 0}</p><p className="mt-2 text-sm text-[#777168]">pending {(dashboard?.pendingVendors ?? 0) === 1 ? "application" : "applications"}</p></div><Link href="/admin/vendors" className="mt-auto flex items-center justify-between border-t border-[#DED0B2] pt-5 text-sm font-semibold text-[#181714] transition hover:text-[#8B6A37]">Review pending vendors<ArrowRight className="h-4 w-4" /></Link></aside>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3]"><div className="flex items-center justify-between gap-4 border-b border-[#E7E1D7] px-6 py-5 lg:px-7"><div><div className="flex items-center gap-2.5"><Store className="h-4 w-4 text-[#A98552]" /><h2 className="font-semibold text-[#181714]">Top vendors</h2></div><p className="mt-1.5 text-xs text-[#777168]">Vendor performance based on paid orders.</p></div><Link href="/admin/vendors" className="group flex items-center gap-2 text-sm font-medium text-[#777168] transition hover:text-[#181714]">View all<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link></div><div className="hidden grid-cols-[1fr_160px_180px] border-b border-[#E7E1D7] bg-[#F5F1E9] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A847B] sm:grid"><span>Vendor</span><span>Orders</span><span className="text-right">Revenue</span></div>{loading ? <VendorSkeleton /> : dashboard?.topVendors && dashboard.topVendors.length > 0 ? <div>{dashboard.topVendors.slice(0, 5).map((vendor, index) => <div key={vendor.vendorId} className="grid gap-3 border-b border-[#EEE8DE] px-6 py-5 last:border-b-0 sm:grid-cols-[1fr_160px_180px] sm:items-center lg:px-7"><div className="flex items-center gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ECE7DD] text-xs font-semibold text-[#5E594F]">{index + 1}</div><p className="font-medium text-[#181714]">{vendor.vendorName}</p></div><div><span className="text-xs text-[#8A847B] sm:hidden">Orders </span><span className="text-sm text-[#4D4942]">{vendor.totalOrders}</span></div><p className="text-sm font-semibold text-[#181714] sm:text-right">{formatCurrency(vendor.totalRevenue)}</p></div>)}</div> : <EmptyVendors />}</section>

        <section className="mt-5"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A98552]">Manage</p><h2 className="mt-1 text-lg font-semibold text-[#181714]">Marketplace</h2></div></div><nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><ManagementLink label="Users" href="/admin/users" icon={Users} /><ManagementLink label="Vendors" href="/admin/vendors" icon={Store} /><ManagementLink label="Products" href="/admin/products" icon={Boxes} /><ManagementLink label="Categories" href="/admin/categories" icon={ShoppingBag} /><ManagementLink label="Orders" href="/admin/orders" icon={ClipboardList} /></nav></section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, icon: Icon, accent }: { label: string; value?: number; icon: typeof Users; accent: string }) {
  const iconStyle = accent === "green" ? "bg-[#E5ECE5] text-[#44614A]" : accent === "gold" ? "bg-[#F0E7D7] text-[#9B753E]" : "bg-[#E9E8E4] text-[#5D615D]";
  return <article className="group rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#CEC4B4]"><div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}><Icon className="h-[18px] w-[18px]" /></div><ArrowRight className="h-4 w-4 text-[#C5BEB3] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" /></div><div className="mt-7"><p className="text-sm text-[#777168]">{label}</p>{value === undefined ? <div className="mt-2 h-9 w-16 animate-pulse rounded-md bg-[#ECE7DE]" /> : <p className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[#181714]">{value.toLocaleString()}</p>}</div></article>;
}

function HealthItem({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof CircleDollarSign }) {
  return <div className="rounded-xl border border-[#E8E2D8] bg-[#F5F2EC] p-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAE5DC]"><Icon className="h-4 w-4 text-[#777168]" /></div><p className="mt-5 text-xs text-[#777168]">{label}</p><p className="mt-1.5 text-lg font-semibold tracking-tight text-[#181714]">{value}</p></div>;
}

function ManagementLink({ label, href, icon: Icon }: { label: string; href: string; icon: typeof Users }) {
  return <Link href={href} className="group flex items-center justify-between rounded-xl border border-[#E1DBD0] bg-[#FAF8F3] px-4 py-4 transition hover:border-[#C7BBA8] hover:bg-white"><div className="flex items-center gap-3"><Icon className="h-4 w-4 text-[#777168] transition group-hover:text-[#A98552]" /><span className="text-sm font-medium text-[#34382F]">{label}</span></div><ArrowRight className="h-4 w-4 text-[#BBB3A7] transition group-hover:translate-x-0.5 group-hover:text-[#A98552]" /></Link>;
}

function VendorSkeleton() {
  return <div className="divide-y divide-[#EEE8DE]">{[1, 2, 3].map((item) => <div key={item} className="grid gap-4 px-7 py-5 sm:grid-cols-[1fr_160px_180px]"><div className="h-5 w-40 animate-pulse rounded bg-[#ECE7DE]" /><div className="h-5 w-12 animate-pulse rounded bg-[#ECE7DE]" /><div className="h-5 w-24 animate-pulse rounded bg-[#ECE7DE] sm:ml-auto" /></div>)}</div>;
}

function EmptyVendors() {
  return <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0ECE4]"><Store className="h-5 w-5 text-[#8B857B]" /></div><h3 className="mt-4 text-sm font-semibold text-[#181714]">No vendor performance yet</h3><p className="mt-1 max-w-sm text-sm leading-6 text-[#777168]">Vendor performance will appear here once paid marketplace orders begin coming in.</p></div>;
}
