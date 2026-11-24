
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { createSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { seedContent } from "@/lib/content";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json());

    await seedContent();

    const db = await getDb();

    const admin = await db.collection("admins").findOne({
      email: email.toLowerCase(),
    });

    let valid = false;

    if (admin?.passwordHash) {
      valid = await bcrypt.compare(
        password,
        String(admin.passwordHash)
      );
    } else if (
      process.env.ADMIN_EMAIL?.toLowerCase() === email.toLowerCase() &&
      process.env.ADMIN_PASSWORD
    ) {
      valid = password === process.env.ADMIN_PASSWORD;
    }

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession(email.toLowerCase());

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Unable to sign in. Check server configuration." },
      { status: 500 }
    );
  }
}
