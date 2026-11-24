"use client";
import { useEffect, useState } from "react";
type Resource = "products" | "blogs" | "faqs";
type ProductFieldDefinition = {
  _id: string;
  label: string;
  key: string;
  type: "text" | "number" | "textarea" | "select" | "boolean";
  required: boolean;
  options: string[];
  order: number;
};
const productBlank = { name: "", slug: "", category: "Cumin Seeds", purity: "99%", cleaning: "Machine cleaned", origin: "India", packaging: ["Jute bags", "PP bags"], bagSizes: ["10 kg", "25 kg", "50 kg"], shipmentTypes: ["FCL", "LCL"], port: "Mundra Port, India", moq: "Buyer enquiry", description: "", specifications: [], imageUrl: "", currency: "USD", published: false, seoTitle: "", seoDescription: "", packagingText: "Jute bags, PP bags", bagSizesText: "10 kg, 25 kg, 50 kg", shipmentTypesText: "FCL, LCL", customFields: {}, };
const blogBlank = { title: "", slug: "", category: "Export guide", excerpt: "", content: "", published: false, seoTitle: "", seoDescription: "" };
const faqBlank = { question: "", answer: "", published: true, order: 0 };
function slugify(s: string) { return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }
export default function Manager({ resource }: { resource: Resource }) {
  const [customFieldDefs, setCustomFieldDefs] =
    useState<ProductFieldDefinition[]>([]);
  const [rows, setRows] = useState<any[]>([]), [form, setForm] = useState<any>(resource === "products" ? productBlank : resource === "blogs" ? blogBlank : faqBlank), [editing, setEditing] = useState(""), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState(""); const title = resource === "products" ? "Products" : resource === "blogs" ? "Blog posts" : "Frequently asked questions";
  async function load() { setLoading(true); try { const r = await fetch(`/api/admin/${resource}`, { cache: "no-store" }); const d = await r.json(); if (!r.ok) throw new Error(d.error); setRows(d) } catch (e) { setError(e instanceof Error ? e.message : "Could not load records") } finally { setLoading(false) } }

  useEffect(() => {
    if (resource !== "products") return;

    async function loadProductFields() {
      try {
        const r = await fetch("/api/admin/product-fields", {
          cache: "no-store",
        });
        const d = await r.json();
        if (r.ok) setCustomFieldDefs(d);
      } catch (e) {
        console.error("Could not load product field definitions", e);
      }
    }

    void loadProductFields();
  }, [resource]);

  useEffect(() => { load() }, [resource]);
  function startEdit(row: any) {
    const copy = { ...row }; if (resource === "products") {
      copy.customFields = row.customFields || {};
      copy.packagingText = (row.packaging || []).join(", "); copy.bagSizesText = (row.bagSizes || []).join(", "); copy.shipmentTypesText = (row.shipmentTypes || []).join(", ");
    } delete copy._id; delete copy.createdAt; delete copy.updatedAt; setForm(copy); setEditing(row._id); setError(""); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" })
  }
  function fresh() { setForm(resource === "products" ? productBlank : resource === "blogs" ? blogBlank : faqBlank); setEditing(""); setError(""); setNotice("") }
  function field(k: string, v: any) { setForm((p: any) => ({ ...p, [k]: v, ...(k === "name" && !editing ? { slug: slugify(v), seoTitle: p.seoTitle || v } : {}), ...(k === "title" && !editing ? { slug: slugify(v), seoTitle: p.seoTitle || v } : {}) })) }
  function splitField(k: string, v: string) { field(k, v.split(",").map(x => x.trim()).filter(Boolean)) }
  async function save(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(""); setNotice(""); try { const payload = { ...form }; if (resource === "products") { payload.packaging = (payload.packagingText || "").split(",").map((x: string) => x.trim()).filter(Boolean); payload.bagSizes = (payload.bagSizesText || "").split(",").map((x: string) => x.trim()).filter(Boolean); payload.shipmentTypes = (payload.shipmentTypesText || "").split(",").map((x: string) => x.trim()).filter(Boolean); delete payload.packagingText; delete payload.bagSizesText; delete payload.shipmentTypesText; if (!payload.specifications) payload.specifications = []; } const r = await fetch(`/api/admin/${resource}`, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...payload, id: editing } : payload) }); const d = await r.json(); if (!r.ok) throw new Error(d.error || "Save failed"); setNotice(editing ? "Changes saved." : "Record created."); fresh(); await load() } catch (e) { setError(e instanceof Error ? e.message : "Save failed") } finally { setBusy(false) } }
  async function remove(id: string) { if (!confirm("Delete this record permanently?")) return; try { const r = await fetch(`/api/admin/${resource}?id=${id}`, { method: "DELETE" }); const d = await r.json(); if (!r.ok) throw new Error(d.error); setNotice("Record deleted."); await load() } catch (e) { setError(e instanceof Error ? e.message : "Delete failed") } }
  function TextField({ k, label, required = false, area = false, placeholder = "" }: { k: string; label: string; required?: boolean; area?: boolean; placeholder?: string }) { return <div className="mb-4"><label className="field-label">{label}</label>{area ? <textarea className="input min-h-24" required={required} value={form[k] ?? ""} placeholder={placeholder} onChange={e => field(k, e.target.value)} /> : <input className="input" required={required} value={form[k] ?? ""} placeholder={placeholder} onChange={e => field(k, e.target.value)} />}</div> }
  return <><div><p className="eyebrow">Content management</p><h1 className="mt-2 text-3xl font-black text-[#173c30]">{title}</h1><p className="mt-2 text-sm text-[#657168]">Create, update, publish and remove website content.</p></div>{notice && <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="mt-7 grid items-start gap-7 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]"><section className="rounded-xl border border-[#e4e9e3] bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-extrabold text-[#173c30]">Existing records ({rows.length})</h2><button onClick={load} className="btn btn-outline !px-3 !py-2 text-xs">Refresh</button></div>{loading ? <p className="py-8 text-sm text-[#657168]">Loading…</p> : rows.length ? <div className="mt-4 space-y-3">{rows.map(row => <div key={row._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#edf0eb] p-4"><div className="min-w-0"><div className="font-bold text-[#173c30]">{row.name || row.title || row.question || row.email || "Untitled"}</div><div className="mt-1 text-xs text-[#657168]">{row.slug || row.category || row.status || ""}</div><span className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${row.published === false ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"}`}>{row.published === false ? "Draft" : "Published / active"}</span></div><div className="flex gap-2"><button onClick={() => startEdit(row)} className="btn btn-outline !px-3 !py-2 text-xs">Edit</button><button onClick={() => remove(row._id)} className="btn !border !border-red-200 !bg-white !px-3 !py-2 !text-xs !text-red-700">Delete</button></div></div>)}</div> : <p className="py-8 text-sm text-[#657168]">No records yet. Create your first record using the form.</p>}</section>
      <form onSubmit={save} className="rounded-xl border border-[#e4e9e3] bg-white p-5"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-extrabold text-[#173c30]">{editing ? "Edit record" : "Create new"}</h2>{editing && <button type="button" onClick={fresh} className="text-xs font-bold text-[#315c43]">Cancel edit</button>}</div>
        {resource === "products" && <><TextField k="name" label="Product name" required /><TextField k="slug" label="URL slug" required /><TextField k="category" label="Category" required /><div className="grid grid-cols-2 gap-3"><TextField k="purity" label="Purity" required /><TextField k="cleaning" label="Cleaning method" required /></div><div className="grid grid-cols-2 gap-3"><TextField k="origin" label="Origin" /><TextField k="port" label="Loading port" /></div><TextField k="packagingText" label="Packaging types (comma separated)" placeholder="Jute bags, PP bags" /><TextField k="bagSizesText" label="Bag sizes (comma separated)" placeholder="10 kg, 25 kg, 50 kg" /><TextField k="shipmentTypesText" label="Shipment types (comma separated)" placeholder="FCL, LCL" /><TextField k="moq" label="Minimum order quantity" /><TextField k="description" label="Description" area required /><div className="mb-4">
  <label className="field-label">Product Image URL</label>

  <input
    className="input"
    type="url"
    value={form.imageUrl ?? ""}
    placeholder="https://example.com/product-image.jpg"
    onChange={e => field("imageUrl", e.target.value)}
  />

  {form.imageUrl && (
    <div className="mt-3">
      <p className="mb-2 text-xs font-semibold text-[#657168]">
        Image preview
      </p>
      <img
        src={form.imageUrl}
        alt="Product preview"
        className="h-40 w-full rounded-lg border border-[#e4e9e3] object-cover"
        onError={e => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  )}
</div><TextField k="seoTitle" label="SEO title" /><TextField k="seoDescription" label="SEO description" area /></>}
        {resource === "blogs" && <><TextField k="title" label="Article title" required /><TextField k="slug" label="URL slug" required /><TextField k="category" label="Category" /><TextField k="excerpt" label="Short excerpt" area required /><TextField k="content" label="Article content (plain text; separate paragraphs with blank lines)" area required /><TextField k="seoTitle" label="SEO title" /><TextField k="seoDescription" label="SEO description" area /></>}
        {resource === "faqs" && <><TextField k="question" label="Question" required /><TextField k="answer" label="Answer" area required /><div className="mb-4"><label className="field-label">Display order</label><input className="input" type="number" value={form.order ?? 0} onChange={e => field("order", Number(e.target.value))} /></div></>}
        {resource !== "faqs" && <div className="mb-4"><label className="field-label">Visibility</label><select className="input" value={String(form.published)} onChange={e => field("published", e.target.value === "true")}><option value="false">Draft — hidden from public</option><option value="true">Published — visible on website</option></select></div>}
        {resource === "faqs" && <div className="mb-4"><label className="field-label">Visibility</label><select className="input" value={String(form.published)} onChange={e => field("published", e.target.value === "true")}><option value="false">Draft — hidden from public</option><option value="true">Published — visible on website</option></select></div>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "Saving…" : editing ? "Save changes" : "Create record"}</button>
        {resource === "products" && <p className="mt-3 text-xs leading-5 text-[#657168]">For comma-separated inputs, separate items with commas. Specifications are managed in the database/API and can be expanded in the next iteration.</p>}
      </form></div>
    {customFieldDefs.length > 0 && (
      <div className="mt-6 border-t border-[#e4e9e3] pt-5">
        <h3 className="mb-4 font-extrabold text-[#173c30]">
          Custom product fields
        </h3>

        {customFieldDefs.map(def => {
          const value = form.customFields?.[def.key] ??
            (def.type === "boolean" ? false : "");

          function updateValue(nextValue: string | number | boolean) {
            field("customFields", {
              ...(form.customFields || {}),
              [def.key]: nextValue,
            });
          }

          return (
            <div key={def._id} className="mb-4">
              <label className="field-label">
                {def.label}{def.required ? " *" : ""}
              </label>

              {def.type === "textarea" ? (
                <textarea
                  className="input min-h-24"
                  required={def.required}
                  value={String(value)}
                  onChange={e => updateValue(e.target.value)}
                />
              ) : def.type === "select" ? (
                <select
                  className="input"
                  required={def.required}
                  value={String(value)}
                  onChange={e => updateValue(e.target.value)}
                >
                  <option value="">Select an option</option>
                  {def.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : def.type === "boolean" ? (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={e => updateValue(e.target.checked)}
                  />
                  Yes
                </label>
              ) : (
                <input
                  className="input"
                  type={def.type === "number" ? "number" : "text"}
                  required={def.required}
                  value={String(value)}
                  onChange={e => updateValue(
                    def.type === "number" && e.target.value !== ""
                      ? Number(e.target.value)
                      : e.target.value
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    )}
  </>
}
