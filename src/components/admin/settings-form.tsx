
"use client";

import { useState } from "react";

const fields: [string, string, boolean?][] = [
  ["companyName", "Company name"],
  ["tagline", "Tagline"],
  ["email", "Business email"],
  ["phone", "Phone"],
  ["whatsapp", "WhatsApp number"],
  ["address", "Business address"],
  ["port", "Default loading port"],
  ["heroTitle", "Homepage headline"],
  ["heroDescription", "Homepage description", true],
  ["heroImage", "Homepage image URL"],
  ["footerText", "Footer text", true],
  ["defaultDestination", "Default destination hint"],
  ["seoTitle", "Default SEO title"],
  ["seoDescription", "Default SEO description", true],
];

const numbers: [string, string][] = [
  ["defaultProductPrice", "Illustrative product price per kg"],
  ["originCharges", "Origin charges per shipment"],
  ["freightPerTon", "Illustrative freight per metric ton"],
  ["insurancePercent", "Insurance rate (%)"],
  ["handlingPerShipment", "Handling per shipment"],
];

export default function SettingsForm({
  initial,
}: {
  initial: any;
}) {
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const r = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...v,
          defaultProductPrice: Number(v.defaultProductPrice),
          originCharges: Number(v.originCharges),
          freightPerTon: Number(v.freightPerTon),
          insurancePercent: Number(v.insurancePercent),
          handlingPerShipment: Number(v.handlingPerShipment),
        }),
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error);
      }

      setMessage(
        "Settings saved successfully. Refresh the public website to review changes."
      );
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Could not save settings"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={save}
      className="max-w-4xl rounded-xl border border-[#e4e9e3] bg-white p-5 sm:p-7"
    >
      <h2 className="text-lg font-extrabold text-[#173c30]">
        Company & website content
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map(([k, label, area]) => (
          <div
            key={k}
            className={area ? "sm:col-span-2" : ""}
          >
            <label className="field-label">{label}</label>

            {area ? (
              <textarea
                className="input min-h-24"
                value={v[k] ?? ""}
                onChange={(e) =>
                  setV((p: any) => ({
                    ...p,
                    [k]: e.target.value,
                  }))
                }
              />
            ) : (
              <input
                className="input"
                type={k === "email" ? "email" : "text"}
                required={[
                  "companyName",
                  "email",
                  "phone",
                  "heroTitle",
                ].includes(k)}
                value={v[k] ?? ""}
                onChange={(e) =>
                  setV((p: any) => ({
                    ...p,
                    [k]: e.target.value,
                  }))
                }
              />
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-9 border-t border-[#edf0eb] pt-7 text-lg font-extrabold text-[#173c30]">
        Shipping calculator assumptions
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#657168]">
        Temporary estimates only. Replace with current quotes and the
        right rate basis for each destination and shipment type before
        making the calculator public.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {numbers.map(([k, label]) => (
          <div key={k}>
            <label className="field-label">
              {label} ({v.currency || "USD"})
            </label>

            <input
              className="input"
              type="number"
              min="0"
              step=".01"
              required
              value={v[k] ?? 0}
              onChange={(e) =>
                setV((p: any) => ({
                  ...p,
                  [k]: e.target.value,
                }))
              }
            />
          </div>
        ))}

        <div>
          <label className="field-label">Currency</label>

          <select
            className="input"
            value={v.currency || "USD"}
            onChange={(e) =>
              setV((p: any) => ({
                ...p,
                currency: e.target.value,
              }))
            }
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>INR</option>
            <option>AED</option>
          </select>
        </div>
      </div>

      {message && (
        <p className="mt-5 rounded-lg bg-[#f7f5ef] p-3 text-sm">
          {message}
        </p>
      )}

      <button
        disabled={busy}
        className="btn btn-primary mt-7 w-full sm:w-auto"
      >
        {busy ? "Saving…" : "Save all settings"}
      </button>
    </form>
  );
}
