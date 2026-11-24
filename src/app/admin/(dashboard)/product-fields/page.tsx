
"use client";

import { useEffect, useState } from "react";

type FieldType = "text" | "number" | "textarea" | "select" | "boolean";

type ProductField = {
  _id: string;
  label: string;
  key: string;
  type: FieldType;
  required: boolean;
  options: string[];
  order: number;
};

const blank = {
  label: "",
  type: "text" as FieldType,
  required: false,
  optionsText: "",
  order: 0,
};

export default function ProductFieldsPage() {
  const [fields, setFields] = useState<ProductField[]>([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const r = await fetch("/api/admin/product-fields", {
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setFields(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load fields");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function reset() {
    setForm(blank);
    setEditing("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        label: form.label,
        type: form.type,
        required: form.required,
        order: Number(form.order),
        options: form.optionsText.split(",").map(s => s.trim()).filter(Boolean),
        ...(editing ? { id: editing } : {}),
      };

      const r = await fetch("/api/admin/product-fields", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not save field");

      setNotice(editing ? "Field updated." : "Field added.");
      reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save field");
    } finally {
      setBusy(false);
    }
  }

  function edit(field: ProductField) {
    setEditing(field._id);
    setForm({
      label: field.label,
      type: field.type,
      required: field.required,
      optionsText: (field.options || []).join(", "),
      order: field.order || 0,
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(field: ProductField) {
    if (!confirm(
      `Permanently delete "${field.label}" and its saved values from ALL products? This cannot be undone.`
    )) return;

    setError("");
    setNotice("");

    try {
      const r = await fetch(
        `/api/admin/product-fields?id=${encodeURIComponent(field._id)}`,
        { method: "DELETE" }
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not delete field");

      setNotice(`"${field.label}" and its product values were deleted.`);
      if (editing === field._id) reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete field");
    }
  }

  return (
    <div>
      <p className="eyebrow">Product catalogue</p>
      <h1 className="mt-2 text-3xl font-black text-[#173c30]">
        Product Field Manager
      </h1>
      <p className="mt-2 text-sm text-[#657168]">
        Add custom fields available to every product, including existing products.
      </p>

      {notice && <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <div className="mt-7 grid items-start gap-7 xl:grid-cols-2">
        <form onSubmit={save} className="rounded-xl border border-[#e4e9e3] bg-white p-5">
          <h2 className="mb-5 font-extrabold text-[#173c30]">
            {editing ? "Edit field" : "Add new field"}
          </h2>

          <label className="field-label">Field name</label>
          <input
            className="input mb-4"
            required
            maxLength={100}
            value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Moisture Content"
          />

          <label className="field-label">Field type</label>
          <select
            className="input mb-4"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value as FieldType })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="textarea">Long text</option>
            <option value="select">Dropdown</option>
            <option value="boolean">Yes / No</option>
          </select>

          {form.type === "select" && <>
            <label className="field-label">Dropdown options (comma separated)</label>
            <input
              className="input mb-4"
              required
              value={form.optionsText}
              onChange={e => setForm({ ...form, optionsText: e.target.value })}
              placeholder="Organic, Conventional"
            />
          </>}

          <label className="field-label">Display order</label>
          <input
            className="input mb-4"
            type="number"
            value={form.order}
            onChange={e => setForm({ ...form, order: Number(e.target.value) })}
          />

          <label className="mb-5 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.required}
              onChange={e => setForm({ ...form, required: e.target.checked })}
            />
            Required when saving a product
          </label>

          <div className="flex gap-2">
            <button disabled={busy} className="btn btn-primary flex-1">
              {busy ? "Saving..." : editing ? "Save changes" : "Add field"}
            </button>
            {editing && <button type="button" onClick={reset} className="btn btn-outline">Cancel</button>}
          </div>
        </form>

        <section className="rounded-xl border border-[#e4e9e3] bg-white p-5">
          <h2 className="mb-4 font-extrabold text-[#173c30]">
            Existing fields ({fields.length})
          </h2>
          {fields.length === 0 && (
            <p className="text-sm text-[#657168]">
              No custom fields yet. Your existing built-in product fields are unchanged.
            </p>
          )}
          <div className="space-y-3">
            {fields.map(field => (
              <div key={field._id} className="rounded-lg border border-[#edf0eb] p-4">
                <div className="font-bold text-[#173c30]">{field.label}</div>
                <div className="mt-1 text-xs text-[#657168]">
                  {field.type} · {field.required ? "Required" : "Optional"} · Key: {field.key}
                </div>
                {field.type === "select" && (
                  <div className="mt-1 text-xs text-[#657168]">
                    Options: {field.options.join(", ")}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => edit(field)} className="btn btn-outline !px-3 !py-2 text-xs">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(field)} className="btn !border !border-red-200 !bg-white !px-3 !py-2 !text-xs !text-red-700">
                    Delete permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
