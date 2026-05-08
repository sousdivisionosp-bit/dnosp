"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Si l'utilisateur n'est pas connecté, on affiche uniquement le contenu (ex: page login)
  if (status === "unauthenticated" || !session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow lg:ml-64 transition-all duration-300">
        <div className="p-4 lg:p-8 mt-14 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
