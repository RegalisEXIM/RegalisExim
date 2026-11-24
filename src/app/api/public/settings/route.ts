
import { NextResponse } from "next/server";

import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const s = await getSettings();

    return NextResponse.json({
      currency: s.currency,
      defaultProductPrice: s.defaultProductPrice,
      originCharges: s.originCharges,
      freightPerTon: s.freightPerTon,
      insurancePercent: s.insurancePercent,
      handlingPerShipment: s.handlingPerShipment,
      port: s.port,
    });
  } catch {
    return NextResponse.json(
      { error: "Settings unavailable" },
      { status: 503 }
    );
  }
}
