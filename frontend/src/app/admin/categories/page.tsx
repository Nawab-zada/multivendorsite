"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createAdminCategory,
  getAdminCategories,
  updateAdminCategoryStatus,
  type AdminCategory,
} from "@/services/adminService";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await getAdminCategories());
      setError(null);
    } catch {
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadInitialCategories = async () => {
      try {
        const loadedCategories = await getAdminCategories();
        if (active) setCategories(loadedCategories);
      } catch {
        if (active) setError("Unable to load categories.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!name.trim() || !slug.trim()) {
      setError("Category name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      await createAdminCategory({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      });
      setName("");
      setSlug("");
      setDescription("");
      setNotice("Category created and made active.");
      await loadCategories();
    } catch (requestError: unknown) {
      setError(
        (requestError as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Unable to create category."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = async (category: AdminCategory) => {
    setError(null);
    setNotice(null);
    setUpdatingId(category._id);
    try {
      const updated = await updateAdminCategoryStatus(category._id, !category.isActive);
      setCategories((current) =>
        current.map((item) => item._id === updated._id ? updated : item)
      );
      setNotice(updated.isActive ? "Category activated." : "Category deactivated.");
    } catch (requestError: unknown) {
      setError(
        (requestError as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Unable to update category status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">Back to dashboard</Link>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Category Management</h1>
        <p className="mt-2 text-sm text-slate-600">Create categories and control which ones vendors can use.</p>

        <form onSubmit={handleSubmit} className="mt-8 border-y border-slate-200 py-6">
          <h2 className="text-lg font-semibold text-slate-950">Add category</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} className="h-11 rounded-md border border-slate-300 px-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Slug
              <input value={slug} onChange={(event) => setSlug(event.target.value)} required maxLength={120} className="h-11 rounded-md border border-slate-300 px-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} maxLength={500} className="rounded-md border border-slate-300 px-3 py-2" />
            </label>
          </div>
          <button type="submit" disabled={saving} className="mt-4 inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? "Creating..." : "Create category"}
          </button>
        </form>

        {error && <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1fr_1fr_140px_150px] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
            <span>Name</span><span>Slug</span><span>Status</span><span>Action</span>
          </div>
          {loading && <p className="p-5 text-sm text-slate-500">Loading categories...</p>}
          {!loading && categories.map((category) => (
            <div key={category._id} className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_140px_150px] sm:items-center sm:gap-4">
              <p className="font-medium text-slate-900">{category.name}</p>
              <p className="text-sm text-slate-500">/{category.slug}</p>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${category.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {category.isActive ? "Active" : "Inactive"}
              </span>
              <button type="button" disabled={updatingId === category._id} onClick={() => void toggleCategory(category)} className="w-fit text-sm font-semibold text-slate-700 underline underline-offset-4 disabled:opacity-50">
                {updatingId === category._id ? "Updating..." : category.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
          {!loading && categories.length === 0 && <p className="p-5 text-sm text-slate-500">No categories found. Create one above to enable product listings.</p>}
        </div>
      </div>
    </main>
  );
}
