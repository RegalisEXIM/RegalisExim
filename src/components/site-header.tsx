
import Link from "next/link";
import { SiteSettings } from "@/lib/types";

export default function SiteHeader({
  settings,
}: {
  settings: SiteSettings;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8ece6] bg-white/95 backdrop-blur">
      <div className="container flex min-h-[76px] items-center justify-between gap-4">
        {/* Brand and tagline */}
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#173c30] text-lg font-black text-[#d7b66f]">
            R
          </span>

          <span>
            <strong className="block text-[17px] tracking-[.08em] text-[#173c30]">
              {settings.companyName}
            </strong>

            <small className="text-[10px] font-bold tracking-[.17em] text-[#8b7650]">
              {settings.tagline}
            </small>
          </span>
        </Link>

        {/* Main navigation */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#3f4c43] md:flex">
          <Link href="/products">Products</Link>

          <Link href="/#export">Export Services</Link>

          <Link href="/shipping-calculator">
            Shipping Calculator
          </Link>

          <Link href="/blogs">Insights</Link>

          <Link href="/#faq">FAQs</Link>
        </nav>

        {/* Call to action */}
        <Link
          className="btn btn-primary !px-4 !py-2.5 text-sm"
          href="/contact"
        >
          Request a Quote
        </Link>
      </div>
    </header>
  );
}
