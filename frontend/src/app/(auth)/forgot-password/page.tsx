import Link from "next/link";

export default function ForgotPasswordPage() {
	return <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6"><section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold">Password recovery</h1><p className="mt-3 text-sm text-slate-600">Password recovery is not enabled yet. Please contact an administrator.</p><Link href="/login" className="mt-6 inline-block text-sm font-semibold underline">Back to login</Link></section></main>;
}
