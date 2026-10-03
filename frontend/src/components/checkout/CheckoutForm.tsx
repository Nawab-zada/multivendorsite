"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Check, LockKeyhole, MapPin, PackageCheck, ShieldCheck } from "lucide-react";

import { useAppSelector } from "@/store/hooks";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  address: z.string().min(5, "Please enter your complete address"),
  paymentMethod: z.enum(["cod"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface Props {
  onSubmit: (data: CheckoutFormData) => void;
  loading?: boolean;
}

export default function CheckoutForm({ onSubmit, loading = false }: Props) {
  const { items, totalItems, totalPrice } = useAppSelector((state) => state.cart);
  const { error } = useAppSelector((state) => state.checkout);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema), defaultValues: { paymentMethod: "cod" } });
  const formattedTotal = new Intl.NumberFormat("en-PK").format(totalPrice);

  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-16 lg:grid-cols-[1fr_420px]">
    <div className="max-w-3xl">
      <section><CheckoutSectionHeader number="01" icon={<MapPin size={17} />} title="Where should it go?" description="Enter the address where you would like to receive your order." /><div className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-2"><Field label="Full name" error={errors.fullName?.message}><input {...register("fullName")} placeholder="Nawab Zada" className={inputClasses} /></Field><Field label="Phone" error={errors.phone?.message}><input {...register("phone")} type="tel" placeholder="+92 3XX XXXXXXX" className={inputClasses} /></Field><Field label="City" error={errors.city?.message}><input {...register("city")} placeholder="Islamabad" className={inputClasses} /></Field><div className="md:col-span-2"><Field label="Complete address" error={errors.address?.message}><textarea {...register("address")} rows={4} placeholder="House, street, area..." className={`${inputClasses} resize-none py-4`} /></Field></div></div></section>

      <section className="mt-20 border-t border-velora-ink/10 pt-16"><CheckoutSectionHeader number="02" icon={<LockKeyhole size={17} />} title="Payment" description="Choose how you would like to complete the purchase." /><div className="mt-10 border border-velora-ink bg-[#FBF9F5] p-6 md:p-8"><div className="flex items-start gap-5"><div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-velora-ink text-white"><Check size={11} /></div><div><p className="font-medium">Cash on Delivery</p><p className="mt-2 max-w-lg text-sm leading-6 text-velora-muted">Pay when your order is delivered to the shipping address provided above.</p></div><span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.2em] text-velora-gold">COD</span></div><input type="radio" value="cod" {...register("paymentMethod")} className="sr-only" /></div></section>

      <section className="mt-20 grid gap-8 border-t border-velora-ink/10 pt-12 md:grid-cols-2"><ConfidenceItem icon={<ShieldCheck size={19} strokeWidth={1.4} />} title="Protected order flow">Your order is processed through Velora&apos;s authenticated checkout system.</ConfidenceItem><ConfidenceItem icon={<PackageCheck size={19} strokeWidth={1.4} />} title="Inventory confirmation">Product availability is confirmed during order placement.</ConfidenceItem></section>
    </div>

    <aside className="lg:sticky lg:top-8 lg:self-start"><div className="bg-velora-ink p-7 text-velora-ivory md:p-9"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Your Order</p><div className="mt-8 max-h-[330px] space-y-6 overflow-y-auto pr-2">{items.map((item) => <CheckoutItem key={item.product._id} item={item} />)}</div><div className="mt-8 space-y-4 border-t border-white/10 pt-7"><div className="flex justify-between text-sm"><span className="text-white/50">Objects ({totalItems})</span><span>PKR {formattedTotal}</span></div><div className="flex justify-between gap-5 text-sm"><span className="text-white/50">Shipping</span><span className="text-white/60">Confirmed on order</span></div></div><div className="mt-7 flex items-end justify-between border-t border-white/10 pt-7"><div><p className="text-[9px] uppercase tracking-[0.22em] text-white/45">Current subtotal</p><p className="mt-2 font-serif text-3xl">PKR {formattedTotal}</p></div></div>{error && <div className="mt-6 border border-[#C68176]/40 bg-[#C68176]/10 p-4"><p className="text-xs leading-5 text-[#E3B5AD]">{typeof error === "string" ? error : "We couldn&apos;t place your order. Please try again."}</p></div>}<button type="submit" disabled={loading || items.length === 0} className="group mt-8 flex h-16 w-full items-center justify-between bg-velora-ivory px-6 text-xs font-semibold uppercase tracking-[0.2em] text-velora-ink transition duration-500 hover:bg-velora-gold disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Placing order..." : "Place order"}<ArrowRight size={17} className="transition group-hover:translate-x-1" /></button><div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/35"><LockKeyhole size={11} />Secure checkout</div></div></aside>
  </form>;
}

function CheckoutItem({ item }: { item: { product: { _id: string; name: string; price: number; images: string[] }; quantity: number } }) {
  const subtotal = new Intl.NumberFormat("en-PK").format(item.product.price * item.quantity);
  return <div className="flex gap-4"><div className="relative h-20 w-16 shrink-0 overflow-hidden bg-white/10"><img src={item.product.images?.[0] || "/placeholder-product.svg"} alt={item.product.name} className="h-full w-full object-cover" /><span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-velora-ivory px-1 text-[9px] font-semibold text-velora-ink">{item.quantity}</span></div><div className="min-w-0 flex-1"><p className="mt-1 truncate font-serif text-lg">{item.product.name}</p><p className="mt-2 text-xs text-white/60">PKR {subtotal}</p></div></div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-velora-muted">{label}</span><div className="mt-2">{children}</div>{error && <p className="mt-2 text-xs text-[#9C554C]">{error}</p>}</label>;
}

function CheckoutSectionHeader({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  return <div className="flex gap-6"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-velora-ink/15 text-velora-gold">{icon}</div><div><p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-velora-gold">{number}</p><h2 className="mt-2 font-serif text-3xl md:text-4xl">{title}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-velora-muted">{description}</p></div></div>;
}

function ConfidenceItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <div className="flex gap-4"><span className="shrink-0 text-velora-gold">{icon}</span><div><p className="text-sm font-medium">{title}</p><p className="mt-2 text-xs leading-5 text-velora-muted">{children}</p></div></div>;
}

const inputClasses = "w-full border-0 border-b border-velora-ink/20 bg-transparent px-0 py-3 text-base text-velora-ink outline-none transition placeholder:text-[#AAA49A] focus:border-velora-ink";