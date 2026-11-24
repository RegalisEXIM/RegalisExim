
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().max(160).optional().default(""),
  email: z.string().trim().email().max(254),
  country: z.string().max(100).optional().default(""),
  product: z.string().max(200).optional().default(""),
  quantity: z.string().max(50).optional().default(""),
  term: z.string().max(30).optional().default("FOB"),
  destination: z.string().max(160).optional().default(""),
  shipment: z.string().max(20).optional().default("FCL"),
  packaging: z.string().max(100).optional().default(""),
  message: z.string().max(5000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    const db = await getDb();

    await db.collection("enquiries").insertOne({
      ...body,
      status: "new",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { ok: true },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid enquiry or database unavailable" },
      { status: 400 }
    );
  }
}
