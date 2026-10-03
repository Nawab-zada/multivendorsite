import Link from "next/link";

const categories: { name: string; slug: string }[] = [];

export default function Categories() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="rounded-lg border bg-white p-6 text-center transition-colors hover:bg-muted"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No categories yet.</p>
        )}
      </div>
    </section>
  );
}
