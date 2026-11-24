
import SiteShell from "@/components/site-shell";
import ShippingCalculator from "@/components/shipping-calculator";

export const dynamic = "force-dynamic";

export default function ShippingPage() {
  return (
    <SiteShell>
      <section className="bg-[#f7f5ef] py-14">
        <div className="container">
          <p className="eyebrow">Freight estimate</p>

          <h1 className="mt-3 text-4xl font-black text-[#173c30]">
            FOB, CNF/CFR &amp; CIF calculator
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#657168]">
            Create an indicative estimate based on your quantity,
            destination and selected trade term. Final costs are
            confirmed by our team.
          </p>
        </div>
      </section>

      <div className="container py-12">
        <ShippingCalculator />
      </div>
    </SiteShell>
  );
}
