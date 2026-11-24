
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const items = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/products", "Products", Package],
  ["/admin/blogs", "Blogs", BookOpen],
  ["/admin/faqs", "FAQs", HelpCircle],
  ["/admin/enquiries", "Enquiries", MessageSquare],
  ["/admin/settings", "Site & shipping settings", Settings],
] as const;

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between bg-[#173c30] px-5 py-4 text-white md:hidden">
        <b>REGALIS ADMIN</b>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } fixed inset-x-0 top-[57px] z-40 overflow-y-auto bg-[#173c30] p-4 text-white md:sticky md:top-0 md:block md:h-screen md:w-[260px] md:shrink-0 md:p-5`}
      >
        <Link
          href="/admin"
          className="hidden border-b border-white/15 pb-6 md:block"
        >
          <div className="font-extrabold tracking-widest text-[#e1c783]">
            REGALIS EXPORTS
          </div>

          <div className="mt-1 text-xs text-white/55">
            Administration portal
          </div>
        </Link>

        <div className="mt-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/45">
          Manage website
        </div>

        <nav className="mt-3 grid gap-1">
          {items.map(([href, label, Icon]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${
                path === href
                  ? "bg-white/12 text-[#e1c783]"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-white/15 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/70"
          >
            <Globe size={18} />
            View public website
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/70 hover:bg-white/5"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
