
import { ReactNode } from "react";
import { getSettings } from "@/lib/content";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

export default async function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader settings={settings} />

      <main>{children}</main>

      <SiteFooter settings={settings} />
    </>
  );
}
