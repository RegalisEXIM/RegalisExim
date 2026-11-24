
"use client";

import { useState } from "react";

export default function ContactForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    country: "",
    product: initial.product || "",
    quantity: initial.quantity || "",
    term: initial.term || "FOB",
    destination: initial.destination || "",
    shipment: initial.shipment || "FCL",
    packaging: initial.packaging || "25 kg PP bags",
    message: "",
  });

  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function update(k: string, v: string) {
    setForm((p) => ({
      ...p,
      [k]: v,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    try {
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!r.ok) {
        throw new Error();
      }

      setState("success");

      setForm((p) => ({
        ...p,
        name: "",
        company: "",
        email: "",
        country: "",
        message: "",
      }));
    } catch {
      setState("error");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[#e4e9e3] p-6 sm:p-8"
    >
      <h2 className="text-xl font-extrabold text-[#173c30]">
        Buyer enquiry form
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {[
          { k: "name", l: "Full name", req: true },
          { k: "company", l: "Company name" },
          { k: "email", l: "Business email", req: true },
          { k: "country", l: "Country" },
          { k: "product", l: "Product of interest" },
          { k: "quantity", l: "Quantity (kg)" },
          { k: "destination", l: "Destination port / country" },
          { k: "packaging", l: "Packaging" },
        ].map((f) => (
          <div key={f.k}>
            <label className="field-label">{f.l}</label>

            <input
              className="input"
              required={!!f.req}
              type={f.k === "email" ? "email" : "text"}
              value={(form as any)[f.k]}
              onChange={(e) => update(f.k, e.target.value)}
            />
          </div>
        ))}

        <div>
          <label className="field-label">Trade term</label>

          <select
            className="input"
            value={form.term}
            onChange={(e) => update("term", e.target.value)}
          >
            <option>FOB</option>
            <option>CNF / CFR</option>
            <option>CIF</option>
          </select>
        </div>

        <div>
          <label className="field-label">Shipment type</label>

          <select
            className="input"
            value={form.shipment}
            onChange={(e) => update("shipment", e.target.value)}
          >
            <option>FCL</option>
            <option>LCL</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">
            Tell us about your requirements
          </label>

          <textarea
            className="input min-h-28"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Purity, quality tolerances, delivery timing, inspection or documentation needs…"
          />
        </div>
      </div>

      {state === "success" && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Enquiry submitted successfully. Thank you.
        </p>
      )}

      {state === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          We could not submit the enquiry. Please check the database
          connection and try again.
        </p>
      )}

      <button
        className="btn btn-primary mt-6 w-full"
        disabled={state === "loading"}
      >
        {state === "loading" ? "Submitting…" : "Submit enquiry"}
      </button>

      <p className="mt-3 text-xs leading-5 text-[#657168]">
        Your details are used to respond to this enquiry. Do not submit
        confidential payment information.
      </p>
    </form>
  );
}
