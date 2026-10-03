import Navbar from "@/components/layout/Navbar";
import ProductDetails from "@/components/product/ProductDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <ProductDetails productId={id} />
    </>
  );
}
