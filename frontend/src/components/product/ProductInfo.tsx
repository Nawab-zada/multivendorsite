"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart as addToCartThunk } from "@/store/features/cartSlice";
import type { ProductDetails } from "@/store/features/productDetailsSlice";

interface Props {
  product: ProductDetails;
}

export default function ProductInfo({ product }: Props) {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : typeof product.category === "string"
        ? product.category
        : null;

  const availableStock = Math.max(product.stock ?? 0, 0);

  const isOutOfStock = availableStock === 0;

  const handleDecrement = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };

  const handleIncrement = () => {
    setQuantity((currentQuantity) =>
      Math.min(availableStock, currentQuantity + 1)
    );
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || loading) {
      return;
    }

    await dispatch(
      addToCartThunk({
        productId: product._id,
        quantity,
      })
    );
  };

  const stockMessage = isOutOfStock
    ? "Out of stock"
    : availableStock <= 5
      ? `Only ${availableStock} left in stock`
      : `${availableStock} items in stock`;

  return (
    <div className="space-y-6">
      {/* Category */}
      {categoryName && (
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
          {categoryName}
        </p>
      )}

      {/* Product name + price */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {product.name}
        </h1>

        <p className="text-3xl font-bold text-slate-900">
          PKR {product.price.toLocaleString()}
        </p>
      </div>

      {/* Product information */}
      <div className="space-y-3 border-y border-slate-200 py-5">
        {categoryName && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-700">
              Category:
            </span>

            <span className="text-slate-600">
              {categoryName}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-700">
            Availability:
          </span>

          <span
            className={
              isOutOfStock
                ? "font-medium text-red-600"
                : availableStock <= 5
                  ? "font-medium text-orange-600"
                  : "font-medium text-green-600"
            }
          >
            {stockMessage}
          </span>
        </div>
      </div>

      {/* Quantity */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">
            Quantity
          </span>

          <div className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-lg font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <div
              aria-live="polite"
              className="flex h-10 w-14 items-center justify-center border-x border-slate-200 text-sm font-semibold text-slate-900"
            >
              {quantity}
            </div>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={handleIncrement}
              disabled={quantity >= availableStock}
              className="flex h-10 w-10 items-center justify-center text-lg font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Cart error */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex max-w-sm flex-col gap-3">
        <Button
          type="button"
          className="w-full"
          disabled={isOutOfStock || loading}
          onClick={handleAddToCart}
        >
          {loading
            ? "Adding to Cart..."
            : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isOutOfStock || loading}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
