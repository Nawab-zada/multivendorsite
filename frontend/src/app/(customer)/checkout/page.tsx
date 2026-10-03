"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole, PackageCheck, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { placeOrder } from "@/store/features/checkoutSlice";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { loading, error } = useAppSelector((state) => state.checkout);

  const handleCheckout = async (data: { fullName: string; phone: string; city: string; address: string; paymentMethod: "cod" }) => {
    const result = await dispatch(placeOrder({ shippingAddress: { fullName: data.fullName, phone: data.phone, city: data.city, address: data.address }, paymentMethod: data.paymentMethod }));
    if (placeOrder.fulfilled.match(result)) router.push(`/order/success/${result.payload._id || result.payload.orderNumber}`);
  };

  if (items.length === 0) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-6 text-velora-ink"><div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">Checkout</p><h1 className="mt-5 font-serif text-6xl md:text-8xl">Your bag is empty.</h1><p className="mt-6 text-velora-muted">Add products to your bag before completing an order.</p><Link href="/products" className="group mt-10 inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em]">Continue discovering<ArrowLeft size={15} className="rotate-180 transition group-hover:translate-x-1" /></Link></div></main>;
  }

  return <main className="min-h-screen bg-[#F6F2EA] text-velora-ink">
    <header className="border-b border-velora-ink/10"><div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 md:px-10 lg:px-16"><Link href="/" className="font-serif text-2xl font-semibold tracking-[0.12em]">VELORA</Link><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-velora-muted"><LockKeyhole size={13} />Secure checkout</div></div></header>
    <div className="mx-auto max-w-[1500px] px-6 py-12 md:px-10 md:py-16 lg:px-16 xl:px-24">
      <Link href="/cart" className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-velora-muted"><ArrowLeft size={14} className="transition group-hover:-translate-x-1" />Return to bag</Link>
      <div className="mt-12"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">Checkout</p><h1 className="mt-5 font-serif text-6xl leading-none tracking-[-0.045em] md:text-8xl">Complete your<br /><span className="italic text-velora-gold">order.</span></h1></div>
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start"><section>{error && <div role="alert" className="mb-8 border border-[#9C554C]/30 bg-[#9C554C]/5 px-4 py-3 text-sm text-[#9C554C]">{error}</div>}<CheckoutForm onSubmit={handleCheckout} loading={loading} /></section><aside className="border-t border-velora-ink/15 pt-6"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-muted">Your order</p><p className="mt-5 font-serif text-3xl">{items.length} {items.length === 1 ? "object" : "objects"}</p><div className="mt-8 space-y-5 text-sm"><div className="flex items-start gap-3"><ShieldCheck size={18} className="shrink-0 text-velora-gold" /><span>Protected account and checkout flow.</span></div><div className="flex items-start gap-3"><PackageCheck size={18} className="shrink-0 text-velora-gold" /><span>Order visibility from checkout to delivery.</span></div></div></aside></div>
    </div>
  </main>;
}