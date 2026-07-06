import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendThankYouEmail } from "@/lib/emails";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Authenticate the cron request
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const now = new Date().toISOString();

    // 2. Find pending contacts where the scheduled time has arrived
    const pendingContacts = await db
      .collection("contacts")
      .find({
        thank_you_sent: false,
        send_thank_you_at: { $lte: now },
      })
      .toArray();

    if (pendingContacts.length === 0) {
      return NextResponse.json({ success: true, sentCount: 0 });
    }

    // Resolve event names for the contacts
    const eventIds = Array.from(
      new Set(pendingContacts.map((c) => c.event_id?.toString()).filter(Boolean))
    );
    const events =
      eventIds.length > 0
        ? await db
            .collection("events")
            .find({ _id: { $in: eventIds.map((id) => new ObjectId(id)) } })
            .toArray()
        : [];
    const eventMap = Object.fromEntries(events.map((e) => [e._id.toString(), e.name]));

    let sentCount = 0;

    // 3. Process and send thank-you emails
    for (const contact of pendingContacts) {
      const eventName = contact.event_id ? eventMap[contact.event_id.toString()] || "" : "";
      const resolvedOppType =
        contact.opportunity_type === "Other" && contact.opportunity_other
          ? contact.opportunity_other
          : contact.opportunity_type;

      try {
        await sendThankYouEmail({
          contactPerson: contact.contact_person,
          companyName: contact.company_name,
          email: contact.email,
          eventName,
          opportunityType: resolvedOppType,
        });

        // 4. Update the contact to mark thank-you email as sent
        await db.collection("contacts").updateOne(
          { _id: contact._id },
          { $set: { thank_you_sent: true } }
        );
        sentCount++;
      } catch (err) {
        console.error(`Failed to send delayed email to ${contact.email}:`, err);
      }
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (err) {
    console.error("Cron job error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
