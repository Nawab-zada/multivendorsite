"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";

import { getCurrentUser } from "@/services/authService";
import { logoutAndClear } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";

const links = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/products", label: "Products", icon: Package },
  { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const verifyVendor = async () => {
      try {
        const response = await getCurrentUser();
        const role = response.user?.role || response.role;

        if (!active) return;
        if (!["vendor", "admin"].includes(role)) {
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

    void verifyVendor();
    return () => {
      active = false;
    };
  }, [router]);

  const signOut = () => {
    dispatch(logoutAndClear());
    router.replace("/login");
  };

  if (checking || !authorized) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-slate-500">Checking vendor access...</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="w-full border-b border-slate-200 bg-white px-5 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <Link href="/vendor/dashboard" className="text-lg font-bold text-slate-950">Vendor Center</Link>
        <nav className="mt-8 flex gap-2 overflow-x-auto lg:block lg:space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</Link>;
          })}
        </nav>
        <button type="button" onClick={signOut} className="mt-8 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}