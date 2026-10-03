"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

import {
	approveVendor,
	getPendingVendors,
	rejectVendor,
} from "@/services/adminService";

export default function AdminVendorsPage() {
	const [vendors, setVendors] = useState<Awaited<ReturnType<typeof getPendingVendors>>>([]);
	const [loading, setLoading] = useState(true);
	const [actionId, setActionId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const load = async () => {
		setError(null);
		try {
			setVendors(await getPendingVendors());
		} catch (requestError: unknown) {
			setError(
				(requestError as { response?: { data?: { message?: string } } })
					.response?.data?.message || "Unable to load vendor requests."
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const loadInitialVendors = async () => {
			try {
				setVendors(await getPendingVendors());
			} catch (requestError: unknown) {
				setError(
					(requestError as { response?: { data?: { message?: string } } })
						.response?.data?.message || "Unable to load vendor requests."
				);
			} finally {
				setLoading(false);
			}
		};

		void loadInitialVendors();
	}, []);

	const handleVendorAction = async (
		vendorId: string,
		action: typeof approveVendor
	) => {
		setActionId(vendorId);
		setError(null);
		try {
			await action(vendorId);
			await load();
		} catch (requestError: unknown) {
			setError(
				(requestError as { response?: { data?: { message?: string } } })
					.response?.data?.message || "Unable to update vendor request."
			);
		} finally {
			setActionId(null);
		}
	};

	return (
		<AdminSection title="Vendors" description="Review and manage vendor applications.">
			<div className="rounded-lg border border-slate-200 bg-white p-6">
				<h2 className="text-lg font-semibold">Pending applications</h2>
				{error && <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
				{loading && <p className="mt-5 text-sm text-slate-500">Loading vendors...</p>}
				{!loading && vendors.length === 0 && <p className="mt-5 text-sm text-slate-500">No pending vendor applications.</p>}
				<div className="mt-4 divide-y divide-slate-200">
					{vendors.map((vendor) => <div key={vendor._id} className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"><div><p className="font-medium">{vendor.name}</p><p className="text-sm text-slate-500">{vendor.email}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium capitalize text-amber-800">{vendor.vendorStatus}</span><button type="button" onClick={() => void handleVendorAction(vendor._id, approveVendor)} disabled={actionId !== null} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Check className="h-3.5 w-3.5" aria-hidden="true" />Approve</button><button type="button" onClick={() => void handleVendorAction(vendor._id, rejectVendor)} disabled={actionId !== null} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"><X className="h-3.5 w-3.5" aria-hidden="true" />Reject</button></div></div>)}
				</div>
			</div>
		</AdminSection>
	);
}

function AdminSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
	return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-6xl"><Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">Back to dashboard</Link><h1 className="mt-5 text-3xl font-bold text-slate-950">{title}</h1><p className="mt-2 text-sm text-slate-600">{description}</p><div className="mt-8">{children}</div></div></main>;
}
