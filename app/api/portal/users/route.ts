import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// GET /api/portal/users — list all users
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ created_at: -1 })
    .toArray();

  const result = users.map((u) => ({
    id: u._id.toString(),
    username: u.username,
    role: u.role,
    created_at: u.created_at,
  }));

  return NextResponse.json({ users: result });
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

    const db = await getDb();
    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 409 }
      );
    }

    const hash = bcrypt.hashSync(password, 12);
    await db.collection("users").insertOne({
      username,
      password: hash,
      role: role || "staff",
      created_at: new Date().toISOString(),
    });

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
  if (id === (session.user as any).userId) {
    return NextResponse.json(
      { error: "Cannot delete your own account." },
      { status: 400 }
    );
  }

  const db = await getDb();
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
