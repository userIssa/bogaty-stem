"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password");
      setLoading(false);
    } else {
      router.push("/portal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-white border border-line flex items-center justify-center shadow-sm p-2">
              <Image src="/logos/icon-gold.png" alt="Bogaty STEM" width={40} height={40} className="object-contain w-full h-full" />
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl text-ink tracking-tight mb-2">
            Staff Portal
          </h1>
          <p className="text-muted text-sm">
            Conference Contact Capture System
          </p>
        </div>

        {/* Login Card */}
        <div className="bento-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono font-medium mb-2 uppercase tracking-wider text-muted">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3.5 rounded-xl text-ink text-sm transition-all outline-none bg-white border border-line focus:border-gold"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono font-medium mb-2 uppercase tracking-wider text-muted">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-xl text-ink text-sm transition-all outline-none bg-white border border-line focus:border-gold"
                placeholder="Enter your password"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-charcoal hover:bg-ink text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-muted font-mono">
          Authorized personnel only. Contact admin for access.
        </p>
      </div>
    </div>
  );
}
