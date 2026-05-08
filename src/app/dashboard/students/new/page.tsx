"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'enregistrement");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Enregistrer un nouvel élève (1ère HPR)
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Province éducationnelle
            </label>
            <input
              name="province"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Etablissement scolaire
            </label>
            <input
              name="etablissement"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ville (Cité)
            </label>
            <input
              name="ville"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Code élève
            </label>
            <input
              name="codeEleve"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom
            </label>
            <input
              name="nom"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Post-Nom
            </label>
            <input
              name="postNom"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Prénom
            </label>
            <input
              name="prenom"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sexe
            </label>
            <select
              name="sexe"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Lieu de naissance
            </label>
            <input
              name="lieuNaissance"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date de naissance
            </label>
            <input
              name="dateNaissance"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              AVIS du test
            </label>
            <select
              name="avisTest"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner</option>
              <option value="A">Favorable (Aptitude élevée)</option>
              <option value="B">A risque (Vocation/Aptitude faible)</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="flex items-center justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 font-bold py-2 px-4 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 transition"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
