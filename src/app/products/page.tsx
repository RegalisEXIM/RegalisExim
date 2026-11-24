
import Image from "next/image";
import Link from "next/link";

import { getProducts } from "@/lib/content";
import SiteShell from "@/components/site-shell";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts(true);

  return (
    <SiteShell>
      <section className="bg-[#f7f5ef] py-14">
        <div className="container">
          <p className="eyebrow">Product catalogue</p>

          <h1 className="mt-3 text-4xl font-black text-[#173c30]">
            Indian cumin seed products
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#657168]">
            Explore listed cleaning and purity specifications. Contact
            us to confirm current availability, quality tolerances and
            export pricing.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.slug} className="card flex h-full flex-col overflow-hidden">
              <div className="relative h-56 shrink-0 bg-[#f1f0e9]">
                {p.imageUrl && (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f3f2e9] px-3 py-1 text-xs font-bold text-[#80652f]">
                    {p.purity} purity
                  </span>

                  <span className="text-xs text-[#657168]">
                    {p.cleaning}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-[#173c30]">
                  {p.name}
                </h2>

                <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-[#657168]">
                  {p.description}
                </p>

                <p className="mt-4 text-sm">
                  <b>Packaging:</b> {p.bagSizes.join(", ")}
                </p>

                <p className="mt-1 text-sm">
                  <b>Shipment:</b> {p.shipmentTypes.join(", ")}
                </p>

                <Link
                  className="btn btn-primary mt-4 w-full"
                  href={`/products/${p.slug}`}
                >
                  View specifications
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!products.length && (
          <p>No published products currently available.</p>
        )}
      </section>
    </SiteShell>
  );
}
