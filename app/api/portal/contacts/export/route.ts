import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

// GET /api/portal/contacts/export?event=... — returns CSV
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("event") || "";

  const filter: any = {};
  if (eventId) {
    try {
      filter.event_id = new ObjectId(eventId);
    } catch {
      filter.event_id = eventId;
    }
  }

  const contacts = await db
    .collection("contacts")
    .find(filter)
    .sort({ created_at: -1 })
    .toArray();

  // Resolve event names
  const eventIds = Array.from(
    new Set(contacts.map((c) => c.event_id?.toString()).filter(Boolean))
  );
  const events =
    eventIds.length > 0
      ? await db.collection("events").find({ _id: { $in: eventIds.map((id) => new ObjectId(id)) } }).toArray()
      : [];
  const eventMap = Object.fromEntries(events.map((e) => [e._id.toString(), e.name]));

  // Build CSV
  const headers = [
    "ID",
    "Event",
    "Company Name",
    "Contact Person",
    "Position",
    "Email",
    "Phone",
    "Notes",
    "Opportunity Type",
    "Opportunity Other",
    "Submitted By",
    "Date",
  ];

  const escapeCSV = (val: string) => {
    if (!val) return "";
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const rows = contacts.map((c) =>
    [
      c._id.toString(),
      escapeCSV(c.event_id ? eventMap[c.event_id.toString()] || "" : ""),
      escapeCSV(c.company_name),
      escapeCSV(c.contact_person),
      escapeCSV(c.position),
      escapeCSV(c.email),
      escapeCSV(c.phone),
      escapeCSV(c.notes),
      escapeCSV(c.opportunity_type),
      escapeCSV(c.opportunity_other),
      escapeCSV(c.submitted_by),
      escapeCSV(c.created_at),
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="bogaty-contacts-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
