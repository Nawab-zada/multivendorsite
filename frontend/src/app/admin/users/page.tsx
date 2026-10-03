"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getAdminUsers, type AdminUser } from "@/services/adminService";

export default function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try { setUsers(await getAdminUsers()); } finally { setLoading(false); }
		};
		void load();
	}, []);

	return (
		<main className="px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">Back to dashboard</Link>
				<h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Users Management</h1>
				<p className="mt-2 text-sm text-slate-600">Review customer, vendor, and administrator accounts.</p>
				<div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
					<div className="hidden grid-cols-[1.5fr_1.5fr_1fr_1fr] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid"><span>Name</span><span>Email</span><span>Role</span><span>Status</span></div>
					{loading && <p className="p-5 text-sm text-slate-500">Loading users...</p>}
					{!loading && users.map((user) => <div key={user._id} className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1.5fr_1fr_1fr] sm:items-center sm:gap-4"><div><p className="font-medium text-slate-900">{user.name}</p><p className="text-xs text-slate-500 sm:hidden">{user.email}</p></div><p className="hidden text-sm text-slate-600 sm:block">{user.email}</p><span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">{user.role}</span><span className="text-xs text-slate-500">{user.isVerified ? "Verified" : "Unverified"}</span></div>)}
					{!loading && users.length === 0 && <p className="p-5 text-sm text-slate-500">No users found.</p>}
				</div>
			</div>
		</main>
	);
}
