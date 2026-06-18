import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { sendThankYouEmail, sendAdminNotification } from "@/lib/emails";

// GET  /api/portal/contacts?search=...&type=...&from=...&to=...&event=...
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can view all contacts
  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const eventId = searchParams.get("event") || "";

  let query =
    "SELECT c.*, e.name as event_name FROM contacts c LEFT JOIN events e ON c.event_id = e.id WHERE 1=1";
  const params: any[] = [];

  if (search) {
    query +=
      " AND (c.company_name LIKE ? OR c.contact_person LIKE ? OR c.email LIKE ?)";
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  if (type) {
    query += " AND c.opportunity_type = ?";
    params.push(type);
  }

  if (eventId) {
    query += " AND c.event_id = ?";
    params.push(eventId);
  }

  if (from) {
    query += " AND c.created_at >= ?";
    params.push(from);
  }

  if (to) {
    query += " AND c.created_at <= ?";
    params.push(to + " 23:59:59");
  }

  query += " ORDER BY c.created_at DESC";

  const contacts = db.prepare(query).all(...params);
  return NextResponse.json({ contacts });
}

// POST  /api/portal/contacts
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      companyName,
      contactPerson,
      position,
      email,
      phone,
      notes,
      opportunityType,
      opportunityOther,
      eventId,
    } = body;

    if (!companyName || !contactPerson || !email || !opportunityType) {
      return NextResponse.json(
        { error: "Company name, contact person, email, and opportunity type are required." },
        { status: 400 }
      );
    }

    const submittedBy = session.user?.name || "unknown";

    // Get event name for the email
    let eventName = "";
    if (eventId) {
      const event = db.prepare("SELECT name FROM events WHERE id = ?").get(eventId) as any;
      eventName = event?.name || "";
    }

    const result = db
      .prepare(
        `INSERT INTO contacts (company_name, contact_person, position, email, phone, notes, opportunity_type, opportunity_other, event_id, submitted_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        companyName,
        contactPerson,
        position || "",
        email,
        phone || "",
        notes || "",
        opportunityType,
        opportunityOther || "",
        eventId || null,
        submittedBy
      );

    // Send thank-you email to the contact (fire & forget, don't block response)
    sendThankYouEmail({ contactPerson, companyName, email, eventName }).catch(
      (err) => console.error("Failed to send thank-you email:", err)
    );

    // Send admin notification (fire & forget)
    sendAdminNotification({
      companyName,
      contactPerson,
      position: position || "",
      email,
      phone: phone || "",
      opportunityType:
        opportunityType === "Other" && opportunityOther
          ? `Other: ${opportunityOther}`
          : opportunityType,
      submittedBy,
      eventName,
    }).catch((err) =>
      console.error("Failed to send admin notification:", err)
    );

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE /api/portal/contacts?id=...
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

  db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
