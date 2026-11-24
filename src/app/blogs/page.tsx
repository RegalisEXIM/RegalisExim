
import Link from "next/link";

import { getPublishedContent } from "@/lib/content";
import SiteShell from "@/components/site-shell";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const blogs = await getPublishedContent("blogs");

  return (
    <SiteShell>
      <section className="bg-[#f7f5ef] py-14">
        <div className="container">
          <p className="eyebrow">Knowledge centre</p>

          <h1 className="mt-3 text-4xl font-black text-[#173c30]">
            Export insights &amp; buyer guides
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#657168]">
            Practical information to help buyers understand cumin
            specifications, packaging and export planning.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b: any) => (
            <article
              key={String(b._id)}
              className="card p-6"
            >
              <p className="eyebrow">
                {b.category || "Export guide"}
              </p>

              <h2 className="mt-3 text-xl font-extrabold text-[#173c30]">
                {b.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#657168]">
                {b.excerpt}
              </p>

              <Link
                href={`/blogs/${b.slug}`}
                className="mt-5 inline-block font-bold text-[#315c43]"
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>

        {!blogs.length && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-xl font-bold">
              New buyer guides coming soon
            </h2>

            <p className="mt-2 text-sm text-[#657168]">
              Published articles managed by the admin will appear here.
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
