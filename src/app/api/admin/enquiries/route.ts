
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id, status } = await req.json();

    if (
      typeof id !== "string" ||
      !ObjectId.isValid(id) ||
      !["new", "in-progress", "replied", "closed"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid update" },
        { status: 400 }
      );
    }

    await (await getDb())
      .collection("enquiries")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 400 }
    );
  }
}
