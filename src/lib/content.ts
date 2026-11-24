
import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { defaultSettings, SiteSettings, Product } from "./types";

export async function getSettings(): Promise<SiteSettings> {
  const db = await getDb();

  const doc = await db
    .collection("settings")
    .findOne({ _id: "site" as never });

  return {
    ...defaultSettings,
    ...(doc || {}),
  } as SiteSettings;
}

export async function getProducts(
  publishedOnly = true
): Promise<Product[]> {
  const db = await getDb();

  const query = publishedOnly
    ? { published: true }
    : {};

  const docs = await db
    .collection("products")
    .find(query)
    .sort({ updatedAt: -1, name: 1 })
    .toArray();

  return docs.map((d) => ({
    ...d,
    _id: d._id.toString(),
  })) as unknown as Product[];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const db = await getDb();

  const d = await db.collection("products").findOne({
    slug,
    published: true,
  });

  return d
    ? ({
        ...d,
        _id: d._id.toString(),
      } as unknown as Product)
    : null;
}

export async function getPublishedContent(
  collection: "blogs" | "faqs"
) {
  const db = await getDb();

  return db
    .collection(collection)
    .find({ published: true })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function seedContent() {
  const db = await getDb();

  // Initialize default site settings.
  const existingSettings = await db
    .collection("settings")
    .findOne({ _id: "site" as never });

  if (!existingSettings) {
    await db.collection("settings").insertOne({
      _id: "site" as never,
      ...defaultSettings,
    });
  }

  // Seed products when the collection is empty.
  const count = await db
    .collection("products")
    .countDocuments();

  if (!count) {
    const now = new Date().toISOString();

    await db.collection("products").insertMany([
      {
        name: "Machine-Cleaned Cumin Seeds",
        slug: "machine-cleaned-cumin-seeds",
        category: "Cumin Seeds",
        purity: "99%",
        cleaning: "Machine cleaned",
        origin: "India",
        packaging: ["Jute bags", "PP bags"],
        bagSizes: ["10 kg", "25 kg", "50 kg"],
        shipmentTypes: ["FCL", "LCL"],
        port: "Mundra Port, India",
        moq: "Buyer enquiry",
        description:
          "Export-oriented whole cumin seeds with machine cleaning. Final specifications and availability are confirmed against each shipment.",
        specifications: [
          { label: "Purity", value: "99%" },
          { label: "Cleaning", value: "Machine cleaned" },
          { label: "Packing", value: "10 / 25 / 50 kg" },
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
        currency: "USD",
        published: true,
        seoTitle:
          "99% Machine-Cleaned Cumin Seeds | Regalis Exports",
        seoDescription:
          "Enquire about Indian machine-cleaned cumin seeds with 99% purity and flexible export packing.",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Machine & Sortex-Cleaned Cumin Seeds",
        slug: "machine-sortex-cleaned-cumin-seeds",
        category: "Cumin Seeds",
        purity: "99.5%",
        cleaning: "Machine & Sortex cleaned",
        origin: "India",
        packaging: ["Jute bags", "PP bags"],
        bagSizes: ["10 kg", "25 kg", "50 kg"],
        shipmentTypes: ["FCL", "LCL"],
        port: "Mundra Port, India",
        moq: "Buyer enquiry",
        description:
          "Cumin seeds processed using machine cleaning and Sortex sorting for buyers seeking an enhanced cleaning specification. Confirm final tolerances and inspection requirements before order.",
        specifications: [
          { label: "Purity", value: "99.5%" },
          {
            label: "Cleaning",
            value: "Machine & Sortex cleaned",
          },
          { label: "Packing", value: "10 / 25 / 50 kg" },
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
        currency: "USD",
        published: true,
        seoTitle:
          "99.5% Sortex-Cleaned Cumin Seeds | Regalis Exports",
        seoDescription:
          "Request a quotation for Indian cumin seeds with 99.5% purity and machine plus Sortex cleaning.",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  }

  // Seed FAQs when the collection is empty.
  const faqCount = await db
    .collection("faqs")
    .countDocuments();

  if (!faqCount) {
    await db.collection("faqs").insertMany([
      {
        question:
          "What cumin seed purity options can I request?",
        answer:
          "Regalis Exports lists 99% and 99.5% purity options. Confirm the final specification, tolerance and inspection method with our sales team before placing an order.",
        published: true,
        order: 1,
        createdAt: new Date(),
      },
      {
        question: "Which packaging options are available?",
        answer:
          "Indicative options include 10 kg, 25 kg and 50 kg bags, with jute and polypropylene (PP) packaging. Availability can be confirmed for your order.",
        published: true,
        order: 2,
        createdAt: new Date(),
      },
      {
        question:
          "Can you arrange FCL and LCL shipments?",
        answer:
          "FCL and LCL can be discussed based on quantity, destination, cargo readiness and carrier availability. Final shipping arrangements are confirmed in the quotation.",
        published: true,
        order: 3,
        createdAt: new Date(),
      },
      {
        question: "Which port do you ship from?",
        answer:
          "Mundra Port, India is the default port shown on this website. Confirm the loading port and routing in your shipment quotation.",
        published: true,
        order: 4,
        createdAt: new Date(),
      },
    ]);
  }
}

export async function findById(
  collection: string,
  id: string
) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return getDb().then((db) =>
    db.collection(collection).findOne({
      _id: new ObjectId(id),
    })
  );
}
