"use client";

import { useParams } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";

export default function ProductPage() {
	const { slug } = useParams<{ slug: string }>();
	return <ProductDetails productId={slug} />;
}
