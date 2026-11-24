
import type { Metadata } from "next";

import "./globals.css";

import { getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await getSettings();

    return {
      title: s.seoTitle,
      description: s.seoDescription,
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      ),
      applicationName: s.companyName,
    };
  } catch {
    return {
      title: "Regalis Exports | Indian Cumin Seeds Exporter",
      description:
        "Indian cumin seed export enquiries and specifications.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
