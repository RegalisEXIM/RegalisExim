
import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Db } from "mongodb";
import { z } from "zod";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

const allowed = ["products", "blogs", "faqs", "enquiries"];

const productSchema = z.object({
    name: z.string().min(2).max(180),
    slug: z
        .string()
        .min(2)
        .max(200)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(1).max(100),
    purity: z.string().max(50),
    cleaning: z.string().max(120),
    origin: z.string().max(100),
    packaging: z.array(z.string()).max(20),
    bagSizes: z.array(z.string()).max(20),
    shipmentTypes: z.array(z.string()).max(10),
    port: z.string().max(120),
    moq: z.string().max(120),
    description: z.string().max(10000),
    specifications: z
        .array(
            z.object({
                label: z.string().max(100),
                value: z.string().max(300),
            })
        )
        .max(50),
    imageUrl: z.string().max(2000).optional().default(""),
    currency: z.string().max(5).optional().default("USD"),
    pricePerKg: z.number().nonnegative().optional(),
    published: z.boolean(),
    seoTitle: z.string().max(200),
    seoDescription: z.string().max(320),
    customFields: z.record(z.string(), z.unknown()).optional().default({}),
});

const blogSchema = z.object({
    title: z.string().min(2).max(200),
    slug: z
        .string()
        .min(2)
        .max(200)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().max(100).optional().default("Export guide"),
    excerpt: z.string().max(1000),
    content: z.string().max(30000),
    published: z.boolean(),
    seoTitle: z.string().max(200),
    seoDescription: z.string().max(320),
});

const faqSchema = z.object({
    question: z.string().min(3).max(500),
    answer: z.string().min(3).max(5000),
    published: z.boolean(),
    order: z.number().int().optional().default(0),
});

const settingsSchema = z.object({
    companyName: z.string().min(1).max(180),
    tagline: z.string().max(200),
    email: z.string().email(),
    phone: z.string().max(50),
    whatsapp: z.string().max(50),
    address: z.string().max(500),
    port: z.string().max(180),
    heroTitle: z.string().max(300),
    heroDescription: z.string().max(2000),
    heroImage: z.string().max(2000),
    footerText: z.string().max(2000),
    currency: z.string().max(5),
    defaultProductPrice: z.number().nonnegative(),
    originCharges: z.number().nonnegative(),
    freightPerTon: z.number().nonnegative(),
    insurancePercent: z.number().nonnegative(),
    handlingPerShipment: z.number().nonnegative(),
    defaultDestination: z.string().max(200),
    seoTitle: z.string().max(200),
    seoDescription: z.string().max(320),
});


type ProductFieldDefinition = {
    key: string;
    label: string;
    type: "text" | "number" | "textarea" | "select" | "boolean";
    required?: boolean;
    options?: string[];
};

async function validateCustomFields(
    db: Db,
    values: Record<string, unknown>
): Promise<Record<string, unknown>> {
    const definitions = await db
        .collection("productFieldDefinitions")
        .find({})
        .sort({ order: 1 })
        .toArray() as unknown as ProductFieldDefinition[];

    const cleaned: Record<string, unknown> = {};

    for (const field of definitions) {
        const value = values[field.key];
        const empty =
            value === undefined ||
            value === null ||
            value === "";

        if (empty) {
            if (field.required) {
                throw new Error(
                    `${field.label} is required.`
                );
            }

            continue;
        }

        switch (field.type) {
            case "text":
            case "textarea":
                if (typeof value !== "string") {
                    throw new Error(
                        `${field.label} must be text.`
                    );
                }
                cleaned[field.key] = value;
                break;

            case "number": {
                const numberValue =
                    typeof value === "number"
                        ? value
                        : typeof value === "string"
                            ? Number(value)
                            : NaN;

                if (!Number.isFinite(numberValue)) {
                    throw new Error(
                        `${field.label} must be a valid number.`
                    );
                }

                cleaned[field.key] = numberValue;
                break;
            }

            case "select":
                if (
                    typeof value !== "string" ||
                    !(field.options || []).includes(value)
                ) {
                    throw new Error(
                        `Select a valid option for ${field.label}.`
                    );
                }

                cleaned[field.key] = value;
                break;

            case "boolean":
                if (typeof value !== "boolean") {
                    throw new Error(
                        `${field.label} must be true or false.`
                    );
                }

                cleaned[field.key] = value;
                break;
        }
    }

    return cleaned;
}


export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ resource: string }> }
) {
    if (!(await getSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resource } = await params;

    if (!allowed.includes(resource) && resource !== "settings") {
        return NextResponse.json(
            { error: "Unknown resource" },
            { status: 404 }
        );
    }

    try {
        const db = await getDb();

        if (resource === "settings") {
            const d = await db
                .collection("settings")
                .findOne({ _id: "site" as never });

            return NextResponse.json(d || {});
        }

        const docs = await db
            .collection(resource)
            .find({})
            .sort({ createdAt: -1 })
            .limit(500)
            .toArray();

        return NextResponse.json(
            docs.map((d) => ({
                ...d,
                _id: d._id.toString(),
            }))
        );
    } catch {
        return NextResponse.json(
            { error: "Could not load data" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ resource: string }> }
) {
    if (!(await getSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resource } = await params;

    if (!allowed.includes(resource) && resource !== "settings") {
        return NextResponse.json(
            { error: "Unknown resource" },
            { status: 404 }
        );
    }

    try {
        const body = await req.json();

        const db = await getDb();

        if (resource === "products") {
            const parsed = productSchema.parse(body);

            const customFields = await validateCustomFields(
                db,
                parsed.customFields || {}
            );

            const productData = {
                ...parsed,
                customFields,
            };

            const now = new Date();

            const result = await db.collection("products").insertOne({
                ...productData,
                createdAt: now,
                updatedAt: now,
            });

            return NextResponse.json(
                {
                    ok: true,
                    id: result.insertedId.toString(),
                },
                { status: 201 }
            );
        }

        const parsed =
            resource === "blogs"
                ? blogSchema.parse(body)
                : resource === "faqs"
                    ? faqSchema.parse(body)
                    : resource === "settings"
                        ? settingsSchema.parse(body)
                        : z.object({ status: z.string().max(30) }).parse(body);

        if (resource === "settings") {
            await db.collection("settings").updateOne(
                { _id: "site" as never },
                {
                    $set: {
                        ...parsed,
                        _id: "site",
                    },
                },
                { upsert: true }
            );

            return NextResponse.json({ ok: true });
        }

        const now = new Date();

        const result = await db.collection(resource).insertOne({
            ...parsed,
            createdAt: now,
            updatedAt: now,
        });

        return NextResponse.json(
            {
                ok: true,
                id: result.insertedId.toString(),
            },
            { status: 201 }
        );
    } catch (e) {
        return NextResponse.json(
            {
                error:
                    e instanceof z.ZodError
                        ? e.issues[0]?.message || "Invalid input"
                        : "Could not save record",
            },
            { status: 400 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ resource: string }> }
) {
    if (!(await getSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resource } = await params;

    if (!allowed.includes(resource) || resource === "enquiries") {
        return NextResponse.json(
            { error: "Editing is not allowed for this resource" },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const { id, ...rest } = body;

        if (typeof id !== "string" || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid record ID" },
                { status: 400 }
            );
        }

        const db = await getDb();

        if (resource === "products") {
            const parsed = productSchema.parse(rest);

            const customFields = await validateCustomFields(
                db,
                parsed.customFields || {}
            );

            const productData = {
                ...parsed,
                customFields,
            };

            await db.collection("products").updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        ...productData,
                        updatedAt: new Date(),
                    },
                }
            );

            return NextResponse.json({ ok: true });
        }

        const parsed =
            resource === "blogs"
                ? blogSchema.parse(rest)
                : faqSchema.parse(rest);

        await db.collection(resource).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...parsed,
                    updatedAt: new Date(),
                },
            }
        );

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("PATCH product update failed:", e);

        return NextResponse.json(
            {
                error:
                    e instanceof z.ZodError
                        ? e.issues[0]?.message || "Invalid input"
                        : e instanceof Error
                            ? e.message
                            : "Could not update record",
            },
            { status: 400 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ resource: string }> }
) {
    if (!(await getSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resource } = await params;

    if (!allowed.includes(resource) || resource === "enquiries") {
        return NextResponse.json(
            { error: "Deletion is not allowed" },
            { status: 400 }
        );
    }

    try {
        const id = new URL(req.url).searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid record ID" },
                { status: 400 }
            );
        }

        await (await getDb())
            .collection(resource)
            .deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json(
            { error: "Could not delete record" },
            { status: 500 }
        );
    }
}
