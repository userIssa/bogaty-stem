"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Contact {
  id: string;
  company_name: string;
  contact_person: string;
  position: string;
  email: string;
  phone: string;
  notes: string;
  opportunity_type: string;
  opportunity_other: string;
  event_id: string | null;
  event_name: string | null;
  submitted_by: string;
  created_at: string;
}

interface Event {
  id: string;
  name: string;
  is_active: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    if (eventFilter) params.set("event", eventFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);

    try {
      const res = await fetch(`/api/portal/contacts?${params.toString()}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch {
      console.error("Failed to fetch contacts");
    }
    setLoading(false);
  }, [search, typeFilter, eventFilter, dateFrom, dateTo]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/portal/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {}
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchContacts();
      fetchEvents();
    }
  }, [status, session, fetchContacts]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    router.push("/portal/login");
    return null;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await fetch(`/api/portal/contacts?id=${id}`, { method: "DELETE" });
    fetchContacts();
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (eventFilter) params.set("event", eventFilter);
    window.open(`/api/portal/contacts/export?${params.toString()}`, "_blank");
  };

  // Stats
  const totalContacts = contacts.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayContacts = contacts.filter((c) => c.created_at?.startsWith(today)).length;
  const opportunityBreakdown = contacts.reduce((acc, c) => {
    acc[c.opportunity_type] = (acc[c.opportunity_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pb-8">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-line">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              title="Back to site"
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-mist border border-line flex items-center justify-center p-1 group-hover:border-gold group-hover:scale-105 transition-all">
                <Image src="/logos/icon-gold.png" alt="Bogaty STEM" width={24} height={24} className="object-contain w-full h-full" />
              </div>
              <div>
                <p className="text-ink text-sm font-display font-semibold leading-tight group-hover:text-gold transition-colors">Admin Dashboard</p>
                <p className="text-[10px] text-muted font-mono leading-tight uppercase tracking-wider">
                  {session.user?.name}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/portal")}
              className="inline-flex items-center gap-1.5 bg-charcoal hover:bg-ink text-white font-medium text-xs px-3 py-2 rounded-full transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Contact
            </button>
            <button
              onClick={() => router.push("/portal/admin/events")}
              className="inline-flex items-center gap-2 bg-mist hover:bg-cloud border border-line transition-colors text-ink font-medium text-xs px-3 py-2 rounded-full"
            >
              Events
            </button>
            <button
              onClick={() => router.push("/portal/admin/users")}
              className="inline-flex items-center gap-2 bg-mist hover:bg-cloud border border-line transition-colors text-ink font-medium text-xs px-3 py-2 rounded-full"
            >
              Users
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/portal/login" })}
              className="inline-flex items-center gap-2 bg-mist hover:bg-cloud border border-line transition-colors text-muted font-medium text-xs px-3 py-2 rounded-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-6">
          <div className="section-badge mb-4">
            <span className="dot" />
            Conference Contacts
          </div>
          <h1 className="font-display font-bold text-3xl text-ink tracking-tight">
            Contact Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Contacts" value={totalContacts} />
          <StatCard label="Today" value={todayContacts} accent />
          {Object.entries(opportunityBreakdown).slice(0, 2).map(([type, count]) => (
            <StatCard key={type} label={type} value={count as number} />
          ))}
        </div>

        {/* Filters */}
        <div className="bento-card p-4 mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search company, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-ink text-sm outline-none bg-white border border-line focus:border-gold"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm outline-none bg-white border border-line text-ink"
            >
              <option value="">All Types</option>
              <option value="Vendor Registration">Vendor Registration</option>
              <option value="Partnership">Partnership</option>
              <option value="Subcontracting">Subcontracting</option>
              <option value="Equipment Supply">Equipment Supply</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm outline-none bg-white border border-line text-ink"
            >
              <option value="">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}{!ev.is_active ? " (inactive)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-mono mb-1 uppercase tracking-wider text-muted">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-ink text-sm outline-none bg-white border border-line focus:border-gold"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-mono mb-1 uppercase tracking-wider text-muted">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-ink text-sm outline-none bg-white border border-line focus:border-gold"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchContacts}
                className="px-4 py-2.5 rounded-full text-sm font-medium bg-charcoal hover:bg-ink text-white transition-colors"
              >
                Search
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 bg-white border border-line hover:border-gold text-ink transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="bento-card py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-mist border border-line">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B6E76" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <p className="text-muted text-sm">No contacts found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="bento-card overflow-hidden transition-all">
                {/* Row */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-ink text-sm font-display font-semibold truncate">{contact.company_name}</p>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-mist border border-line text-muted">
                        {contact.opportunity_type}
                      </span>
                      {contact.event_name && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-gold/5 border border-gold/20 text-gold">
                          {contact.event_name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate">
                      {contact.contact_person} • {contact.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <span className="text-[10px] font-mono text-muted whitespace-nowrap">
                      {formatDate(contact.created_at)}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6E76" strokeWidth="2"
                      style={{ transform: expandedId === contact.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedId === contact.id && (
                  <div className="px-5 pb-4 pt-0 space-y-3 border-t border-line">
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <DetailItem label="Contact Person" value={contact.contact_person} />
                      <DetailItem label="Position" value={contact.position || "—"} />
                      <DetailItem label="Email" value={contact.email} />
                      <DetailItem label="Phone" value={contact.phone || "—"} />
                      <DetailItem label="Opportunity" value={
                        contact.opportunity_type === "Other" && contact.opportunity_other
                          ? `Other: ${contact.opportunity_other}`
                          : contact.opportunity_type
                      } />
                      <DetailItem label="Event" value={contact.event_name || "—"} />
                      <DetailItem label="Captured By" value={contact.submitted_by} />
                    </div>
                    {contact.notes && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">Notes</p>
                        <p className="text-sm text-ink/80 whitespace-pre-wrap px-3 py-2.5 rounded-xl bg-white border border-line">
                          {contact.notes}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`bento-card p-4 ${accent ? "!border-gold/30" : ""}`}>
      <p className="font-display font-bold text-2xl text-ink" style={{ color: accent ? "var(--gold)" : undefined }}>
        {value}
      </p>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted mt-1">{label}</p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-0.5">{label}</p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "Z");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
