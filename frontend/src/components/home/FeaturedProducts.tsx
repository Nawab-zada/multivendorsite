import ProductGrid from "@/components/home/ProductGrid";

export default function FeaturedProducts() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
        <ProductGrid />
      </div>
    </section>
  );
}
