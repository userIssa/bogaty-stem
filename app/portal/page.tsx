"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OPPORTUNITY_TYPES = [
  "Vendor Registration",
  "Partnership",
  "Subcontracting",
  "Equipment Supply",
  "Other",
];

interface Event {
  id: string;
  name: string;
  is_active: number;
}

export default function ContactCapturePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [opportunityType, setOpportunityType] = useState("");
  const [opportunityOther, setOpportunityOther] = useState("");

  // Fetch active events
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/portal/events")
        .then((r) => r.json())
        .then((data) => {
          const activeEvents = (data.events || []).filter((e: Event) => e.is_active);
          setEvents(activeEvents);
          // Auto-select if only one active event
          if (activeEvents.length === 1) {
            setSelectedEventId(activeEvents[0].id);
          }
        })
        .catch(() => {});
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    router.push("/portal/login");
    return null;
  }

  const isAdmin = (session.user as any)?.role === "admin";
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const resetForm = () => {
    setCompanyName("");
    setContactPerson("");
    setPosition("");
    setEmail("");
    setPhone("");
    setNotes("");
    setOpportunityType("");
    setOpportunityOther("");
    setFormState("idle");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/portal/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactPerson,
          position,
          email,
          phone,
          notes,
          opportunityType,
          opportunityOther,
          eventId: selectedEventId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setFormState("success");
    } catch (err: any) {
      setErrorMsg(err.message);
      setFormState("error");
    }
  };

  // ── Success Screen ──
  if (formState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bento-card p-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-green-50 border-2 border-green-200">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl text-ink mb-2">
              Contact Saved!
            </h2>
            <p className="text-muted text-sm mb-8">
              A thank-you email has been sent to the contact automatically.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={resetForm}
                className="w-full py-3.5 rounded-full font-display font-semibold text-sm bg-charcoal hover:bg-ink text-white transition-colors"
              >
                + Add Another Contact
              </button>
              {isAdmin && (
                <button
                  onClick={() => router.push("/portal/admin")}
                  className="w-full py-3.5 rounded-full font-display font-medium text-sm bg-white border border-line hover:border-gold text-ink transition-colors"
                >
                  View Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="min-h-screen pb-8">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-line">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-mist border border-line flex items-center justify-center p-1">
              <Image src="/logos/icon-gold.png" alt="Bogaty STEM" width={24} height={24} className="object-contain w-full h-full" />
            </div>
            <div>
              <p className="text-ink text-sm font-display font-semibold leading-tight">Bogaty STEM</p>
              <p className="text-[10px] text-muted font-mono leading-tight uppercase tracking-wider">
                {session.user?.name} • {isAdmin ? "Admin" : "Staff"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => router.push("/portal/admin")}
                className="inline-flex items-center gap-2 bg-mist hover:bg-cloud border border-line transition-colors text-ink font-medium text-xs px-3 py-2 rounded-full"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/portal/login" })}
              className="inline-flex items-center gap-2 bg-mist hover:bg-cloud border border-line transition-colors text-muted font-medium text-xs px-3 py-2 rounded-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Form Container */}
      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Event Selector */}
        {events.length > 0 && (
          <div className="mb-6">
            {events.length === 1 ? (
              <div className="section-badge mb-4">
                <span className="dot" />
                {events[0].name}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-xs font-mono font-medium mb-2 uppercase tracking-wider text-muted">
                  Select Event <span className="text-gold">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEventId(event.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                        selectedEventId === event.id
                          ? "bg-white border-gold text-ink shadow-sm"
                          : "bg-mist border-line text-muted hover:border-gold/50"
                      }`}
                    >
                      {selectedEventId === event.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      )}
                      {event.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-ink tracking-tight">
            Conference Contacts
          </h1>
          <p className="text-muted text-sm mt-1">
            Capture a new business contact
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bento-card p-6 space-y-4">
            {/* Company Name */}
            <InputField id="field-company" label="Company Name" value={companyName} onChange={setCompanyName} required placeholder="e.g. Total Energies" />

            {/* Contact Person */}
            <InputField id="field-contact" label="Contact Person" value={contactPerson} onChange={setContactPerson} required placeholder="e.g. John Doe" />

            {/* Position */}
            <InputField id="field-position" label="Position" value={position} onChange={setPosition} placeholder="e.g. Head of Procurement" />

            {/* Email */}
            <InputField id="field-email" label="Email Address" type="email" value={email} onChange={setEmail} required placeholder="e.g. john@company.com" />

            {/* Phone */}
            <InputField id="field-phone" label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="e.g. +234 800 000 0000" />

            {/* Opportunity Type */}
            <div>
              <label className="block text-xs font-mono font-medium mb-2.5 uppercase tracking-wider text-muted">
                Opportunity Type <span className="text-gold">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {OPPORTUNITY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOpportunityType(type)}
                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-all text-left border ${
                      opportunityType === type
                        ? "bg-white border-gold text-ink shadow-sm"
                        : "bg-mist border-line text-muted hover:border-gold/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {opportunityType === "Other" && (
                <input
                  type="text"
                  value={opportunityOther}
                  onChange={(e) => setOpportunityOther(e.target.value)}
                  placeholder="Please specify..."
                  className="w-full mt-2 px-4 py-3 rounded-xl text-ink text-sm outline-none bg-white border border-line focus:border-gold"
                />
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-mono font-medium mb-2 uppercase tracking-wider text-muted">
                Notes / Discussion Summary
              </label>
              <textarea
                id="field-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Key discussion points, interests, follow-up items..."
                className="w-full px-4 py-3 rounded-xl text-ink text-sm outline-none resize-none bg-white border border-line focus:border-gold"
              />
            </div>
          </div>

          {/* Error */}
          {formState === "error" && (
            <div className="mt-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-submit-contact"
            type="submit"
            disabled={formState === "submitting" || !companyName || !contactPerson || !email || !opportunityType || !selectedEventId}
            className="w-full mt-5 py-4 rounded-full font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-charcoal hover:bg-ink text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {formState === "submitting" ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Saving Contact...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Save Contact
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Reusable Input Field ──
function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-mono font-medium mb-2 uppercase tracking-wider text-muted">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl text-ink text-sm transition-all outline-none bg-white border border-line focus:border-gold"
      />
    </div>
  );
}
