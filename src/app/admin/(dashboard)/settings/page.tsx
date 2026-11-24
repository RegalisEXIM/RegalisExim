import { getSettings } from "@/lib/content";
import SettingsForm from "@/components/admin/settings-form";
export const dynamic="force-dynamic";
export default async function AdminSettings(){const settings=await getSettings();return <><p className="eyebrow">Website configuration</p><h1 className="mt-2 text-3xl font-black text-[#173c30]">Site & shipping settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#657168]">Manage the public company information, homepage messaging, SEO defaults and illustrative calculator assumptions.</p><div className="mt-7"><SettingsForm initial={settings as any}/></div></>}
