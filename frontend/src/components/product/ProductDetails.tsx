"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";

import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/features/cartSlice";
import {
  clearProductDetails,
  fetchProductById,
  type ProductDetails as Product,
} from "@/store/features/productDetailsSlice";

interface Props {
  productId: string;
}

export default function ProductDetails({ productId }: Props) {
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.productDetails);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    return () => { dispatch(clearProductDetails()); };
  }, [dispatch, productId]);

  if (loading) {
    return <div className="mx-auto grid min-h-screen max-w-[1600px] gap-10 px-6 py-10 lg:grid-cols-2 lg:px-16"><LoadingSkeleton className="min-h-[60vh] lg:min-h-screen" /><div className="flex items-center"><div className="w-full space-y-5"><LoadingSkeleton className="h-4 w-32" /><LoadingSkeleton className="h-20 w-3/4" /><LoadingSkeleton className="h-10 w-1/3" /><LoadingSkeleton className="h-16 w-full" /></div></div></div>;
  }

  if (error) return <p className="min-h-screen px-6 py-28 text-center text-destructive">{error}</p>;
  if (!product) return <p className="min-h-screen px-6 py-28 text-center text-muted-foreground">Product not found.</p>;

  return <ProductView product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const addingToCart = useAppSelector((state) => state.cart.loading);
  const cartError = useAppSelector((state) => state.cart.error);
  const [quantity, setQuantity] = useState(1);
  const image = product.images?.[0] || "/placeholder-product.svg";
  const price = new Intl.NumberFormat("en-PK").format(product.price);
  const stock = Math.max(product.stock ?? 0, 0);
  const categoryName = typeof product.category === "object" && product.category ? product.category.name : product.category;

  return (
    <main className="bg-[#F6F2EA] text-velora-ink">
      {cartError && <p role="alert" className="px-6 pt-5 text-sm text-[#9C554C]">{cartError}</p>}
      <section className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[60vh] overflow-hidden bg-[#E9E3D9] lg:min-h-screen">
          <img src={image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
          <Link href="/products" aria-label="Back to products" className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F2EA]/90 backdrop-blur-md transition hover:bg-velora-ink hover:text-white md:left-10 md:top-10"><ArrowLeft size={17} /></Link>
          {product.images && product.images.length > 1 && <div className="absolute bottom-8 left-8 flex gap-2">{product.images.slice(0, 4).map((_, index) => <span key={index} className={`h-px ${index === 0 ? "w-12 bg-white" : "w-7 bg-white/50"}`} />)}</div>}
        </div>

        <div className="flex items-center px-6 py-16 md:px-12 lg:px-16 xl:px-24"><div className="w-full max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">{categoryName || "The Collection"}</p>
          <h1 className="mt-10 font-serif text-5xl font-normal leading-[0.95] tracking-[-0.04em] md:text-7xl">{product.name}</h1>
          <p className="mt-8 font-serif text-3xl">PKR {price}</p>

          <div className="mt-10 border-y border-velora-ink/10 py-6">{stock > 0 ? <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#66745A]" /><p className="text-xs font-medium uppercase tracking-[0.16em]">In stock</p><span className="text-xs text-[#8C877E]">· {stock} available</span></div> : <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#9C554C]">Currently unavailable</p>}</div>

          {stock > 0 && <><div className="mt-10"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-muted">Quantity</p><div className="mt-4 inline-flex items-center border border-velora-ink/15"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity <= 1} className="flex h-12 w-12 items-center justify-center transition hover:bg-velora-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30"><Minus size={15} /></button><span aria-live="polite" className="flex h-12 w-14 items-center justify-center border-x border-velora-ink/15 text-sm">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(stock, current + 1))} disabled={quantity >= stock} className="flex h-12 w-12 items-center justify-center transition hover:bg-velora-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30"><Plus size={15} /></button></div></div><button type="button" disabled={addingToCart} onClick={() => dispatch(addToCart({ productId: product._id, quantity }))} className="mt-10 flex h-16 w-full items-center justify-center gap-4 bg-velora-ink text-xs font-semibold uppercase tracking-[0.22em] text-velora-ivory transition duration-500 hover:bg-velora-gold disabled:cursor-not-allowed disabled:opacity-60"><ShoppingBag size={17} />{addingToCart ? "Adding..." : "Add to bag"}</button></>}

          <div className="mt-8 grid grid-cols-2 gap-5 border-t border-velora-ink/10 pt-7"><div><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8C877E]">Marketplace</p><p className="mt-2 text-sm">Independent seller</p></div><div><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8C877E]">Checkout</p><p className="mt-2 text-sm">Protected order flow</p></div></div>
        </div></div>
      </section>

      <section className="px-6 py-32 md:px-10 md:py-44 lg:px-16 xl:px-24"><div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[0.35fr_0.65fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-gold">01 / The Object</p></div><div><h2 className="max-w-3xl font-serif text-4xl leading-[1.08] tracking-[-0.03em] md:text-6xl">Designed to become part of everyday life.</h2><p className="mt-10 max-w-2xl whitespace-pre-line text-base leading-8 text-[#68635C]">{product.description}</p></div></div></section>
      {product.images?.[1] && <section className="px-6 pb-32 md:px-10 lg:px-16 xl:px-24"><div className="mx-auto max-w-[1500px] overflow-hidden"><img src={product.images[1]} alt={`${product.name} detail`} className="aspect-[16/8] w-full object-cover" /></div></section>}
      <section className="bg-velora-olive px-6 py-32 text-velora-ivory md:px-10 md:py-40"><div className="mx-auto max-w-4xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Velora / Object {product._id.slice(-4).toUpperCase()}</p><h2 className="mt-8 font-serif text-5xl leading-[1.03] tracking-[-0.04em] md:text-7xl">Worth noticing.<br /><span className="italic text-velora-gold">Made to be used.</span></h2><Link href="/products" className="group mt-12 inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em]">Continue discovering<span className="h-px w-12 bg-white/40 transition-all duration-500 group-hover:w-20" /><ArrowRight size={16} /></Link></div></section>
    </main>
  );
}