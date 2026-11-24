
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getProductBySlug } from "@/lib/content";
import SiteShell from "@/components/site-shell";

export const dynamic = "force-dynamic";
function customFieldLabel(key: string) {
  return key
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug } = await params;
    const p = await getProductBySlug(slug);

    return p
        ? {
            title: p.seoTitle || p.name,
            description: p.seoDescription || p.description,
        }
        : {};
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const p = await getProductBySlug(slug);

    if (!p) {
        notFound();
    }

    return (
        <SiteShell>
            <div className="container py-10">
                <div className="mb-7 text-sm text-[#657168]">
                    <Link href="/">Home</Link> /{" "}
                    <Link href="/products">Products</Link> / {p.name}
                </div>

                <div className="grid items-start gap-10 lg:grid-cols-2">
                    <div className="relative min-h-[350px] overflow-hidden rounded-2xl bg-[#f7f5ef] sm:min-h-[510px]">
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

                    <div>
                        <p className="eyebrow">{p.category}</p>

                        <h1 className="mt-3 text-4xl font-black leading-tight text-[#173c30]">
                            {p.name}
                        </h1>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#f4f5f0] px-3 py-1.5 text-sm font-bold">
                                {p.purity} purity
                            </span>

                            <span className="rounded-full bg-[#f4f5f0] px-3 py-1.5 text-sm">
                                {p.cleaning}
                            </span>
                        </div>

                        <p className="mt-6 leading-8 text-[#657168]">
                            {p.description}
                        </p>

                        <div className="mt-7 rounded-xl border border-[#e4e9e3] p-5">
                            <h2 className="font-extrabold text-[#173c30]">
                                Product specifications
                            </h2>

                            <dl className="mt-4 divide-y divide-[#edf0eb]">
                                {[
                                    ["Origin", p.origin],
                                    ["Purity", p.purity],
                                    ["Cleaning", p.cleaning],
                                    ["Packaging", (p.packaging || []).join(", ")],
                                    ["Bag sizes", (p.bagSizes || []).join(", ")],
                                    ["Shipment", (p.shipmentTypes || []).join(", ")],
                                    ["Loading port", p.port],
                                    ["Minimum order", p.moq],
                                    ...(p.specifications || []).map(s => [s.label, s.value]),
                                    ...Object.entries(p.customFields || {})
                                        .filter(([, value]) => value !== "" && value !== null && value !== undefined)
                                        .map(([key, value]) => [
                                            customFieldLabel(key),
                                            typeof value === "boolean" ? (value ? "Yes" : "No") : String(value),
                                        ]),
                                ].map(([k, v], i) => (
                                    <div
                                        key={String(k) + i}
                                        className="grid grid-cols-[125px_1fr] gap-4 py-3 text-sm"
                                    >
                                        <dt className="text-[#657168]">{k}</dt>
                                        <dd className="font-semibold text-[#26392d]">{String(v)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <Link
                            href={`/contact?product=${encodeURIComponent(p.name)}`}
                            className="btn btn-primary mt-6 w-full"
                        >
                            Request product quotation
                        </Link>

                        <p className="mt-3 text-xs leading-5 text-[#657168]">
                            Specifications are indicative until confirmed in the
                            final commercial offer and contract.
                        </p>
                    </div>
                </div>
            </div>
        </SiteShell>
    );
}
