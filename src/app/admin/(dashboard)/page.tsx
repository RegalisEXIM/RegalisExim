import Link from "next/link";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const db = await getDb();

  const [products, blogs, faqs, enquiries] = await Promise.all(
    ["products", "blogs", "faqs", "enquiries"].map((collection) =>
      db.collection(collection).countDocuments()
    )
  );

  const latest = await db
    .collection("enquiries")
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  const stats = [
    {
      name: "Products",
      count: products,
      href: "/admin/products",
    },
    {
      name: "Blog posts",
      count: blogs,
      href: "/admin/blogs",
    },
    {
      name: "FAQs",
      count: faqs,
      href: "/admin/faqs",
    },
    {
      name: "Buyer enquiries",
      count: enquiries,
      href: "/admin/enquiries",
    },
  ];

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>

          <h1 className="mt-2 text-3xl font-black text-[#173c30]">
            Welcome to Regalis Admin
          </h1>

          <p className="mt-2 text-sm text-[#657168]">
            Manage your storefront, product catalogue and buyer enquiries.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="btn btn-primary"
        >
          View website ↗
        </Link>
      </div>

      {/* Dashboard Statistics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className="rounded-xl border border-[#e4e9e3] bg-white p-5 hover:border-[#9fb5a2]"
          >
            <p className="text-sm font-semibold text-[#657168]">
              {item.name}
            </p>

            <p className="mt-2 text-3xl font-black text-[#173c30]">
              {item.count}
            </p>

            <p className="mt-3 text-xs font-bold text-[#315c43]">
              Manage {item.name.toLowerCase()} →
            </p>
          </Link>
        ))}
      </div>

      {/* Latest Buyer Enquiries */}
      <section className="mt-8 rounded-xl border border-[#e4e9e3] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-[#173c30]">
            Latest enquiries
          </h2>

          <Link
            href="/admin/enquiries"
            className="text-sm font-bold text-[#315c43]"
          >
            View all →
          </Link>
        </div>

        {latest.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[#657168]">
                <tr>
                  <th className="py-3">Buyer</th>
                  <th>Product</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {latest.map((e: any) => (
                  <tr
                    key={e._id.toString()}
                    className="border-t border-[#edf0eb]"
                  >
                    <td className="py-3">
                      <b>{e.name}</b>

                      <div className="text-xs text-[#657168]">
                        {e.email}
                      </div>
                    </td>

                    <td>
                      {e.product || "General enquiry"}
                    </td>

                    <td>
                      {e.destination || e.country || "—"}
                    </td>

                    <td>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                        {e.status || "new"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg bg-[#f7f5ef] p-5 text-sm text-[#657168]">
            No enquiries yet. New buyer requests submitted on the website
            will appear here.
          </p>
        )}
      </section>

      {/* Admin Tip */}
      <p className="mt-6 text-xs text-[#657168]">
        Tip: update the temporary company details and calculator assumptions
        under{" "}
        <Link
          className="font-bold underline"
          href="/admin/settings"
        >
          Site & shipping settings
        </Link>{" "}
        before launching.
      </p>
    </>
  );
}