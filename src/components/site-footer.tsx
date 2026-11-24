
import Link from "next/link";
import { SiteSettings } from "@/lib/types";

export default function SiteFooter({
  settings,
}: {
  settings: SiteSettings;
}) {
  return (
    <footer className="mt-20 bg-[#142f26] text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Company information */}
        <div>
          <div className="text-xl font-extrabold tracking-widest text-[#e1c783]">
            {settings.companyName}
          </div>

          <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
            {settings.footerText}
          </p>

          <p className="mt-4 text-sm text-white/70">
            {settings.address}
          </p>
        </div>

        {/* Navigation links */}
        <div>
          <h3 className="font-bold">Explore</h3>

          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/products">Cumin products</Link>

            <Link href="/shipping-calculator">
              Shipping calculator
            </Link>

            <Link href="/blogs">Export insights</Link>

            <Link href="/#faq">
              Frequently asked questions
            </Link>
          </div>
        </div>

        {/* Contact information */}
        <div>
          <h3 className="font-bold">Contact our team</h3>

          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <a href={`mailto:${settings.email}`}>
              {settings.email}
            </a>

            <a href={`tel:${settings.phone}`}>
              {settings.phone}
            </a>

            <p>Loading port: {settings.port}</p>

            <Link
              href="/contact"
              className="text-[#e1c783]"
            >
              Discuss your requirements →
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright and disclaimer */}
      <div className="border-t border-white/10">
        <div className="container flex flex-wrap justify-between gap-3 py-5 text-xs text-white/50">
          <span>
            © {new Date().getFullYear()} {settings.companyName}. All
            rights reserved.
          </span>

          <span>
            Product specifications and freight estimates require
            confirmation.
          </span>
        </div>
      </div>
    </footer>
  );
}
