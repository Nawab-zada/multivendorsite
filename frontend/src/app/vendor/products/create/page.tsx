"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ImageIcon, Info, Package, Plus, Trash2 } from "lucide-react";

import type { AdminCategory } from "@/services/adminService";
import { createProduct, getCategories } from "@/services/productService";
import { createProductSchema } from "@/lib/validations/product";

type FormState = { name: string; description: string; price: string; stock: string; category: string; brand: string };
const EMPTY_FORM: FormState = { name: "", description: "", price: "", stock: "", category: "", brand: "" };
const inputClass = "h-12 w-full rounded-xl border border-[#D8D0C3] bg-[#FFFEFB] px-4 text-sm text-[#181714] outline-none transition placeholder:text-[#AAA399] focus:border-[#A98552] focus:ring-2 focus:ring-[#A98552]/10";

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([""]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCategories = async () => {
      try {
        const availableCategories = await getCategories();
        if (active) setCategories(availableCategories);
      } catch {
        if (active) setError("Unable to load categories. Please try again.");
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };
    void loadCategories();
    return () => { active = false; };
  }, []);

  const previewImage = images.find((image) => image.trim());
  const selectedCategory = useMemo(() => categories.find((category) => category._id === form.category), [categories, form.category]);
  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = createProductSchema.safeParse({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: form.stock === "" ? NaN : Number(form.stock),
      category: form.category,
      images: images.map((image) => image.trim()).filter(Boolean),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check the product details.");
      setSubmitting(false);
      return;
    }

    try {
      setSubmitting(true);

      const cleanImages = images
        .map((image) => image.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        brand: form.brand.trim(),
        images: cleanImages,
      };

      console.log("CREATE PRODUCT PAYLOAD:", payload);

      await createProduct(payload);

      router.push("/vendor/products");
    } catch (requestError: unknown) {
      const responseData = (
        requestError as {
          response?: { data?: { details?: string[]; message?: string } };
        }
      ).response?.data;
      console.error(
        "CREATE PRODUCT ERROR:",
        responseData || requestError
      );

      setError(
        responseData?.details?.join(" ") ||
          responseData?.message ||
          "Unable to create product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-7 lg:px-10">
        <Link href="/vendor/products" className="inline-flex items-center gap-2 text-sm text-[#777168] transition hover:text-[#181714]"><ArrowLeft className="h-4 w-4" />Products</Link>
        <header className="mt-7 flex flex-col justify-between gap-6 border-b border-[#DED8CE] pb-8 lg:flex-row lg:items-end"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A98552]">Products / Add product</p><h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.03em] text-[#181714] md:text-5xl">Add a new product</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#777168]">Create a thoughtful product listing for your Velora storefront.</p></div><div className="hidden items-center gap-2 text-xs text-[#8B857B] sm:flex"><Info className="h-4 w-4" />Fields marked * are required</div></header>

        {!categoriesLoading && categories.length === 0 && (
          <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            No active product categories are available. An admin must create or activate one under Admin → Categories before you can add a product.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="overflow-hidden rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3]">
              <FormSection number="01" title="Product information" description="Introduce the product clearly to your customers.">
                <div className="grid gap-6"><Field label="Product name *"><Input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Handmade stone tasbih" /></Field><Field label="Description *"><textarea rows={6} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe the product, materials, features and what makes it worth discovering..." className={`${inputClass} h-auto resize-none py-3 leading-6`} /><div className="text-right text-xs text-[#A29B91]">{form.description.length} characters</div></Field><Field label="Brand"><Input value={form.brand} onChange={(event) => update("brand", event.target.value)} placeholder="e.g. Nawab Crafts" /></Field></div>
              </FormSection>
              <FormSection number="02" title="Pricing & inventory" description="Set the selling price, stock and product category.">
                <div className="grid gap-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Price *"><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#777168]">PKR</span><input type="number" min="0" step="1" value={form.price} onChange={(event) => update("price", event.target.value)} placeholder="2500" className={`${inputClass} pl-14`} /></div></Field><Field label="Stock *"><Input type="number" min="0" value={form.stock} onChange={(event) => update("stock", event.target.value)} placeholder="24" /></Field></div><Field label="Category *"><div className="relative"><select value={form.category} disabled={categoriesLoading || categories.length === 0} onChange={(event) => update("category", event.target.value)} className={`${inputClass} appearance-none pr-11 disabled:cursor-not-allowed disabled:bg-[#F1EDE5]`}><option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777168]" /></div>{!categoriesLoading && categories.length === 0 && <p className="mt-2 text-xs text-[#806438]">No categories are currently available.</p>}</Field></div>
              </FormSection>
              <FormSection number="03" title="Product images" description="Add clear images that help customers understand the product." last>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CEC5B7] bg-[#F7F4EE] px-6 py-9 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECE6DB]"><ImageIcon className="h-5 w-5 text-[#8D795A]" /></div><p className="mt-4 text-sm font-semibold text-[#34382F]">Product imagery</p><p className="mt-1 max-w-sm text-xs leading-5 text-[#8B857B]">Add one or more product image links below.</p></div>
                <div className="mt-6 space-y-3">{images.map((image, index) => <div key={index} className="flex items-center gap-2"><div className="relative flex-1"><ImageIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A29B91]" /><input type="url" value={image} onChange={(event) => setImages((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="https://example.com/product-image.jpg" className={`${inputClass} pl-11`} /></div><button type="button" aria-label="Remove image" onClick={() => setImages((current) => { const next = current.filter((_, itemIndex) => itemIndex !== index); return next.length ? next : [""]; })} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E1DBD0] text-[#8B857B] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div><button type="button" onClick={() => setImages((current) => [...current, ""])} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#80633A] transition hover:text-[#181714]"><Plus className="h-4 w-4" />Add another image</button>
              </FormSection>
            </div>

            <aside className="xl:relative"><div className="xl:sticky xl:top-8"><div className="overflow-hidden rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3]"><div className="border-b border-[#E7E1D7] px-5 py-4"><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A98552]">Live preview</p><p className="mt-1 text-sm text-[#777168]">How the product begins to look.</p></div><div className="relative aspect-[4/4.5] overflow-hidden bg-[#EEEAE2]">{previewImage ? <img src={previewImage} alt="Product preview" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center px-6 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E5E0D7]"><ImageIcon className="h-6 w-6 text-[#A29B91]" /></div><p className="mt-4 text-sm font-medium text-[#777168]">Your product image</p><p className="mt-1 text-xs text-[#A29B91]">Add an image URL to preview it.</p></div>}</div><div className="p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A98552]">{selectedCategory?.name || "Category"}</p><h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-[#181714]">{form.name || "Your product name"}</h2>{form.brand && <p className="mt-2 text-xs text-[#8B857B]">by {form.brand}</p>}<p className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#181714]">{form.price && Number(form.price) > 0 ? `PKR ${Number(form.price).toLocaleString()}` : "PKR -"}</p><div className="mt-5 flex items-center gap-2 border-t border-[#E7E1D7] pt-4"><span className={`h-2 w-2 rounded-full ${form.stock === "" ? "bg-[#BBB4AA]" : Number(form.stock) > 0 ? "bg-emerald-600" : "bg-red-500"}`} /><span className="text-xs text-[#777168]">{form.stock === "" ? "Stock not set" : Number(form.stock) > 0 ? `${form.stock} in stock` : "Out of stock"}</span></div></div></div><div className="mt-4 rounded-xl border border-[#E1DBD0] bg-[#F3EFE7] p-4"><div className="flex gap-3"><Package className="mt-0.5 h-4 w-4 shrink-0 text-[#9B7A49]" /><p className="text-xs leading-5 text-[#777168]">Review the information carefully before publishing. Customers will use these details when deciding whether to buy.</p></div></div></div></aside>
          </div>
          {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}
          {success && <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">Product created successfully.</div>}
          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#E1DBD0] bg-[#FAF8F3] px-5 py-4 sm:flex-row sm:items-center"><p className="text-xs text-[#8B857B]">Make sure your product information is accurate before publishing.</p><div className="flex items-center gap-3"><Link href="/vendor/products" className="inline-flex h-11 items-center justify-center rounded-lg border border-[#D8D0C3] px-5 text-sm font-medium text-[#5D584F] transition hover:bg-[#F1EDE5]">Cancel</Link><button type="submit" disabled={submitting || categoriesLoading || categories.length === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#34382F] px-6 text-sm font-semibold text-white transition hover:bg-[#272B24] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Creating..." : "Create product"}{!submitting && <ArrowRight className="h-4 w-4" />}</button></div></div>
        </form>
      </div>
    </main>
  );
}

function FormSection({ number, title, description, children, last = false }: { number: string; title: string; description: string; children: React.ReactNode; last?: boolean }) {
  return <section className={`grid gap-8 p-6 md:grid-cols-[190px_minmax(0,1fr)] md:p-8 ${!last ? "border-b border-[#E7E1D7]" : ""}`}><div><p className="text-[10px] font-bold tracking-[0.18em] text-[#A98552]">{number}</p><h2 className="mt-2 font-semibold text-[#181714]">{title}</h2><p className="mt-2 text-xs leading-5 text-[#8B857B]">{description}</p></div><div>{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><label className="block text-sm font-medium text-[#34312C]">{label}</label>{children}</div>;
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${className}`} />;
}
