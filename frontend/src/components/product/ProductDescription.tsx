interface Props {
  description: string;
}

export default function ProductDescription({ description }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <h2 className="mb-4 text-2xl font-bold">Description</h2>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </section>
  );
}
