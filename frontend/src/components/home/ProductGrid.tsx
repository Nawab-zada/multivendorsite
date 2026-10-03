"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/features/productSlice";
import ProductCard from "@/components/common/ProductCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function ProductGrid() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-80 rounded-xl" />
        ))}
      </section>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-muted-foreground">No products found.</p>;
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product._id}>
          <ProductCard
            productId={product._id}
            title={product.name}
            price={product.price}
            image={product.images[0] ?? "/placeholder-product.svg"}
            stock={product.stock}
          />
        </div>
      ))}
    </section>
  );
}
