"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, LayoutDashboard, LogOut, Menu, Package, ShieldCheck, X } from "lucide-react";

import { getCurrentUser } from "@/services/authService";
import { logoutAndClear } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/vendors", label: "Vendor Requests", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: BarChart3 },
  { href: "/admin/categories", label: "Categories", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: BarChart3 },
  { href: "/vendor/dashboard", label: "Vendor Workspace", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const verifyAdmin = async () => {
      try {
        const response = await getCurrentUser();
        const role = response.user?.role || response.role;

        if (!active) return;
        if (role !== "admin") {
          router.replace(role ? "/" : "/login");
          return;
        }

        setAuthorized(true);
      } catch {
        if (active) router.replace("/login");
      } finally {
        if (active) setChecking(false);
      }
    };

    void verifyAdmin();

    return () => {
      active = false;
    };
  }, [router]);

  const signOut = () => {
    dispatch(logoutAndClear());
    router.replace("/login");
  };

  if (checking || !authorized) {
    return <main className="admin-shell flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking admin access...</main>;
  }

  return (
    <div className="admin-shell min-h-screen bg-slate-50 lg:flex">
      <button type="button" aria-label="Open admin navigation" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-20 rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden">
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && <button type="button" aria-label="Close admin navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-slate-950 px-5 py-6 text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link href="/admin" onClick={() => setOpen(false)} className="text-lg font-bold tracking-tight">Market Admin</Link>
          <button type="button" aria-label="Close admin navigation" onClick={() => setOpen(false)} className="rounded-md p-1 text-slate-300 hover:bg-white/10 lg:hidden"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <nav className="mt-10 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</Link>;
          })}
        </nav>
        <button type="button" onClick={signOut} className="mt-10 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
      </aside>
      <div className="min-w-0 flex-1 pt-2 lg:pt-0">{children}</div>
    </div>
  );
}
