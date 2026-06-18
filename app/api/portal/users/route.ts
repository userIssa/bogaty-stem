import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/portal/users — list all users
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = db
    .prepare("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC")
    .all();
  return NextResponse.json({ users });
}

// POST /api/portal/users — create user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 409 }
      );
    }

    const hash = bcrypt.hashSync(password, 12);
    db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(
      username,
      hash,
      role || "staff"
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("User creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// DELETE /api/portal/users?id=...
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  // Prevent deleting yourself
  if (String(id) === (session.user as any).userId) {
    return NextResponse.json(
      { error: "Cannot delete your own account." },
      { status: 400 }
    );
  }

  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
