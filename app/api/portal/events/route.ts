import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

// GET /api/portal/events — list all events (any authenticated user)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const events = await db
    .collection("events")
    .find()
    .sort({ is_active: -1, created_at: -1 })
    .toArray();

  const result = events.map((e) => ({
    id: e._id.toString(),
    name: e.name,
    is_active: e.is_active ? 1 : 0,
    created_at: e.created_at,
  }));

  return NextResponse.json({ events: result });
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

    const db = await getDb();
    const result = await db.collection("events").insertOne({
      name: name.trim(),
      is_active: true,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
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
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { $set: { is_active: !!is_active } }
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

  const db = await getDb();

  // Check if any contacts reference this event
  let oid: ObjectId;
  try {
    oid = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const contactCount = await db
    .collection("contacts")
    .countDocuments({ event_id: oid });

  if (contactCount > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete — ${contactCount} contact(s) are linked to this event. Deactivate it instead.`,
      },
      { status: 400 }
    );
  }

  await db.collection("events").deleteOne({ _id: oid });
  return NextResponse.json({ success: true });
}
