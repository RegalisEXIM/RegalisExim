import { getDb } from "@/lib/db";
import EnquiryManager from "@/components/admin/enquiry-manager";
export const dynamic="force-dynamic";
export default async function EnquiriesPage(){const docs=await (await getDb()).collection("enquiries").find({}).sort({createdAt:-1}).limit(500).toArray();const rows=docs.map(d=>({...d,_id:d._id.toString(),createdAt:d.createdAt instanceof Date?d.createdAt.toISOString():String(d.createdAt||"")}));return <><p className="eyebrow">Buyer communications</p><h1 className="mt-2 text-3xl font-black text-[#173c30]">Buyer enquiries</h1><p className="mt-2 text-sm text-[#657168]">Review quote requests submitted through the public website.</p><div className="mt-7"><EnquiryManager rows={rows}/></div></>}
