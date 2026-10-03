"use client";

import { useEffect } from "react";

import ProductCard from "@/components/common/ProductCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/features/productSlice";

interface Props {
  productId: string;
}

export default function RelatedProducts({ productId }: Props) {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const relatedProducts = products
    .filter((product) => product._id !== productId)
    .slice(0, 4);

  if (loading && relatedProducts.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-80 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <h2 className="mb-6 text-2xl font-bold">Related Products</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
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
      </div>
    </section>
  );
}
