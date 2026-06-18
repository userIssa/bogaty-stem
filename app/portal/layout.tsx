"use client";
import { SessionProvider } from "next-auth/react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FAFAFB 0%, #F1F1F3 45%, #E9E9EC 100%)" }}>
        {children}
      </div>
    </SessionProvider>
  );
}
