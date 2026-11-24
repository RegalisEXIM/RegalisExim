
import { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f7f8f5] md:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        {children}
      </main>
    </div>
  );
}
