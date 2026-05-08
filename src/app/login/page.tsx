"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, HelpCircle } from "lucide-react";
import AboutModal from "@/components/AboutModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-white relative overflow-hidden">
      {/* Background Image with Fade for Mobile */}
      <div className="absolute inset-0 lg:hidden">
        <div 
          className="w-full h-full bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
      </div>

      {/* Left Side: Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-40 scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-2xl mb-8 shadow-2xl">
            <img src="/logo.png" alt="DNOSP Logo" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 uppercase text-white">DNOSP / EDU-NC</h1>
          <p className="text-xl text-slate-100 leading-relaxed font-bold drop-shadow-lg mb-10">
            Plateforme d'aide à la décision pédagogique et d'accompagnement des élèves de la 1ère à la 4ème HPR.
          </p>
          
          <button
            onClick={() => setIsAboutOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-sm font-bold transition-all"
          >
            <HelpCircle size={20} />
            Qui sommes-nous ?
          </button>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-between items-center mb-8">
              <div className="inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-md border border-slate-100">
                <img src="/logo.png" alt="DNOSP Logo" className="w-12 h-12 object-contain" />
              </div>
              <button
                onClick={() => setIsAboutOpen(true)}
                className="p-2 text-blue-600 font-bold text-sm flex items-center gap-1"
              >
                <HelpCircle size={18} />
                À propos
              </button>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Connexion
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              Veuillez entrer vos identifiants pour accéder à votre espace.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all duration-200"
                  placeholder="nom@exemple.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              Se connecter au portail
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-8 border-t border-slate-100">
            © 2026 DNOSP / EDU-NC. Tous droits réservés. Outil de décision pédagogique.
          </p>
        </div>
      </div>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </div>
  );
}
