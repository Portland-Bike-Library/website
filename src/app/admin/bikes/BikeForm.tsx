"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Bike } from "@/lib/types";

const INPUT =
  "w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500";
const LABEL = "block text-sm font-medium text-gray-700 mb-1";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function BikeForm({ bike }: { bike?: Bike }) {
  const router = useRouter();
  const isEdit = Boolean(bike);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(bike?.name ?? "");
  const [id, setId] = useState(bike?.id ?? "");
  const [idTouched, setIdTouched] = useState(isEdit);
  const [type, setType] = useState(bike?.type ?? "");
  const [size, setSize] = useState(bike?.size ?? "");
  const [description, setDescription] = useState(bike?.description ?? "");
  const [image, setImage] = useState(bike?.image ?? "");
  const [available, setAvailable] = useState(bike?.available ?? true);
  const [maxLoanPeriod, setMaxLoanPeriod] = useState(bike?.maxLoanPeriod ?? "2 weeks");
  const [featuresText, setFeaturesText] = useState((bike?.features ?? []).join("\n"));
  const [sortOrder, setSortOrder] = useState(String(bike?.sortOrder ?? 0));

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const onNameChange = (v: string) => {
    setName(v);
    if (!idTouched) setId(slugify(v));
  };

  const uploadPhoto = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("hint", id || name);
      const res = await fetch("/api/admin/bikes/photo", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      id,
      name,
      type,
      size,
      description,
      image,
      available,
      maxLoanPeriod,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      sortOrder: Number(sortOrder) || 0,
    };
    try {
      const res = await fetch(isEdit ? `/api/admin/bikes/${bike!.id}` : "/api/admin/bikes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/bikes");
        router.refresh();
        return;
      }
      setError(data.error || "Save failed.");
    } catch {
      setError("Network error.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!bike) return;
    if (!window.confirm(`Delete "${bike.name}"? This can't be undone.`)) return;
    setError("");
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/bikes/${bike.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/bikes");
        router.refresh();
        return;
      }
      setError(data.error || "Delete failed.");
    } catch {
      setError("Network error.");
    }
    setDeleting(false);
  };

  const busy = saving || deleting || uploading;

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin/bikes" className="text-green-700 text-sm hover:underline">
          &larr; All bikes
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-8">
          {isEdit ? `Edit ${bike!.name}` : "Add a bike"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6 grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className={LABEL}>Name</label>
              <input id="name" required value={name} onChange={(e) => onNameChange(e.target.value)} className={INPUT} placeholder="Woom Now 6" />
            </div>
            <div>
              <label htmlFor="id" className={LABEL}>
                ID <span className="text-gray-400">(in the URL; can&apos;t change after saving)</span>
              </label>
              <input
                id="id"
                required
                value={id}
                disabled={isEdit}
                onChange={(e) => { setIdTouched(true); setId(slugify(e.target.value)); }}
                className={`${INPUT} font-mono text-sm disabled:bg-gray-100 disabled:text-gray-500`}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
              />
            </div>
            <div>
              <label htmlFor="type" className={LABEL}>Type</label>
              <input id="type" required list="bike-types" value={type} onChange={(e) => setType(e.target.value)} className={INPUT} placeholder="Cargo E-Bike" />
              <datalist id="bike-types">
                <option value="Cargo E-Bike" />
                <option value="Utility E-Bike" />
                <option value="Kids Bike" />
                <option value="Adult Bike" />
              </datalist>
            </div>
            <div>
              <label htmlFor="size" className={LABEL}>Size / fit</label>
              <input id="size" value={size} onChange={(e) => setSize(e.target.value)} className={INPUT} placeholder={`Adult (5'3" - 6'3")`} />
            </div>
            <div>
              <label htmlFor="maxLoanPeriod" className={LABEL}>Max loan period</label>
              <input id="maxLoanPeriod" value={maxLoanPeriod} onChange={(e) => setMaxLoanPeriod(e.target.value)} className={INPUT} placeholder="2 weeks" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className={LABEL}>Description</label>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={INPUT} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="features" className={LABEL}>
                Features <span className="text-gray-400">(one per line)</span>
              </label>
              <textarea id="features" rows={6} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className={`${INPUT} text-sm`} placeholder={"Hydraulic disc brakes\nIntegrated lights"} />
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Photo</h2>
            <div className="flex gap-6 items-start">
              <div className="w-40 h-40 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow space-y-3">
                <div>
                  <label htmlFor="photo" className={LABEL}>Upload (JPEG, PNG, or WebP, under 5 MB)</label>
                  <input
                    id="photo"
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}
                    className="text-sm"
                  />
                  {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
                </div>
                <div>
                  <label htmlFor="image" className={LABEL}>
                    or image URL
                  </label>
                  <input id="image" value={image} onChange={(e) => setImage(e.target.value)} className={`${INPUT} text-sm`} placeholder="https://..." />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6 grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
              <span className="text-gray-700">Available to reserve</span>
            </label>
            <div>
              <label htmlFor="sortOrder" className={LABEL}>
                Sort order <span className="text-gray-400">(lower shows first)</span>
              </label>
              <input id="sortOrder" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={`${INPUT} w-32`} />
            </div>
          </section>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>}

          <div className="flex justify-between items-center">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="text-red-600 text-sm hover:underline disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete bike"}
              </button>
            ) : <span />}
            <button
              type="submit"
              disabled={busy}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add bike"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
