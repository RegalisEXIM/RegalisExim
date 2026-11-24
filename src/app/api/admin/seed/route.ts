
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { seedContent } from "@/lib/content";

export async function POST() {
  if (!(await getSession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await seedContent();

    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (email && password) {
      const db = await getDb();

      const passwordHash = await bcrypt.hash(password, 12);

      await db.collection("admins").updateOne(
        { email },
        {
          $set: {
            email,
            passwordHash,
            role: "admin",
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Seed failed" },
      { status: 500 }
    );
  }
}
