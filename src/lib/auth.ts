
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";

const cookieName = "regalis_admin";

function secret() {
  const s = process.env.AUTH_SECRET;

  if (!s || s.length < 32) {
    throw new Error(
      "AUTH_SECRET must be at least 32 characters."
    );
  }

  return new TextEncoder().encode(s);
}

export async function createSession(email: string) {
  const token = await new SignJWT({
    email,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function getSession() {
  const token = (await cookies()).get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret());

    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function destroySession() {
  (await cookies()).delete(cookieName);
}
