import Link from "next/link";

export default function AdminVendorDetailsPage() {
	return <main className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-bold">Vendor request</h1><p className="mt-3 text-sm text-slate-600">Return to the vendor requests list to review and approve pending vendors.</p><Link href="/admin/vendors" className="mt-6 inline-block text-sm font-semibold underline">Back to vendor requests</Link></main>;
}
