import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

// GET /api/portal/events — list all events (any authenticated user)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = db
    .prepare("SELECT * FROM events ORDER BY is_active DESC, created_at DESC")
    .all();
  return NextResponse.json({ events });
}

// POST /api/portal/events — create event (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Event name is required." },
        { status: 400 }
      );
    }

    const result = db
      .prepare("INSERT INTO events (name, is_active) VALUES (?, ?)")
      .run(name.trim(), 1);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error("Event creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// PATCH /api/portal/events — toggle active status (admin only)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, is_active } = await req.json();
    if (id == null) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    db.prepare("UPDATE events SET is_active = ? WHERE id = ?").run(
      is_active ? 1 : 0,
      id
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Event update error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// DELETE /api/portal/events?id=...
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

  // Check if any contacts reference this event
  const contactCount = (
    db.prepare("SELECT COUNT(*) as cnt FROM contacts WHERE event_id = ?").get(id) as any
  ).cnt;

  if (contactCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${contactCount} contact(s) are linked to this event. Deactivate it instead.` },
      { status: 400 }
    );
  }

  db.prepare("DELETE FROM events WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
