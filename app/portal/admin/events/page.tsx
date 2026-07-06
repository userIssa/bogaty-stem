"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  name: string;
  is_active: number;
  created_at: string;
}

export default function EventManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // New event form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      console.error("Failed to fetch events");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchEvents();
    }
  }, [status, session]);

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

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await fetch("/api/portal/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewName("");
      setShowAddForm(false);
      fetchEvents();
    } catch (err: any) {
      setAddError(err.message);
    }
    setAddLoading(false);
  };

  const handleToggleActive = async (id: string, currentlyActive: number) => {
    try {
      await fetch("/api/portal/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentlyActive }),
      });
      fetchEvents();
    } catch {}
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event? This only works if no contacts are linked to it.")) return;
    try {
      const res = await fetch(`/api/portal/events?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete event");
        return;
      }
      fetchEvents();
    } catch {}
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-line">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/portal/admin")} className="flex items-center justify-center w-8 h-8 rounded-full bg-mist border border-line hover:border-gold text-muted hover:text-ink transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div>
              <p className="text-ink text-sm font-display font-semibold leading-tight">Event Management</p>
              <p className="text-[10px] text-muted font-mono leading-tight uppercase tracking-wider">Manage conferences &amp; events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/portal")}
              className="inline-flex items-center gap-2 bg-mist hover:bg-cloud border border-line transition-colors text-ink font-medium text-xs px-3 py-2 rounded-full"
            >
              Capture
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

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Header + Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="section-badge mb-3">
              <span className="dot" />
              Events
            </div>
            <h1 className="font-display font-bold text-3xl text-ink tracking-tight">Events</h1>
            <p className="text-xs text-muted mt-1">
              {events.filter((e) => e.is_active).length} active • {events.length} total
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 bg-charcoal hover:bg-ink dark:hover:text-[#15171C] text-white font-medium text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Event
          </button>
        </div>

        {/* Info */}
        <div className="bento-card p-4 mb-4 flex items-start gap-3 !border-gold/20 bg-gold/[0.03]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-ink">Active events</strong> appear in the contact capture form for staff to select.
            Deactivated events are hidden from the form but their contacts are preserved and filterable in the dashboard.
          </p>
        </div>

        {/* Add Event Form */}
        {showAddForm && (
          <div className="bento-card p-5 mb-4 !border-gold/30">
            <h3 className="text-sm font-display font-semibold text-ink mb-4">New Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="e.g. Nigerian Oil & Gas Conference 2026"
                className="w-full px-4 py-3 rounded-xl text-ink text-sm outline-none bg-card-inner border border-line focus:border-gold"
              />

              {addError && (
                <p className="text-xs px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600">
                  {addError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-charcoal hover:bg-ink dark:hover:text-[#15171C] text-white transition-colors"
                >
                  {addLoading ? "Creating..." : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setAddError(""); }}
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-card-inner border border-line hover:border-gold text-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : events.length === 0 ? (
          <div className="bento-card py-16 text-center">
            <p className="text-muted text-sm">No events yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className={`bento-card px-5 py-4 ${!event.is_active ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.is_active
                        ? "bg-gold/10 border border-gold/30"
                        : "bg-mist border border-line"
                    }`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={event.is_active ? "#C8962A" : "#6B6E76"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-ink text-sm font-display font-semibold">{event.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          event.is_active
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-mist text-muted border-line"
                        }`}>
                          {event.is_active ? "Active" : "Inactive"}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          Created {event.created_at ? new Date(event.created_at.endsWith("Z") ? event.created_at : event.created_at + "Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(event.id, event.is_active)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        event.is_active
                          ? "bg-mist border-line text-muted hover:border-gold"
                          : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {event.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
