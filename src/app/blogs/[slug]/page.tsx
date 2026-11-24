
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getDb } from "@/lib/db";
import SiteShell from "@/components/site-shell";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBlog(slug: string) {
  return (await getDb())
    .collection("blogs")
    .findOne({ slug, published: true });
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBlog(slug);

  return b
    ? {
        title: String(b.seoTitle || b.title),
        description: String(
          b.seoDescription ||
            b.excerpt ||
            "Regalis Exports buyer guide"
        ),
      }
    : {};
}

export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const b = await getBlog(slug);

  if (!b) {
    notFound();
  }

  return (
    <SiteShell>
      <article className="container max-w-3xl py-14">
        <p className="eyebrow">
          {String(b.category || "Export insights")}
        </p>

        <h1 className="mt-3 text-4xl font-black leading-tight text-[#173c30]">
          {String(b.title)}
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#657168]">
          {String(b.excerpt || "")}
        </p>

        <div className="prose-content mt-8 whitespace-pre-wrap">
          {String(b.content || "")}
        </div>

        <a
          className="btn btn-primary mt-8"
          href="/contact"
        >
          Discuss your requirements
        </a>
      </article>
    </SiteShell>
  );
}
