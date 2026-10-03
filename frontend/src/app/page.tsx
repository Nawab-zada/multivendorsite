import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  RefreshCcw,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import ProductGrid from "@/components/home/ProductGrid";

const categories = [
  ["Electronics", "E", "bg-sky-100 text-sky-700"],
  ["Fashion", "F", "bg-rose-100 text-rose-700"],
  ["Home & Living", "H", "bg-emerald-100 text-emerald-700"],
  ["Beauty", "B", "bg-pink-100 text-pink-700"],
  ["Sports", "S", "bg-velora-stone text-velora-olive"],
  ["Accessories", "A", "bg-velora-stone text-velora-olive"],
] as const;

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-velora-ivory text-velora-ink">
        <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-between px-6 py-12 md:px-10 lg:px-16 lg:py-16 xl:px-24">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-muted">
                  01 / The Marketplace
                </p>

                <h1 className="mt-10 max-w-[760px] font-serif text-[clamp(3.8rem,7vw,8.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                  Find what
                  <br />
                  deserves a place
                  <br />
                  <span className="italic text-velora-gold">in your life.</span>
                </h1>

                <p className="mt-10 max-w-md text-base leading-7 text-velora-muted md:text-lg">
                  A marketplace of objects, makers and ideas worth discovering,
                  chosen with intention and made to become part of everyday life.
                </p>

                <Link
                  href="/products"
                  className="group mt-10 inline-flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.22em]"
                >
                  Explore the collection
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-velora-ink/25 transition duration-500 group-hover:bg-velora-ink group-hover:text-velora-paper">
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </div>

              <div className="mt-20 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-muted lg:flex">
                Scroll to discover
                <ArrowRight size={14} className="rotate-90" aria-hidden="true" />
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1800&q=90"
                alt="Curated watch"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />
              <div className="absolute bottom-8 left-8 text-white md:bottom-12 md:left-12">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">Object 001</p>
                <p className="mt-2 font-serif text-2xl">Time, considered.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-8 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Explore</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Shop by category</h2></div><Link href="/products" className="hidden items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950 sm:flex">View all <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{categories.map(([name, icon, tone]) => <Link href={`/products?category=${encodeURIComponent(name)}`} key={name} className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"><div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${tone}`}>{icon}</div><p className="mt-4 text-sm font-semibold">{name}</p></Link>)}</div>
        </section>

        <section className="bg-slate-50"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-8"><div className="mb-8 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-amber-600">Handpicked for you</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Featured products</h2><p className="mt-2 text-slate-500">Explore popular products from marketplace vendors.</p></div><Link href="/products" className="hidden items-center gap-1 font-semibold sm:flex">Browse all <ArrowRight size={17} aria-hidden="true" /></Link></div><ProductGrid /></div></section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8"><div className="relative overflow-hidden rounded-3xl bg-amber-400 px-8 py-12 sm:px-12 lg:px-16"><div className="relative max-w-2xl"><p className="font-semibold text-slate-700">Discover something new</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Thousands of products.<br />Multiple independent vendors.</h2><p className="mt-4 max-w-xl leading-7 text-slate-700">Explore products across the marketplace and find the right products from different sellers in one shopping experience.</p><Link href="/products" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white">Explore marketplace <ArrowRight size={18} aria-hidden="true" /></Link></div></div></section>

        <section className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8"><Feature icon={<ShieldCheck />} title="Secure shopping" description="Protected accounts and secure marketplace checkout." /><Feature icon={<Truck />} title="Reliable delivery" description="Track your purchases from order to delivery." /><Feature icon={<RefreshCcw />} title="Easy ordering" description="Simple cart and checkout across vendors." /><Feature icon={<Headphones />} title="Marketplace support" description="A structured platform for customers and vendors." /></div></section>

        <section className="bg-slate-950"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-8"><div><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400"><Store className="text-slate-950" aria-hidden="true" /></div><h2 className="text-3xl font-bold text-white">Have products to sell?</h2><p className="mt-3 max-w-xl leading-7 text-slate-400">Join the marketplace as a vendor, manage your products, inventory and orders from your own vendor dashboard.</p></div><Link href="/register" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-400">Become a vendor <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
      </main>
    </>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">{icon}</div><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div></div>;
}
