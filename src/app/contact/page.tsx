
import SiteShell from "@/components/site-shell";
import ContactForm from "@/components/contact-form";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
}) {
  const s = await getSettings();
  const q = await searchParams;

  const initial = {
    product: String(q.product || ""),
    quantity: String(q.quantity || ""),
    term: String(q.term || "FOB"),
    destination: String(q.destination || ""),
    shipment: String(q.shipment || "FCL"),
    packaging: String(q.packaging || "25 kg PP bags"),
  };

  return (
    <SiteShell>
      <section className="bg-[#f7f5ef] py-14">
        <div className="container">
          <p className="eyebrow">Talk to our export team</p>

          <h1 className="mt-3 text-4xl font-black text-[#173c30]">
            Request a quotation
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#657168]">
            Share your product specifications and destination. Our team
            can confirm availability, pricing and shipping terms.
          </p>
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[.7fr_1.3fr]">
        <aside>
          <h2 className="text-xl font-extrabold text-[#173c30]">
            Contact details
          </h2>

          <div className="mt-5 space-y-5 text-sm">
            <div>
              <div className="font-bold">Email</div>

              <a
                className="mt-1 block text-[#657168]"
                href={`mailto:${s.email}`}
              >
                {s.email}
              </a>
            </div>

            <div>
              <div className="font-bold">Phone</div>

              <a
                className="mt-1 block text-[#657168]"
                href={`tel:${s.phone}`}
              >
                {s.phone}
              </a>
            </div>

            <div>
              <div className="font-bold">Location</div>

              <p className="mt-1 text-[#657168]">
                {s.address}
              </p>
            </div>

            <div>
              <div className="font-bold">Loading port</div>

              <p className="mt-1 text-[#657168]">
                {s.port}
              </p>
            </div>
          </div>
        </aside>

        <ContactForm initial={initial} />
      </div>
    </SiteShell>
  );
}
