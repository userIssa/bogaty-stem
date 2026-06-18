import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

// GET /api/portal/contacts/export?event=... — returns CSV
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("event") || "";

  let query =
    "SELECT c.*, e.name as event_name FROM contacts c LEFT JOIN events e ON c.event_id = e.id";
  const params: any[] = [];

  if (eventId) {
    query += " WHERE c.event_id = ?";
    params.push(eventId);
  }

  query += " ORDER BY c.created_at DESC";

  const contacts = db.prepare(query).all(...params) as any[];

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
      c.id,
      escapeCSV(c.event_name || ""),
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
