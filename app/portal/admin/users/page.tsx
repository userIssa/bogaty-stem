"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Reset password
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      console.error("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchUsers();
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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewUsername("");
      setNewPassword("");
      setNewRole("staff");
      setShowAddForm(false);
      fetchUsers();
    } catch (err: any) {
      setAddError(err.message);
    }
    setAddLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/portal/users?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess(false);

    try {
      const res = await fetch("/api/portal/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetUserId,
          newPassword: resetPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResetSuccess(true);
      setResetPassword("");
      setTimeout(() => {
        setResetUserId(null);
        setResetSuccess(false);
      }, 2000);
    } catch (err: any) {
      setResetError(err.message);
    }
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
              <p className="text-ink text-sm font-display font-semibold leading-tight">User Management</p>
              <p className="text-[10px] text-muted font-mono leading-tight uppercase tracking-wider">Manage staff access</p>
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
              Team
            </div>
            <h1 className="font-display font-bold text-3xl text-ink tracking-tight">Users</h1>
            <p className="text-xs text-muted mt-1">{users.length} total users</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 bg-charcoal hover:bg-ink dark:hover:text-[#15171C] text-white font-medium text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add User
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="bento-card p-5 mb-4 !border-gold/30">
            <h3 className="text-sm font-display font-semibold text-ink mb-4">New User</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl text-ink text-sm outline-none bg-card-inner border border-line focus:border-gold"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl text-ink text-sm outline-none bg-card-inner border border-line focus:border-gold"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-ink text-sm outline-none bg-card-inner border border-line focus:border-gold"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

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
                  {addLoading ? "Creating..." : "Create User"}
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

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="bento-card px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold ${
                      user.role === "admin"
                        ? "bg-gold/10 text-gold border border-gold/30"
                        : "bg-mist text-muted border border-line"
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-ink text-sm font-display font-semibold">{user.username}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          user.role === "admin"
                            ? "bg-gold/5 text-gold border-gold/20"
                            : "bg-mist text-muted border-line"
                        }`}>
                          {user.role}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          Created {user.created_at ? new Date(user.created_at.endsWith("Z") ? user.created_at : user.created_at + "Z").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setResetUserId(user.id); setResetPassword(""); setResetError(""); setResetSuccess(false); }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-mist border border-line hover:border-gold text-muted transition-colors"
                    >
                      Reset Password
                    </button>
                    {user.username !== session.user?.name && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Reset Password Form */}
                {resetUserId === user.id && (
                  <form onSubmit={handleResetPassword}
                    className="mt-3 pt-3 flex items-center gap-2 border-t border-line">
                    <input
                      type="password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      required
                      placeholder="New password (min 6 chars)"
                      className="flex-1 px-3 py-2 rounded-lg text-ink text-sm outline-none bg-card-inner border border-line focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-charcoal hover:bg-ink dark:hover:text-[#15171C] text-white transition-colors"
                    >
                      {resetSuccess ? "✓ Done" : "Reset"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetUserId(null)}
                      className="px-3 py-2 rounded-full text-xs text-muted hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                    {resetError && <span className="text-xs text-red-600">{resetError}</span>}
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
