import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/features/cartSlice";

interface Props {
  productId: string;
  title: string;
  image: string;
  price: number;
  stock?: number;
}

export default function ProductCard({
  productId,
  title,
  image,
  price,
  stock,
}: Props) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.cart);
  const outOfStock = stock === 0;

  return (
    <article className="rounded-xl border bg-white shadow-sm transition hover:shadow-lg">
      <Link href={`/products/${productId}`}>
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          unoptimized={image.startsWith("http")}
          className="h-56 w-full rounded-t-xl object-cover"
        />
        <h3 className="px-4 pt-4 font-semibold">{title}</h3>
      </Link>

      <div className="space-y-3 p-4 pt-2">
        <p className="text-xl font-bold">PKR {price}</p>
        <Button
          type="button"
          className="w-full"
          disabled={loading || outOfStock}
          onClick={() => dispatch(addToCart({ productId, quantity: 1 }))}
        >
          {loading ? "Adding..." : outOfStock ? "Out of Stock" : "Add To Cart"}
        </Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </article>
  );
}
