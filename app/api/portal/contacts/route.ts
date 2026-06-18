import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { sendThankYouEmail, sendAdminNotification } from "@/lib/emails";

// GET  /api/portal/contacts?search=...&type=...&from=...&to=...&event=...
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const eventId = searchParams.get("event") || "";

  const filter: any = {};

  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [
      { company_name: regex },
      { contact_person: regex },
      { email: regex },
    ];
  }

  if (type) {
    filter.opportunity_type = type;
  }

  if (eventId) {
    try {
      filter.event_id = new ObjectId(eventId);
    } catch {
      filter.event_id = eventId;
    }
  }

  if (from || to) {
    filter.created_at = {};
    if (from) filter.created_at.$gte = from;
    if (to) filter.created_at.$lte = to + " 23:59:59";
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
      ? await db
          .collection("events")
          .find({ _id: { $in: eventIds.map((id) => new ObjectId(id)) } })
          .toArray()
      : [];
  const eventMap = Object.fromEntries(events.map((e) => [e._id.toString(), e.name]));

  const result = contacts.map((c) => ({
    ...c,
    id: c._id.toString(),
    _id: undefined,
    event_id: c.event_id?.toString() || null,
    event_name: c.event_id ? eventMap[c.event_id.toString()] || null : null,
  }));

  return NextResponse.json({ contacts: result });
}

// POST  /api/portal/contacts
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
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
    let eventOid = null;
    if (eventId) {
      try {
        eventOid = new ObjectId(eventId);
      } catch {
        eventOid = null;
      }
      if (eventOid) {
        const event = await db.collection("events").findOne({ _id: eventOid });
        eventName = event?.name || "";
      }
    }

    const result = await db.collection("contacts").insertOne({
      company_name: companyName,
      contact_person: contactPerson,
      position: position || "",
      email,
      phone: phone || "",
      notes: notes || "",
      opportunity_type: opportunityType,
      opportunity_other: opportunityOther || "",
      event_id: eventOid,
      submitted_by: submittedBy,
      created_at: new Date().toISOString(),
    });

    // Send emails (await to ensure delivery in serverless environments)
    await Promise.all([
      sendThankYouEmail({ contactPerson, companyName, email, eventName }).catch((err) =>
        console.error("Failed to send thank-you email:", err)
      ),
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
      )
    ]);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
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

  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
