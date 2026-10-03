"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProducts,
  type Product as StoreProduct,
} from "@/store/features/productSlice";

type Product = StoreProduct & {
  brand?: string;
  stock?: number;
  category?: {
    _id: string;
    name: string;
  };
};

export default function ProductsPage() {

		const dispatch = useAppDispatch();
		const { products: storedProducts, loading, error } = useAppSelector(
		  (state) => state.products
		);
		const products = storedProducts as Product[];

		const [search, setSearch] = useState("");
		const [category, setCategory] = useState("All");
		const [sort, setSort] = useState("featured");
		const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

		useEffect(() => {
		  dispatch(fetchProducts());
		}, [dispatch]);

		const categoryNames = useMemo(() => {
		  const names = products
		    .map((product) => product.category?.name)
		    .filter((name): name is string => Boolean(name));

		  return ["All", ...Array.from(new Set(names))];
		}, [products]);

		const filteredProducts = useMemo(() => {
		  let result = [...products];
		  const query = search.trim().toLowerCase();

		  if (query) {
		    result = result.filter(
		      (product) =>
		        product.name.toLowerCase().includes(query) ||
		        product.brand?.toLowerCase().includes(query) ||
		        product.category?.name.toLowerCase().includes(query)
		    );
		  }

		  if (category !== "All") {
		    result = result.filter((product) => product.category?.name === category);
		  }

		  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
		  if (sort === "price-high") result.sort((a, b) => b.price - a.price);
		  if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

		  return result;
		}, [products, search, category, sort]);

		return (
		  <main className="min-h-screen bg-[#F6F2EA] text-velora-ink">
		    <section className="border-b border-velora-ink/10">
		      <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28 lg:px-16 xl:px-24">
		        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-muted">
		          Discover / All Objects
		        </p>
		        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.6fr] lg:items-end">
		          <h1 className="max-w-4xl font-serif text-[clamp(4rem,8vw,8rem)] font-normal leading-[0.87] tracking-[-0.055em]">
		            Everything worth
		            <br />
		            <span className="italic text-velora-gold">discovering.</span>
		          </h1>
		          <div className="max-w-md lg:justify-self-end">
		            <p className="leading-7 text-velora-muted">
		              Explore objects from independent sellers across the Velora marketplace.
		              Search deliberately. Choose thoughtfully.
		            </p>
		            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-gold">
		              {filteredProducts.length} {filteredProducts.length === 1 ? "object" : "objects"}
		            </p>
		          </div>
		        </div>
		      </div>
		    </section>

		    <section className="border-b border-velora-ink/10">
		      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 xl:px-24">
		        <div className="flex h-24 items-center gap-5">
		          <Search size={20} strokeWidth={1.5} className="shrink-0 text-velora-muted" />
		          <input
		            type="text"
		            value={search}
		            onChange={(event) => setSearch(event.target.value)}
		            placeholder="Search objects, brands or categories..."
		            className="h-full flex-1 bg-transparent font-serif text-xl outline-none placeholder:text-[#AAA49A] md:text-2xl"
		          />
		          {search && (
		            <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-velora-ink/5">
		              <X size={17} />
		            </button>
		          )}
		        </div>
		      </div>
		    </section>

		    <section className="border-b border-velora-ink/10">
		      <div className="mx-auto max-w-[1600px] overflow-x-auto px-6 md:px-10 lg:px-16 xl:px-24">
		        <div className="flex min-w-max items-center gap-9 py-7">
		          {categoryNames.map((name) => (
		            <button key={name} type="button" onClick={() => setCategory(name)} className={`relative text-xs font-semibold uppercase tracking-[0.18em] transition ${category === name ? "text-velora-ink" : "text-[#8C877E] hover:text-velora-ink"}`}>
		              {name}
		              {category === name && <span className="absolute -bottom-3 left-0 h-px w-full bg-velora-gold" />}
		            </button>
		          ))}
		        </div>
		      </div>
		    </section>

		    <section>
		      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 xl:px-24">
		        <div className="flex items-center justify-between border-b border-velora-ink/10 py-8">
		          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] lg:hidden">
		            <SlidersHorizontal size={16} /> Filter
		          </button>
		          <p className="hidden text-sm text-velora-muted lg:block">Showing {filteredProducts.length} objects</p>
		          <div className="relative">
		            <select value={sort} onChange={(event) => setSort(event.target.value)} className="appearance-none bg-transparent py-2 pl-2 pr-8 text-xs font-semibold uppercase tracking-[0.16em] outline-none">
		              <option value="featured">Featured</option>
		              <option value="price-low">Price: Low to High</option>
		              <option value="price-high">Price: High to Low</option>
		              <option value="name">Name</option>
		            </select>
		            <ChevronDown size={14} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2" />
		          </div>
		        </div>
		      </div>
		    </section>

		    <section className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 md:py-20 lg:px-16 xl:px-24">
		      {loading && <ProductsSkeleton />}
		      {!loading && error && <div className="py-28 text-center"><p className="font-serif text-4xl">We couldn&apos;t load the collection.</p><p className="mt-4 text-sm text-velora-muted">{error}</p></div>}
		      {!loading && !error && filteredProducts.length === 0 && <EmptyCollection onReset={() => { setSearch(""); setCategory("All"); }} />}
		      {!loading && !error && filteredProducts.length > 0 && (
		        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-7 md:gap-y-20 lg:grid-cols-3 xl:grid-cols-4">
		          {filteredProducts.map((product, index) => <DiscoveryProductCard key={product._id} product={product} index={index} />)}
		        </div>
		      )}
		    </section>

		    {!loading && filteredProducts.length > 4 && (
		      <section className="bg-velora-olive px-6 py-28 text-velora-ivory md:px-10 md:py-36 lg:px-16 xl:px-24">
		        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-2 lg:items-end">
		          <div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-stone">The Velora Edit</p><h2 className="mt-8 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] md:text-7xl">Fewer things.<br /><span className="italic text-velora-gold">Better choices.</span></h2></div>
		          <p className="max-w-md leading-7 text-velora-stone lg:justify-self-end">A marketplace can contain thousands of products without making discovery feel like noise. Search, compare and choose at your own pace.</p>
		        </div>
		      </section>
		    )}

		    {mobileFiltersOpen && <MobileFilterPanel categories={categoryNames} selectedCategory={category} onSelectCategory={(value) => { setCategory(value); setMobileFiltersOpen(false); }} onClose={() => setMobileFiltersOpen(false)} />}
		  </main>
		);
	}

	function DiscoveryProductCard({ product, index }: { product: Product; index: number }) {
	  const image = product.images?.[0] || "/placeholder-product.jpg";
	  const formattedPrice = new Intl.NumberFormat("en-PK").format(product.price);

	  return (
	    <article className="group">
	      <Link href={`/products/${product._id}`}>
	        <div className="relative aspect-[4/5] overflow-hidden bg-[#ECE7DE]">
	          <img src={image} alt={product.name} loading={index < 4 ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]" />
	          {product.stock === 0 && <div className="absolute left-4 top-4 bg-velora-ink px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">Sold out</div>}
	          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-velora-ink/90 px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-0 md:block">View object</div>
	        </div>
	        <div className="pt-5">
	          <p className="min-h-[15px] text-[9px] font-semibold uppercase tracking-[0.22em] text-velora-gold">{product.brand || product.category?.name || "Velora"}</p>
	          <div className="mt-2 flex items-start justify-between gap-3"><h2 className="font-serif text-lg leading-tight md:text-xl">{product.name}</h2><p className="shrink-0 text-xs md:text-sm">PKR {formattedPrice}</p></div>
	          {product.category?.name && <p className="mt-2 text-xs text-[#8C877E]">{product.category.name}</p>}
	          <div className="mt-5 h-px w-0 bg-velora-gold transition-all duration-500 group-hover:w-full" />
	        </div>
	      </Link>
	    </article>
	  );
	}

	function EmptyCollection({ onReset }: { onReset: () => void }) {
	  return <div className="flex min-h-[500px] items-center justify-center text-center"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">Nothing found</p><h2 className="mt-6 font-serif text-5xl tracking-tight">Perhaps somewhere else.</h2><p className="mx-auto mt-5 max-w-md leading-7 text-velora-muted">No objects match the current search and filters.</p><button type="button" onClick={onReset} className="group mt-8 inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em]">Clear filters <ArrowRight size={15} className="transition group-hover:translate-x-1" /></button></div></div>;
	}

	function MobileFilterPanel({ categories, selectedCategory, onSelectCategory, onClose }: { categories: string[]; selectedCategory: string; onSelectCategory: (category: string) => void; onClose: () => void }) {
	  return <div className="fixed inset-0 z-[100] bg-[#F6F2EA] lg:hidden"><div className="flex items-center justify-between border-b border-velora-ink/10 px-6 py-6"><p className="font-serif text-2xl">Filter objects</p><button type="button" onClick={onClose} aria-label="Close filters" className="flex h-10 w-10 items-center justify-center rounded-full border border-velora-ink/15"><X size={18} /></button></div><div className="px-6 py-10"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-velora-muted">Category</p><div className="mt-8 flex flex-col">{categories.map((name) => <button key={name} type="button" onClick={() => onSelectCategory(name)} className="flex items-center justify-between border-b border-velora-ink/10 py-5 text-left font-serif text-3xl">{name}{selectedCategory === name && <span className="h-2 w-2 rounded-full bg-velora-gold" />}</button>)}</div></div></div>;
	}

	function ProductsSkeleton() {
	  return <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-7 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index}><div className="aspect-[4/5] animate-pulse bg-[#E7E1D7]" /><div className="mt-5 h-2 w-16 animate-pulse bg-[#DDD6CA]" /><div className="mt-4 h-5 w-3/4 animate-pulse bg-[#DDD6CA]" /><div className="mt-3 h-3 w-1/3 animate-pulse bg-[#E5DED3]" /></div>)}</div>;
	}
