import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send a personalized thank-you email to the captured contact.
 */
export async function sendThankYouEmail(contact: {
  contactPerson: string;
  companyName: string;
  email: string;
  eventName?: string;
}) {
  const transporter = createTransporter();
  const event = contact.eventName || "the conference";

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #15171C;">
      <div style="background: linear-gradient(160deg, #2A2C32 0%, #15171C 100%); padding: 32px 28px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #C8962A; margin: 0; font-size: 22px; font-weight: 600;">Bogaty STEM</h1>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Engineering for a Sustainable Future</p>
      </div>
      <div style="background: #ffffff; padding: 32px 28px; border: 1px solid #E2E2E5; border-top: none; border-radius: 0 0 16px 16px;">
        <p style="font-size: 16px; line-height: 1.7; margin-top: 0;">Dear <strong>${contact.contactPerson}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.7;">
          Thank you for connecting and engaging with <strong>Bogaty STEM</strong> at the ${event}.
        </p>
        <p style="font-size: 16px; line-height: 1.7;">
          We appreciate the opportunity to learn more about <strong>${contact.companyName}</strong>, and we look forward to exploring potential collaboration opportunities with your organization.
        </p>
        <p style="font-size: 16px; line-height: 1.7;">
          Our team will follow up with you shortly.
        </p>
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E2E5;">
          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #15171C;">Warm regards,</p>
          <p style="margin: 4px 0 0; font-size: 15px; color: #C8962A; font-weight: 600;">Bogaty STEM</p>
          <p style="margin: 2px 0 0; font-size: 12px; color: #6B6E76;">Engineering for a Sustainable Future</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Bogaty STEM" <${process.env.SMTP_USER}>`,
    to: contact.email,
    subject: "Thank You for Connecting with Bogaty STEM",
    text: `Dear ${contact.contactPerson},\n\nThank you for connecting and engaging with Bogaty STEM at the ${event}.\n\nWe appreciate the opportunity to learn more about ${contact.companyName}, and we look forward to exploring potential collaboration opportunities with your organization.\n\nOur team will follow up with you shortly.\n\nWarm regards,\nBogaty STEM`,
    html: htmlBody,
  });
}

/**
 * Notify the admin that a new contact was captured.
 */
export async function sendAdminNotification(contact: {
  companyName: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  opportunityType: string;
  submittedBy: string;
  eventName?: string;
}) {
  const transporter = createTransporter();
  const event = contact.eventName || "Unknown Event";

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #15171C;">
      <div style="background: linear-gradient(160deg, #2A2C32 0%, #15171C 100%); padding: 24px 28px; border-radius: 16px 16px 0 0;">
        <h2 style="color: #C8962A; margin: 0; font-size: 18px;">New Contact Captured</h2>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 12px;">${event}</p>
      </div>
      <div style="background: #ffffff; padding: 24px 28px; border: 1px solid #E2E2E5; border-top: none; border-radius: 0 0 16px 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #6B6E76; width: 120px;">Company</td><td style="padding: 8px 0; font-weight: 600;">${contact.companyName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Contact</td><td style="padding: 8px 0; font-weight: 600;">${contact.contactPerson}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Position</td><td style="padding: 8px 0;">${contact.position || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Email</td><td style="padding: 8px 0;">${contact.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Phone</td><td style="padding: 8px 0;">${contact.phone || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Opportunity</td><td style="padding: 8px 0;">${contact.opportunityType}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Event</td><td style="padding: 8px 0;">${event}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B6E76;">Captured by</td><td style="padding: 8px 0;">${contact.submittedBy}</td></tr>
        </table>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Bogaty STEM Portal" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    subject: `New Contact: ${contact.companyName} (${event})`,
    text: `New contact captured by ${contact.submittedBy} at ${event}:\n\nCompany: ${contact.companyName}\nContact: ${contact.contactPerson} (${contact.position})\nEmail: ${contact.email}\nPhone: ${contact.phone}\nOpportunity: ${contact.opportunityType}`,
    html: htmlBody,
  });
}
