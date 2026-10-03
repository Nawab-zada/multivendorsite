"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteCartItem,
  updateCartItemQuantity,
  type CartItem as CartItemType,
} from "@/store/features/cartSlice";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.cart);

  const [updating, setUpdating] = useState(false);

  const product = item.product;

  const handleQuantityChange = async (quantity: number) => {
    if (quantity < 1 || quantity > product.stock) {
      return;
    }

    setUpdating(true);

    try {
      await dispatch(
        updateCartItemQuantity({
          productId: product._id,
          quantity,
        })
      ).unwrap();
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);

    try {
      await dispatch(deleteCartItem(product._id)).unwrap();
    } finally {
      setUpdating(false);
    }
  };

  const itemSubtotal = product.price * item.quantity;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex gap-5">
        {/* Product Image */}
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-md bg-slate-100">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={112}
              height={112}
              unoptimized={product.images[0].startsWith("http")}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="font-semibold text-slate-900">
            {product.name}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            PKR {product.price.toLocaleString()}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
            {/* Quantity */}
            <div className="flex items-center overflow-hidden rounded-md border border-slate-200">
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.quantity - 1)
                }
                disabled={item.quantity <= 1 || updating || loading}
                aria-disabled={item.quantity <= 1 || updating || loading}
                className="flex h-9 w-9 items-center justify-center text-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span
                aria-live="polite"
                className="flex h-9 w-12 items-center justify-center border-x border-slate-200 text-sm font-medium"
              >
                {updating ? "..." : item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.quantity + 1)
                }
                disabled={
                  item.quantity >= product.stock ||
                  updating ||
                  loading
                }
                aria-disabled={
                  item.quantity >= product.stock || updating || loading
                }
                className="flex h-9 w-9 items-center justify-center text-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={updating || loading}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Subtotal
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            PKR {itemSubtotal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
