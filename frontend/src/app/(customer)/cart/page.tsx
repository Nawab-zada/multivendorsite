"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCartItem, loadCart, updateCartItemQuantity, type CartItem } from "@/store/features/cartSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalPrice, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => { dispatch(loadCart()); }, [dispatch]);
  if (!loading && !error && items.length === 0) return <EmptyCart />;

  return <main className="min-h-screen bg-[#F6F2EA] text-velora-ink">
    <section className="border-b border-velora-ink/10"><div className="mx-auto max-w-[1500px] px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24 lg:px-16 xl:px-24"><Link href="/products" className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-velora-muted"><ArrowLeft size={14} className="transition group-hover:-translate-x-1" />Continue discovering</Link><div className="mt-10 flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">Your Selection</p><h1 className="mt-5 font-serif text-6xl leading-none tracking-[-0.045em] md:text-8xl">Your bag.</h1></div><p className="hidden text-sm text-velora-muted md:block">{totalItems} {totalItems === 1 ? "object" : "objects"}</p></div></div></section>
    <section className="mx-auto grid max-w-[1500px] gap-16 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_420px] lg:px-16 xl:px-24"><div>{loading && items.length === 0 ? <CartSkeleton /> : <div className="divide-y divide-velora-ink/10 border-t border-velora-ink/10">{items.map((item) => <CartRow key={item.product._id} item={item} />)}</div>}{error && <p role="alert" className="mt-6 border border-[#9C554C]/30 bg-[#9C554C]/5 px-4 py-3 text-sm text-[#9C554C]">{error}</p>}</div><OrderSummary totalItems={totalItems} totalPrice={totalPrice} loading={loading} /></section>
  </main>;
}

function CartRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const updating = useAppSelector((state) => state.cart.loading);
  const product = item.product;
  const price = new Intl.NumberFormat("en-PK").format(product.price);
  const subtotal = new Intl.NumberFormat("en-PK").format(product.price * item.quantity);

  return <article className="grid grid-cols-[110px_1fr] gap-5 py-8 md:grid-cols-[180px_1fr] md:gap-9 md:py-10"><Link href={`/product/${product._id}`} className="aspect-[4/5] overflow-hidden bg-[#E8E2D8]"><img src={product.images?.[0] || "/placeholder-product.svg"} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]" /></Link><div className="flex min-w-0 flex-col justify-between"><div className="flex items-start justify-between gap-5"><div><Link href={`/product/${product._id}`}><h2 className="font-serif text-2xl leading-tight md:text-3xl">{product.name}</h2></Link><p className="mt-3 text-xs text-velora-muted">PKR {price} / object</p></div><button type="button" onClick={() => dispatch(deleteCartItem(product._id))} disabled={updating} aria-label={`Remove ${product.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center text-velora-muted transition hover:text-[#9C554C] disabled:opacity-40"><Trash2 size={16} strokeWidth={1.5} /></button></div><div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8C877E]">Quantity</p><div className="inline-flex border border-velora-ink/15"><button type="button" disabled={item.quantity <= 1 || updating} onClick={() => dispatch(updateCartItemQuantity({ productId: product._id, quantity: item.quantity - 1 }))} className="flex h-10 w-10 items-center justify-center transition hover:bg-velora-ink hover:text-white disabled:opacity-25"><Minus size={13} /></button><span className="flex h-10 w-11 items-center justify-center border-x border-velora-ink/15 text-xs">{item.quantity}</span><button type="button" disabled={item.quantity >= product.stock || updating} onClick={() => dispatch(updateCartItemQuantity({ productId: product._id, quantity: item.quantity + 1 }))} className="flex h-10 w-10 items-center justify-center transition hover:bg-velora-ink hover:text-white disabled:opacity-25"><Plus size={13} /></button></div></div><div className="sm:text-right"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8C877E]">Subtotal</p><p className="mt-2 font-serif text-xl">PKR {subtotal}</p></div></div></div></article>;
}

function OrderSummary({ totalItems, totalPrice, loading }: { totalItems: number; totalPrice: number; loading: boolean }) {
  const formattedTotal = new Intl.NumberFormat("en-PK").format(totalPrice);
  return <aside className="lg:sticky lg:top-8 lg:self-start"><div className="bg-velora-ink p-7 text-velora-ivory md:p-9"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Order Summary</p><h2 className="mt-5 font-serif text-4xl">Your selection</h2><div className="mt-10 space-y-5 border-y border-white/10 py-7"><div className="flex justify-between gap-5 text-sm"><span className="text-white/55">Objects ({totalItems})</span><span>PKR {formattedTotal}</span></div><div className="flex justify-between gap-5 text-sm"><span className="text-white/55">Shipping</span><span className="text-white/60">Calculated at checkout</span></div></div><div className="py-8"><p className="text-[9px] uppercase tracking-[0.22em] text-white/45">Estimated total</p><p className="mt-2 font-serif text-3xl">PKR {formattedTotal}</p></div><Link href="/checkout" aria-disabled={loading} className="group flex h-16 w-full items-center justify-between bg-velora-ivory px-6 text-xs font-semibold uppercase tracking-[0.2em] text-velora-ink transition duration-500 hover:bg-velora-gold">Proceed to checkout<ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link><div className="mt-7 flex items-center gap-3 text-xs text-white/50"><ShieldCheck size={16} strokeWidth={1.5} />Protected checkout</div></div><p className="mt-5 text-xs leading-5 text-[#8C877E]">Final shipping charges, availability and order totals are confirmed during checkout.</p></aside>;
}

function EmptyCart() {
  return <main className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-6 text-velora-ink"><div className="max-w-2xl text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-velora-ink/15"><ShoppingBag size={20} strokeWidth={1.4} /></div><p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">Your selection</p><h1 className="mt-5 font-serif text-6xl leading-none tracking-[-0.04em] md:text-8xl">Nothing here<br /><span className="italic text-velora-gold">just yet.</span></h1><p className="mx-auto mt-8 max-w-md leading-7 text-velora-muted">The objects you choose will appear here.</p><Link href="/products" className="group mt-10 inline-flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.2em]">Begin discovering<ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link></div></main>;
}

function CartSkeleton() {
  return <div className="space-y-8">{[1, 2, 3].map((item) => <div key={item} className="grid grid-cols-[120px_1fr] gap-7 border-t border-velora-ink/10 py-8"><div className="aspect-[4/5] animate-pulse bg-[#E5DED3]" /><div><div className="h-2 w-20 animate-pulse bg-[#DDD5C9]" /><div className="mt-5 h-7 w-1/2 animate-pulse bg-[#DDD5C9]" /><div className="mt-5 h-3 w-28 animate-pulse bg-[#E5DED3]" /></div></div>)}</div>;
}