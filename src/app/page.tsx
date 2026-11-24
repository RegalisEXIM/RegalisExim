
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Globe2,
  Ship,
  Sparkles,
  Globe,
} from "lucide-react";

import SiteShell from "@/components/site-shell";
import {
  getProducts,
  getPublishedContent,
  getSettings,
} from "@/lib/content";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, products, faqs] = await Promise.all([
    getSettings(),
    getProducts(true),
    getPublishedContent("faqs"),
  ]);

  const featured = products.slice(0, 3);

  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden bg-[#173c30] text-white">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Image
            src={settings.heroImage}
            alt="Spices and cumin seeds"
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#102c22] via-[#173c30]/95 to-[#173c30]/55" />

        <div className="container grid min-h-[590px] items-center gap-12 py-20 md:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold tracking-wide text-[#ead49b]">
              <Globe size={14} />
              INDIAN SPICES · GLOBAL REACH
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {settings.heroTitle}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              {settings.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-gold">
                Explore Products
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/contact"
                className="btn border border-white/30 bg-white/5 text-white"
              >
                Request a Quote
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <BadgeCheck size={17} className="text-[#e1c783]" />
                99% / 99.5% options
              </span>

              <span className="flex items-center gap-2">
                <Ship size={17} className="text-[#e1c783]" />
                {settings.port}
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative ml-auto aspect-[4/5] max-h-[430px] w-full max-w-[390px] overflow-hidden rounded-[180px_180px_20px_20px] border border-white/20 shadow-2xl">
              <Image
                src={settings.heroImage}
                alt="Indian spices prepared for export"
                fill
                className="object-cover"
                unoptimized
              />

              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/20 bg-[#173c30]/85 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-widest text-[#e1c783]">
                  Export-ready specifications
                </p>

                <p className="mt-1 font-bold">
                  Flexible packing · FCL &amp; LCL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e8ece6] bg-[#faf9f5]">
        <div className="container grid gap-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BadgeCheck,
              title: "Specified purity",
              desc: "99% and 99.5% options",
            },
            {
              icon: Sparkles,
              title: "Cleaning choices",
              desc: "Machine or Sortex",
            },
            {
              icon: Boxes,
              title: "Flexible packing",
              desc: "10 / 25 / 50 kg bag options",
            },
            {
              icon: Globe2,
              title: "Export logistics",
              desc: "FCL and LCL enquiries",
            },
          ].map((x) => (
            <div key={x.title} className="flex gap-3">
              <x.icon
                className="mt-1 shrink-0 text-[#8c6b2f]"
                size={23}
              />

              <div>
                <div className="font-bold text-[#173c30]">
                  {x.title}
                </div>

                <div className="mt-1 text-sm text-[#68736b]">
                  {x.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Our product range</p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#173c30] sm:text-4xl">
              Cumin seeds for your requirements
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#657168]">
              Review the available specifications and send us your
              target quantity, packing and destination for a tailored
              quotation.
            </p>
          </div>

          <Link
            href="/products"
            className="font-bold text-[#315c43]"
          >
            View all products →
          </Link>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <article key={p.slug} className="card group">
              <div className="relative h-56 bg-[#f1f0e9]">
                {p.imageUrl && (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                )}

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#173c30]">
                  {p.purity} purity
                </span>
              </div>

              <div className="p-5">
                <p className="eyebrow">{p.category}</p>

                <h3 className="mt-2 text-xl font-extrabold text-[#173c30]">
                  {p.name}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#657168]">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.bagSizes.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-[#f4f5f0] px-3 py-1 text-xs font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/products/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-2 font-bold text-[#315c43]"
                >
                  Product details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!featured.length && (
          <p className="mt-8 rounded-xl bg-[#f7f5ef] p-6 text-[#657168]">
            Products are being prepared. Please contact us for current
            specifications.
          </p>
        )}
      </section>

      <section id="export" className="bg-[#f7f5ef] py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Export support</p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#173c30] sm:text-4xl">
              Clear specifications. Practical shipping options.
            </h2>

            <p className="mt-5 leading-8 text-[#657168]">
              Discuss product requirements, packaging, shipment size and
              destination with our team. Export terms and final freight
              costs are confirmed in your written quotation.
            </p>

            <Link
              href="/shipping-calculator"
              className="btn btn-primary mt-6"
            >
              Estimate shipping costs
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "Choose a specification",
                d: "Purity, cleaning process and quality requirements.",
              },
              {
                n: "02",
                t: "Select packaging",
                d: "Bag material and 10, 25 or 50 kg formats.",
              },
              {
                n: "03",
                t: "Plan shipment",
                d: "FCL or LCL with destination details.",
              },
              {
                n: "04",
                t: "Request a quotation",
                d: "Review applicable Incoterms and final charges.",
              },
            ].map((x) => (
              <div
                key={x.n}
                className="rounded-xl border border-[#e1e5dc] bg-white p-5"
              >
                <span className="text-sm font-extrabold text-[#a4813c]">
                  {x.n}
                </span>

                <h3 className="mt-3 font-extrabold text-[#173c30]">
                  {x.t}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657168]">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container py-20">
        <p className="eyebrow">Buyer information</p>

        <h2 className="mt-3 text-3xl font-extrabold text-[#173c30]">
          Frequently asked questions
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((f: any) => (
            <details
              key={String(f._id)}
              className="rounded-xl border border-[#e4e9e3] p-5"
            >
              <summary className="cursor-pointer font-bold text-[#173c30]">
                {f.question}
              </summary>

              <p className="mt-3 text-sm leading-7 text-[#657168]">
                {f.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/faqs"
            className="font-bold text-[#315c43]"
          >
            All FAQs →
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
