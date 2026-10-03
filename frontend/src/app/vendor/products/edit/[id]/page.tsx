import Link from "next/link";

export default function EditVendorProductPage() {
	return <main className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-3xl font-bold">Edit product</h1><p className="mt-3 text-sm text-slate-600">Product editing is not enabled yet.</p><Link href="/vendor/products" className="mt-6 inline-block text-sm font-semibold underline">Back to products</Link></main>;
}
