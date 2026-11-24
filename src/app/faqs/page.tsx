
import SiteShell from "@/components/site-shell";
import { getPublishedContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const faqs = await getPublishedContent("faqs");

  return (
    <SiteShell>
      <section className="bg-[#f7f5ef] py-14">
        <div className="container">
          <p className="eyebrow">Buyer support</p>

          <h1 className="mt-3 text-4xl font-black text-[#173c30]">
            Frequently asked questions
          </h1>
        </div>
      </section>

      <section className="container max-w-3xl py-12">
        <div className="space-y-4">
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
      </section>
    </SiteShell>
  );
}
