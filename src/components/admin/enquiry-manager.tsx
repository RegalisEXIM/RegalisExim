
"use client";

import { useState } from "react";

export default function EnquiryManager({
  rows,
}: {
  rows: any[];
}) {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(rows);

  const filtered = items.filter(
    (r) => filter === "all" || r.status === filter
  );

  async function status(id: string, status: string) {
    const response = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      setItems((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
    }
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        <select
          className="input max-w-xs"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All enquiries</option>
          <option value="new">New</option>
          <option value="in-progress">In progress</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((enquiry) => (
          <article
            key={enquiry._id}
            className="rounded-xl border border-[#e4e9e3] bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#173c30]">
                  {enquiry.name}
                </h2>

                <p className="mt-1 text-sm text-[#657168]">
                  {enquiry.company || "Company not supplied"} ·{" "}
                  {enquiry.country || "Country not supplied"}
                </p>

                <a
                  className="mt-1 inline-block text-sm font-semibold text-[#315c43]"
                  href={`mailto:${enquiry.email}`}
                >
                  {enquiry.email}
                </a>
              </div>

              <select
                className="input max-w-[180px]"
                value={enquiry.status || "new"}
                onChange={(event) =>
                  status(enquiry._id, event.target.value)
                }
              >
                <option value="new">New</option>
                <option value="in-progress">In progress</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="mt-4 grid gap-3 rounded-lg bg-[#f7f8f5] p-4 text-sm sm:grid-cols-2">
              <p>
                <b>Product:</b> {enquiry.product || "—"}
              </p>

              <p>
                <b>Quantity:</b> {enquiry.quantity || "—"} kg
              </p>

              <p>
                <b>Term:</b> {enquiry.term || "—"}
              </p>

              <p>
                <b>Destination:</b> {enquiry.destination || "—"}
              </p>

              <p>
                <b>Shipment:</b> {enquiry.shipment || "—"}
              </p>

              <p>
                <b>Packaging:</b> {enquiry.packaging || "—"}
              </p>
            </div>

            {enquiry.message && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#657168]">
                {enquiry.message}
              </p>
            )}

            <p className="mt-4 text-xs text-[#7b867e]">
              Received:{" "}
              {enquiry.createdAt
                ? new Date(enquiry.createdAt).toLocaleString()
                : "Unknown"}
            </p>
          </article>
        ))}

        {!filtered.length && (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-[#657168]">
            No enquiries match this filter.
          </p>
        )}
      </div>
    </>
  );
}
