
export type Product = {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  purity: string;
  cleaning: string;
  origin: string;
  packaging: string[];
  bagSizes: string[];
  shipmentTypes: string[];
  port: string;
  moq: string;
  description: string;
  specifications: {
    label: string;
    value: string;
  }[];
  imageUrl: string;
  pricePerKg?: number;
  currency: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt?: string;
  updatedAt?: string;
  customFields?: Record<string, unknown>;
};

export type SiteSettings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  port: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  footerText: string;
  currency: string;
  defaultProductPrice: number;
  originCharges: number;
  freightPerTon: number;
  insurancePercent: number;
  handlingPerShipment: number;
  defaultDestination: string;
  seoTitle: string;
  seoDescription: string;
};

export const defaultSettings: SiteSettings = {
  companyName: "Regalis Exports",
  tagline: "Indian Spices · Global Reach",

  email: "sales@regalisexports.com",
  phone: "+91 9909237329",
  whatsapp: "",
  address: "Gujarat, India",
  port: "Mundra Port, India",

  heroTitle: "Premium Indian Cumin Seeds for Global Markets",
  heroDescription:
    "Quality-focused sourcing, flexible specifications, and export solutions tailored to your business.",
  heroImage:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1800&q=85",

  footerText:
    "Reliable Indian spice sourcing for buyers around the world.",

  currency: "USD",
  defaultProductPrice: 2.4,
  originCharges: 180,
  freightPerTon: 95,
  insurancePercent: 0.35,
  handlingPerShipment: 75,

  defaultDestination: "Enter destination country",

  seoTitle: "Regalis Exports | Indian Cumin Seeds Exporter",
  seoDescription:
    "Explore export-grade Indian cumin seeds with configurable purity, cleaning, packaging and shipment options.",
};
