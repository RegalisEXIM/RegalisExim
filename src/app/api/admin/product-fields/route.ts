
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const fieldSchema = z.object({
  label: z.string().trim().min(1).max(100),
  type: z.enum(["text", "number", "textarea", "select", "boolean"]),
  required: z.boolean().default(false),
  options: z.array(z.string().trim().min(1).max(100)).max(100).default([]),
  order: z.number().int().default(0),
});

function makeKey(label: string) {
  return label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  if (!await getSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const fields = await db.collection("productFieldDefinitions")
      .find({})
      .sort({ order: 1, label: 1 })
      .toArray();

    return NextResponse.json(fields.map(f => ({
      ...f,
      _id: f._id.toString(),
    })));
  } catch {
    return NextResponse.json(
      { error: "Could not load product fields" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!await getSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = fieldSchema.parse(await req.json());

    if (parsed.type === "select" && !parsed.options.length) {
      return NextResponse.json(
        { error: "Dropdown fields need at least one option." },
        { status: 400 }
      );
    }

    const key = makeKey(parsed.label);
    if (!key) {
      return NextResponse.json(
        { error: "Enter a valid field name." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db.collection("productFieldDefinitions")
      .findOne({ key });

    if (existing) {
      return NextResponse.json(
        { error: "A field with this name already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const result = await db.collection("productFieldDefinitions").insertOne({
      ...parsed,
      key,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      ok: true,
      id: result.insertedId.toString(),
      key,
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof z.ZodError
        ? e.issues[0]?.message || "Invalid field"
        : "Could not create field",
    }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!await getSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = body.id;

    if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { error: "Invalid field ID" },
        { status: 400 }
      );
    }

    const parsed = fieldSchema.parse(body);

    if (parsed.type === "select" && !parsed.options.length) {
      return NextResponse.json(
        { error: "Dropdown fields need at least one option." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const fields = db.collection("productFieldDefinitions");
    const current = await fields.findOne({
      _id: new (await import("mongodb")).ObjectId(id),
    });

    if (!current) {
      return NextResponse.json(
        { error: "Field not found" },
        { status: 404 }
      );
    }

    // Keep the original key so existing product values remain connected.
    await fields.updateOne(
      { _id: current._id },
      { $set: { ...parsed, updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof z.ZodError
        ? e.issues[0]?.message || "Invalid field"
        : "Could not update field",
    }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!await getSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { error: "Invalid field ID" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const fields = db.collection("productFieldDefinitions");
    const { ObjectId } = await import("mongodb");
    const field = await fields.findOne({ _id: new ObjectId(id) });

    if (!field) {
      return NextResponse.json(
        { error: "Field not found" },
        { status: 404 }
      );
    }

    // Permanently remove this field's value from every product.
    await db.collection("products").updateMany(
      {},
      { $unset: { [`customFields.${field.key}`]: "" } }
    );

    await fields.deleteOne({ _id: field._id });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete field and its values" },
      { status: 500 }
    );
  }
}
