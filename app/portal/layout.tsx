"use client";
import { SessionProvider } from "next-auth/react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gradient-to-b from-paper via-mist to-cloud text-ink transition-colors duration-300">
        {children}
      </div>
    </SessionProvider>
  );
}
