# Bogaty STEM Portal & Redesign

This repository contains the Next.js 14 application for the Bogaty STEM main website and the Staff Lead Capture Portal.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS / PostCSS
* **Database**: MongoDB (via native driver in `lib/db.ts`)
* **Auth**: NextAuth.js (Credentials Provider)
* **Mailing**: Nodemailer (via Zoho SMTP in production)

---

## 🚀 Getting Started

### 1. Installation
Install all dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy the `.env.example` file to `.env.local` and fill in your local development keys:
```bash
cp .env.example .env.local
```

### 3. Database Seeding
To seed the database with the default active event ("Nigerian Oil & Gas Conference") and the default Admin user, run:
```bash
npm run db:seed
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials
After running the seed script, the admin credentials will be:
* **Username**: `admin`
* **Password**: `BogatySTEM2026!`

---

## 💻 Portal & Landing Page Architecture

The application contains two main sections:

### 1. Public Landing Page (`/`)
An interactive, high-end landing page built with custom components:
* **Components**: Hero, About, Services, Process, Projects, Values, Testimonials, FAQ, and Contact.
* **Public Inquiry Form**: Located at the bottom of the home page.
  * Submissions are processed by `app/api/contact/route.ts`.
  * Send inquiries **instantly** to `info@bogatystem.com` from `SMTP_USER` using Nodemailer.
  * **Note**: Public inquiries are *not* saved to the database (keeps the database spam-free).

### 2. Capture & Admin Portal (`/portal`)
A private dashboard for staff to capture leads at events and for admins to manage them:

* **Lead Capture Form (`/portal`)**:
  * Staff members select the active event they are attending.
  * Captures company details, contact person, phone, position, notes, and inquiry/opportunity type.
  * Saved into the `contacts` collection in MongoDB.

* **Admin Dashboard (`/portal/admin`)**:
  * **Lead List**: Search, filter by opportunity type, date range, or event.
  * **CSV Export**: Click "Export CSV" to trigger `app/api/portal/contacts/export/route.ts` and download a spreadsheet containing all filtered leads.
  * **Event Management (`/portal/admin/events`)**: Create new events and toggle them as active/inactive. Active events automatically populate the capture form dropdown.
  * **User Management (`/portal/admin/users`)**: Create new staff or admin portal logins, and reset passwords.

---

## 📨 Email Routing & Zoho SMTP
Outbound emails (lead capture thank-you emails and admin notifications) are routed using Zoho SMTP.

### Production Environment Variables (Netlify)
Ensure these environment variables are set in Netlify:
* `SMTP_HOST` = `smtp.zoho.com`
* `SMTP_PORT` = `465`
* `SMTP_SECURE` = `true`
* `SMTP_USER` = `info@bogatystem.com`
* `SMTP_PASS` = `[Zoho App Password]`
* `CONTACT_TO_EMAIL` = `info@bogatystem.com` (Receives notifications when new leads are captured)

### 📧 Corporate Email Signature
The thank-you email sent to captured contacts ends with a custom corporate footer:
```text
Warm regards,

Bogaty STEM
A subsidiary of Bogaty Centrum limited.
No. 5 National Supply Road, Trans Amadi Industrial Layout, Port Harcourt, Rivers State. 
+ 234 806 6079 075
info@bogatystem.com | www.bogatystem.com
```

---

## ⏳ Delayed Email Queue (Cron Job Setup)

Thank-you emails to clients are **delayed by 5 minutes** so it feels like the staff stepped aside to email them after their conversation. Since Netlify runs on Serverless Functions (10-second timeout limit), this is managed via a **Database Queue** and a **Cron Job**.

### 1. Database Fields
When a contact is submitted, it is saved in MongoDB with:
* `thank_you_sent: false`
* `send_thank_you_at`: Timestamp set to `Current Time + 5 minutes`.

### 2. The Cron Endpoint
A secure endpoint is hosted at `/api/cron/send-emails`. Calling it queries MongoDB for contacts where `thank_you_sent: false` and `send_thank_you_at <= now`, triggers the emails, and updates their status to `thank_you_sent: true`.

### 3. Setup on cron-job.org
To trigger the queue automatically:
1. Log in to [cron-job.org](https://cron-job.org/).
2. Create a new cron job pointing to: `https://bogatystem.netlify.app/api/cron/send-emails`.
3. Set the **Execution Schedule** to **Every 1 minute** (or every 5 minutes).
4. Add the following **Request Header**:
   * **Key**: `Authorization`
   * **Value**: `Bearer [your_production_cron_secret]`
5. In Netlify Site Settings -> Environment Variables, add:
   * **Key**: `CRON_SECRET`
   * **Value**: `[your_production_cron_secret]` (Must match the value above without the `Bearer` prefix)

---

## 📅 Date Display Formatting
Dates in the database are stored as full UTC ISO strings (e.g. `2026-07-06T20:51:33.456Z`). The helper utility in `formatDate` automatically checks if the date ends in `"Z"` before attempting to append a timezone tag, preventing `Invalid Date` crashes across all admin views.
