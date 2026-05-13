"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileUp, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  ChevronRight,
  BarChart3,
  ClipboardList,
  TrendingUp
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const menuItems = [
    { 
      title: "Tableau de bord", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={20} />,
      active: pathname === "/dashboard"
    },
    { 
      title: "Statistiques", 
      href: "/dashboard/stats", 
      icon: <BarChart3 size={20} />,
      active: pathname === "/dashboard/stats"
    },
    { 
      title: "Matrice de suivi", 
      href: "/dashboard/matrix", 
      icon: <ClipboardList size={20} />,
      active: pathname === "/dashboard/matrix"
    },
    { 
      title: "Synthèse Suivi", 
      href: "/dashboard/summary", 
      icon: <TrendingUp size={20} />,
      active: pathname === "/dashboard/summary"
    },
    ...(isAdmin ? [
      { 
        title: "Nouvel Élève", 
        href: "/dashboard/students/new", 
        icon: <UserPlus size={20} />,
        active: pathname === "/dashboard/students/new"
      },
      { 
        title: "Créer Utilisateur", 
        href: "/dashboard/users/new", 
        icon: <Users size={20} />,
        active: pathname === "/dashboard/users/new"
      }
    ] : [])
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-800 text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-slate-900 text-slate-300 w-64 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col border-r border-slate-800 shadow-xl
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center space-x-3 text-white">
            <div className="bg-white p-1 rounded-lg">
              <img src="/logo.png" alt="DNOSP Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">DNOSP / EDU-NC</span>
          </Link>
        </div>

        {/* User Profile Summary */}
        <div className="p-4 mx-4 my-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Session active</p>
          <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
          <p className="text-[10px] text-blue-400 font-bold uppercase">{isAdmin ? "Administrateur" : "Conseiller"}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-4 space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                ${item.active 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "hover:bg-slate-800 hover:text-white"}
              `}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              {item.active && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/login";
            }}
            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
